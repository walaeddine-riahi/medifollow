import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from xgboost import XGBClassifier
from sklearn.metrics.pairwise import cosine_similarity

# Constants
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, 'dataset_after_cleaning.csv')
PATIENTS_PATH = os.path.join(BASE_DIR, 'patients.csv')
ITEMS_PATH = os.path.join(BASE_DIR, 'items.csv')
INTERACTIONS_PATH = os.path.join(BASE_DIR, 'interactions.csv')

class MLService:
    def __init__(self):
        self.dso1_model = None
        self.dso1_scaler = None
        self.dso2_model = None
        self.dso2_scaler = None
        self.dso3_user_item_matrix = None
        self.dso3_user_sim = None
        self.items_df = None
        self.interactions_df = None
        self.patients_df = None
        
        self.train_all()

    def train_all(self):
        print("Training models...")
        self._train_dso1()
        self._train_dso2()
        self._train_dso3()
        print("All models trained successfully.")

    def _train_dso1(self):
        if not os.path.exists(DATASET_PATH):
            print(f"Warning: {DATASET_PATH} not found.")
            return
        
        df = pd.read_csv(DATASET_PATH)
        y = df['risque_complication']
        X = df.drop(columns=['risque_complication'])
        
        # Rename columns to match API features
        column_mapping = {
            'duree_derniere_hospit': 'duree_hospitalisation',
            'nb_comorbidites': 'nb_diagnostics',
            'observance': 'observance_traitement',
            'score_autonomie': 'score_questionnaire'
        }
        X = X.rename(columns=column_mapping)
        
        self.dso1_scaler = StandardScaler()
        num_features = ['age', 'imc', 'freq_cardiaque', 'pa_systolique', 'pa_diastolique',
                        'spo2', 'temperature', 'duree_hospitalisation', 'nb_diagnostics',
                        'observance_traitement', 'score_questionnaire']
        
        available_features = [f for f in num_features if f in X.columns]
        X_scaled = self.dso1_scaler.fit_transform(X[available_features])
        
        # Calculate class weight for imbalance
        pos_count = (y == 1).sum()
        neg_count = (y == 0).sum()
        scale_weight = neg_count / pos_count if pos_count > 0 else 1
        
        self.dso1_model = XGBClassifier(
            n_estimators=200, 
            max_depth=6, 
            learning_rate=0.05, 
            scale_pos_weight=scale_weight,
            random_state=42,
            use_label_encoder=False,
            eval_metric='logloss'
        )
        self.dso1_model.fit(X_scaled, y)
        self.dso1_features = available_features

    def _train_dso2(self):
        if not os.path.exists(DATASET_PATH):
            return
            
        df = pd.read_csv(DATASET_PATH)
        
        # Rename columns
        column_mapping = {
            'duree_derniere_hospit': 'duree_hospitalisation',
            'nb_comorbidites': 'nb_diagnostics',
            'observance': 'observance_traitement',
            'score_autonomie': 'score_questionnaire'
        }
        df = df.rename(columns=column_mapping)

        # DSO2 features as per notebook inspection
        features = ['age', 'freq_cardiaque', 'spo2', 'imc', 'duree_hospitalisation']
        available_features = [f for f in features if f in df.columns]
        
        self.dso2_scaler = StandardScaler()
        X_scaled = self.dso2_scaler.fit_transform(df[available_features])
        
        self.dso2_model = KMeans(n_clusters=3, random_state=42, n_init=10)
        self.dso2_model.fit(X_scaled)
        self.dso2_features = available_features

    def _train_dso3(self):
        if not all(os.path.exists(p) for p in [PATIENTS_PATH, ITEMS_PATH, INTERACTIONS_PATH]):
            return
            
        self.patients_df = pd.read_csv(PATIENTS_PATH)
        self.items_df = pd.read_csv(ITEMS_PATH)
        self.interactions_df = pd.read_csv(INTERACTIONS_PATH)
        
        n_patients = self.patients_df['patient_id'].max() + 1
        n_items = self.items_df['item_id'].max() + 1
        
        self.dso3_user_item_matrix = np.zeros((n_patients, n_items))
        for _, row in self.interactions_df.iterrows():
            pid, iid = int(row['patient_id']), int(row['item_id'])
            if pid < n_patients and iid < n_items:
                self.dso3_user_item_matrix[pid, iid] = row['rating']
                
        self.dso3_user_sim = cosine_similarity(self.dso3_user_item_matrix)
        np.fill_diagonal(self.dso3_user_sim, 0)

    def predict_risk(self, data: dict):
        if self.dso1_model is None:
            return "moyen"
            
        # Prepare input
        input_df = pd.DataFrame([data])
        # Filter features
        available = [f for f in self.dso1_features if f in input_df.columns]
        # Fill missing with mean or 0
        for f in self.dso1_features:
            if f not in input_df.columns:
                input_df[f] = 0 
                
        X_scaled = self.dso1_scaler.transform(input_df[self.dso1_features])
        prob_low_risk = self.dso1_model.predict_proba(X_scaled)[0][1]
        
        # Prob of class 1 = Prob of Low Risk
        if prob_low_risk > 0.7: return "faible"
        if prob_low_risk > 0.3: return "moyen"
        return "élevé"

    def segment_patient(self, data: dict):
        if self.dso2_model is None:
            return 0, "Cluster 0"
            
        input_df = pd.DataFrame([data])
        for f in self.dso2_features:
            if f not in input_df.columns:
                input_df[f] = 0
                
        X_scaled = self.dso2_scaler.transform(input_df[self.dso2_features])
        cluster_id = int(self.dso2_model.predict(X_scaled)[0])
        
        labels = {
            0: "Patients chroniques observants",
            1: "Profils à risque variable",
            2: "Nouveaux patients à suivre"
        }
        return cluster_id, labels.get(cluster_id, f"Cluster {cluster_id}")

    def get_recommendations(self, patient_id: int, top_n=5, vitals: dict = None, risk_level: str = None):
        if self.dso3_user_sim is None or self.interactions_df is None:
            return []
            
        # 1. Base scores from Collaborative Filtering
        user_preds = np.zeros(self.dso3_user_item_matrix.shape[1])
        
        if patient_id < len(self.dso3_user_sim) and self.dso3_user_item_matrix[patient_id].sum() > 0:
            sims = self.dso3_user_sim[patient_id]
            for iid in range(self.dso3_user_item_matrix.shape[1]):
                if self.dso3_user_item_matrix[patient_id, iid] == 0:
                    ratings = self.dso3_user_item_matrix[:, iid]
                    mask = (ratings > 0) & (sims > 0)
                    if mask.sum() > 0:
                        pred = np.sum(sims[mask] * ratings[mask]) / (np.abs(sims[mask]).sum() + 1e-8)
                        user_preds[iid] = pred
        else:
            # Cold start or no interactions: Base on pathology popularity
            if self.patients_df is not None and patient_id < len(self.patients_df):
                pathology = self.patients_df.iloc[patient_id]['type_pathologie']
                relevant_pids = self.patients_df[self.patients_df['type_pathologie'] == pathology]['patient_id']
                pathology_items = self.interactions_df[self.interactions_df['patient_id'].isin(relevant_pids)].groupby('item_id')['rating'].mean()
                for iid, score in pathology_items.items():
                    if iid < len(user_preds):
                        user_preds[int(iid)] = score

        # 2. Contextual Dynamic Boosting (based on Vitals)
        if vitals:
            # Temperature boost (Item 2: Prise temperature)
            temp = vitals.get('temperature', 0)
            if temp > 37.8:
                user_preds[2] += 2.0  # Strong boost
            elif temp > 37.2:
                user_preds[2] += 0.5  # Subtle boost

            # SPO2 / Respiratory boost (Item 1: Suivi symptomes, Item 4: Visite pneumologue)
            spo2 = vitals.get('spo2', 100)
            if spo2 < 94:
                user_preds[1] += 1.5
                user_preds[4] += 1.0
            
            # BPM boost
            bpm = vitals.get('freq_cardiaque', 70)
            if bpm > 100 or bpm < 50:
                user_preds[1] += 0.8 # Monitor symptoms

        # 3. Risk-level Boosting
        if risk_level == "élevé":
            # Boost medical visits or critical monitoring
            if 4 < len(user_preds): user_preds[4] += 1.0 # Pneumologue/Consultation
            if 1 < len(user_preds): user_preds[1] += 0.5 # Suivi symptomes
            
        # Final ranking
        recommended_ids = np.argsort(user_preds)[::-1][:top_n]
        return [str(int(iid)) for iid in recommended_ids if user_preds[iid] > 0]

ml_service = MLService()
