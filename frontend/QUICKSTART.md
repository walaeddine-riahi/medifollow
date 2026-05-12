# 🚀 MediSuiv — Guide de démarrage rapide

## 5 minutes pour démarrer

### 1. Installation des dépendances (1 min)

```bash
npm install
```

### 2. Démarrer le serveur de développement (10 sec)

```bash
npm run dev
```

✅ Application accessible : http://localhost:3000

### 3. Se connecter (1 min)

**Accès Patient:**

- Email : `demo@patient.com`
- Password : `demo`

**Accès Médecin:**

- Email : `demo@doctor.com`
- Password : `demo`

### 4. Explorer

#### Pour les Patients

- [Dashboard Patient](http://localhost:3000/dashboard/patient)
- Voir vos métriques de risque et observance
- Consulter vos recommandations personnalisées
- Visualiser votre historique

#### Pour les Médecins

- [Dashboard Médecin](http://localhost:3000/dashboard/doctor)
- Consulter la liste de vos patients
- Cliquer sur "Voir" pour accéder à la fiche patient
- Analyser les interactions et l'observance

---

## 🎯 Fonctionnalités principales

### Patient

| Feature         | URL                  | Description                              |
| --------------- | -------------------- | ---------------------------------------- |
| Mon Dashboard   | `/dashboard/patient` | Vue synthétique de mon suivi             |
| Recommandations | Dashboard            | Soins recommandés (personnalisés via ML) |
| Observance      | Dashboard            | Taux de suivi des recommandations        |
| Historique      | Dashboard            | Évolution du risque au fil du temps      |

### Médecin

| Feature         | URL                             | Description                       |
| --------------- | ------------------------------- | --------------------------------- |
| Mes Patients    | `/dashboard/doctor`             | Liste complète de mes patients    |
| Fiche Patient   | `/dashboard/doctor/patient/:id` | Détails complet d'un patient      |
| Interactions    | Fiche Patient                   | Historique des actions du patient |
| Recommandations | Fiche Patient                   | Soins recommandés pour ce patient |

---

## 🔧 Commands disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur (port 3000)
npm run build           # Build production
npm run start           # Démarrer l'app en production
npm run lint            # Vérifier le code (ESLint)

# Utils
npm run clean           # Nettoyer .next
```

---

## 📊 Données de test

### Patients disponibles

```
1. Demo Patient (demo@patient.com)
   - Âge : 67 ans
   - Pathologie : Cardiovasculaire
   - Risque : Élevé
   - Observance : 58%

2. Sophie Martin (sophie.martin@example.com)
   - Âge : 67 ans
   - Pathologie : Cardiovasculaire
   - Risque : Élevé
   - Observance : 58%

3. Jean Lefebvre (jean.lefebvre@example.com)
   - Âge : 74 ans
   - Pathologie : Respiratoire
   - Risque : Élevé
   - Observance : 42%

4. Inès Bouchard (ines.bouchard@example.com)
   - Âge : 42 ans
   - Pathologie : Oncologique
   - Risque : Faible
   - Observance : 84%

5. Marc Rousseau (marc.rousseau@example.com)
   - Âge : 58 ans
   - Pathologie : Diabète
   - Risque : Moyen
   - Observance : 70%

6. Léa Garnier (lea.garnier@example.com)
   - Âge : 35 ans
   - Pathologie : Post-chirurgicale
   - Risque : Faible
   - Observance : 91%
```

### Médecins disponibles

```
1. Demo Doctor (demo@doctor.com)
   - Spécialité : Médecine générale
   - Patients : 1 (Demo Patient)

2. Amélie Dubois (amelie.dubois@medisuiv.fr)
   - Spécialité : Cardiologie
   - Patients : 4

3. Karim Mansouri (karim.mansouri@medisuiv.fr)
   - Spécialité : Médecine interne
   - Patients : 2
```

---

## 🎨 Pages disponibles

### Public

- `/` : Page d'accueil
- `/login` : Connexion
- `/register` : Inscription

### Patient (protégées)

- `/dashboard/patient` : Dashboard patient

### Médecin (protégées)

- `/dashboard/doctor` : Dashboard médecin
- `/dashboard/doctor/patient/:id` : Fiche patient détaillée

---

## 💾 Données persistantes

Les données de session sont stockées dans `localStorage` :

- Session utilisateur
- Token (fictif)
- Préférences

Les données patientes/médicales sont mockées en mémoire (chargement à chaque rechargement de page).

---

## 🔗 Architecture

```
┌─────────────────────────────────────────────────┐
│         Next.js Frontend (Port 3000)            │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │         React Components                 │  │
│  │  (Page, Dashboard, ProtectedRoute)      │  │
│  └──────────────────────────────────────────┘  │
│                     ↓                          │
│  ┌──────────────────────────────────────────┐  │
│  │      API Layer (Mock/Axios)             │  │
│  │  (auth, patients, doctors, ML)          │  │
│  └──────────────────────────────────────────┘  │
│                     ↓                          │
│  ┌──────────────────────────────────────────┐  │
│  │    Session Management (localStorage)    │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
         ↓ (Backend optionnel)
┌─────────────────────────────────────────────────┐
│     FastAPI Backend + MongoDB (Port 8000)      │
│  (À implémenter selon les besoins)            │
└─────────────────────────────────────────────────┘
```

---

## 🎓 Points clés à retenir

1. **Authentification** : Mock côté client avec localStorage
2. **Données** : Mock en mémoire (À remplacer par API réelle)
3. **Styles** : Tailwind CSS avec palette médicale
4. **Charts** : Recharts pour visualisations
5. **État** : React Context + useState

---

## 🐛 Troubleshooting

### Port 3000 déjà utilisé

```bash
# Utiliser un autre port
npm run dev -- -p 3001
```

### Erreurs de build

```bash
# Nettoyer et rebuild
rm -rf .next
npm run build
```

### localStorage vide après déconnexion

```bash
# Comportement normal - À chaque connexion, les données sont rechargées
```

---

## 📚 Documentation complète

Voir [README.md](./README.md) pour la documentation détaillée

---

**Questions?** Consultez le README.md ou les commentaires dans le code source.

Bon développement! 🚀
