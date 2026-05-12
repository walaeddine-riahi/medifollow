# MediSuiv — Plateforme de suivi post-hospitalisation

Une plateforme académique de suivi post-hospitalisation combinant **Machine Learning** et une interface utilisateur moderne pour patients et médecins.

## 🎯 Caractéristiques principales

### 🤖 Trois modèles ML cohabitent

1. **DSO1 — Prédiction du risque** (Random Forest)

   - Prédit le niveau de risque (faible/moyen/élevé) pour chaque patient
   - Basé sur : âge, sexe, pathologie, comorbidités, observance

2. **DSO2 — Segmentation de patientèle** (K-Means)

   - Regroupe les patients en 4 profils cliniques distincts
   - Patients autonomes, chroniques, multi-comorbidités, jeunes en rémission

3. **DSO3 — Recommandation de soins** (Filtrage collaboratif)
   - Top-5 soins personnalisés pour chaque patient
   - Adapté à la pathologie et au niveau d'autonomie

### 👥 Deux types d'utilisateurs

#### Patient

- **Dashboard personnel** avec métriques de suivi
- **Historique du risque** avec évolution graphique
- **Observance** : suivi des recommandations
- **Recommandations personnalisées** adaptées à son profil
- **Profil ML** : appartenance à un cluster, description du profil

#### Médecin

- **Liste de tous les patients** avec filtrage/recherche
- **Vue synthétique** : risque, observance, dernier suivi
- **Fiche patient détaillée** :
  - Informations démographiques et cliniques
  - Historique des interactions et évaluations
  - Recommandations actives
  - Profil ML détaillé
  - Graphiques d'évolution
- **Actions** : envoi de messages, export de rapports

## 🚀 Installation

### Prérequis

- **Node.js** 18.17.0+
- **npm** ou **yarn**

### Étapes d'installation

```bash
# Cloner le repository
git clone <repository-url>
cd medical_app/frontend

# Installer les dépendances
npm install
# ou
yarn install

# Configurer les variables d'environnement (optionnel)
cp .env.example .env.local
```

## 🎮 Lancement

### Mode développement

```bash
npm run dev
# ou
yarn dev
```

L'application est accessible à : **http://localhost:3000**

### Mode production

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 🔐 Authentification

### Comptes de démonstration

La plateforme utilise une authentification mock côté client pour le développement.

#### Patient

- **Email** : `demo@patient.com`
- **Mot de passe** : `demo`

#### Médecin

- **Email** : `demo@doctor.com`
- **Mot de passe** : `demo`

### Processus d'authentification

1. Aller à la page **Connexion** (`/login`)
2. Entrer vos identifiants
3. Le système détecte automatiquement votre rôle (patient/médecin)
4. Redirection vers le dashboard approprié

### Création de compte

1. Aller à **Créer un compte** (`/register`)
2. Remplir le formulaire avec :
   - Prénom et nom
   - Rôle (Patient ou Médecin)
   - Pour médecin : spécialité et RPPS
   - Email et mot de passe
3. Validation et création de compte
4. Connexion automatique après création

## 📁 Structure du projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Page d'accueil
│   │   ├── login/page.tsx        # Connexion
│   │   ├── register/page.tsx     # Inscription
│   │   ├── dashboard/
│   │   │   ├── patient/page.tsx  # Dashboard patient
│   │   │   └── doctor/
│   │   │       ├── page.tsx      # Dashboard médecin
│   │   │       └── patient/[id]/page.tsx  # Fiche patient
│   │   ├── layout.tsx            # Layout racine
│   │   └── globals.css           # Styles globaux
│   ├── components/
│   │   ├── ProtectedRoute.tsx    # Protection des routes
│   │   ├── DashboardNavbar.tsx   # Navigation
│   │   ├── AlertBell.tsx
│   │   ├── AlertPanel.tsx
│   │   ├── RiskBadge.tsx
│   │   └── ...
│   └── lib/
│       ├── api.ts               # Couche API (mock)
│       ├── session.tsx          # Gestion session
│       ├── types.ts             # Types TypeScript
│       ├── mockData.ts          # Données de démo
│       └── utils.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🎨 Stack technologique

- **Framework** : [Next.js 14](https://nextjs.org/)
- **UI Components** : [Lucide React](https://lucide.dev/)
- **Styling** : [Tailwind CSS 3](https://tailwindcss.com/)
- **Charts** : [Recharts](https://recharts.org/)
- **HTTP Client** : [Axios](https://axios-http.com/)
- **State Management** : [React Query](https://tanstack.com/query/)
- **Authentication** : JWT (mock client-side)

## 🔗 Intégration avec backend FastAPI

Par défaut, la plateforme utilise des données mock pour le développement front-end.

Pour intégrer avec une API FastAPI :

### 1. Configuration

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2. Remplacement des appels API

Modifier les fonctions dans `src/lib/api.ts` pour utiliser Axios :

```typescript
export async function login(email: string, password: string) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    { email, password }
  );
  return response.data;
}
```

## 🎓 Points clés de conception

### Système de session

- Stockage dans `localStorage` pour persistance
- Context API pour accès global
- `useSession()` hook pour utilisation dans composants

### Routes protégées

- Composant `ProtectedRoute` HOC
- Redirige vers login si non authentifié
- Redirige si mauvais rôle

### Responsive Design

- Mobile-first approach
- Breakpoints : sm, md, lg
- Tailwind CSS utilities

### Accessibilité

- Labels explicites sur tous les inputs
- Contraste couleur respecté
- Navigation au clavier

## 📊 Base de données (structure attendue)

### Collections MongoDB

```javascript
// users
{
  _id: ObjectId,
  email: String,
  role: "patient" | "doctor",
  firstName: String,
  lastName: String,
  createdAt: Date
}

// patients
{
  _id: ObjectId,
  userId: ObjectId,
  firstName: String,
  lastName: String,
  age: Number,
  sexe: "M" | "F",
  typePathologie: String,
  nbComorbidites: Number,
  scoreAutonomie: Number,
  doctorId: ObjectId,
  createdAt: Date
}

// doctors
{
  _id: ObjectId,
  userId: ObjectId,
  firstName: String,
  lastName: String,
  specialite: String,
  rpps: String,
  email: String
}

// patient_profiles (sortie DSO2)
{
  patientId: ObjectId,
  niveauRisque: "faible" | "moyen" | "élevé",
  clusterId: Number,
  clusterLabel: String,
  observance: Number,
  topRecommendations: [ObjectId],
  updatedAt: Date
}

// interactions
{
  patientId: ObjectId,
  itemId: ObjectId,
  rating: Number,
  completed: Boolean,
  nbFoisRealise: Number,
  timestamp: Date
}

// alerts
{
  patientId: ObjectId,
  doctorId: ObjectId,
  oldRisk: String,
  newRisk: String,
  triggered: Date
}

// messages
{
  senderId: ObjectId,
  receiverId: ObjectId,
  content: String,
  read: Boolean,
  timestamp: Date
}
```

## 🚨 Alertes et notifications

- **WebSocket** (à implémenter) pour notifications temps réel
- **Alertes critiques** : changement de risque élevé
- **Notifications** : nouvelles recommandations, demandes du médecin

## 📱 Mobile Support

L'application est **entièrement responsive** :

- Affichage adapté sur mobile (< 640px)
- Menu hamburger mobile
- Layouts adaptatifs

## 🧪 Tests

```bash
# Lancer les tests
npm run test

# Couverture
npm run test:coverage
```

## 🐛 Troubleshooting

### La connexion ne fonctionne pas

- Vérifier que vous utilisez `demo@patient.com` ou `demo@doctor.com`
- Vérifier le mot de passe : `demo`
- Vérifier que JavaScript est activé

### Les données ne se chargent pas

- Vérifier la console pour les erreurs
- Vérifier que les fonctions API retournent bien les données
- Vérifier que `localStorage` est disponible

### Erreurs de style Tailwind

- Nettoyer le cache : `rm -rf .next`
- Réinstaller les dépendances : `npm install`
- Vérifier que `tailwind.config.ts` est correct

## 📧 Support et contact

Pour des questions ou signaler des bugs :

- Ouvrir une issue sur le repository
- Contacter l'équipe développement

## 📄 Licence

Projet académique - Propriété du groupe (2026)

## 🔄 Roadmap

- [ ] Intégration WebSocket pour notifications temps réel
- [ ] Système de messaging avancé
- [ ] Export de rapports PDF
- [ ] Graphiques avancés avec prédictions
- [ ] Intégration HL7/FHIR
- [ ] Tests unitaires et E2E complets
- [ ] Authentification OAuth2
- [ ] Audit trail complet

---

**Dernière mise à jour** : Mai 2026
