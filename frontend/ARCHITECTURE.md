# 🏗️ Architecture — MediSuiv Frontend

## Vue d'ensemble

MediSuiv est une application Next.js full-stack avec une architecture modulaire :

```
┌─────────────────────────────────────────────────────────┐
│  Pages (App Router - Next.js 14)                       │
├─────────────────────────────────────────────────────────┤
│  • Public: Home, Login, Register                       │
│  • Protected: Dashboard Patient, Dashboard Doctor      │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Components (Reusable React Components)                │
├─────────────────────────────────────────────────────────┤
│  • ProtectedRoute (Auth HOC)                          │
│  • DashboardNavbar (Navigation)                        │
│  • Charts, Cards, Forms                               │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Lib (Business Logic, API, Utils)                     │
├─────────────────────────────────────────────────────────┤
│  • api.ts (API Layer - Mock/Axios)                    │
│  • types.ts (TypeScript definitions)                   │
│  • session.tsx (Auth State Management)               │
│  • mockData.ts (Development data)                     │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  External Services                                      │
├─────────────────────────────────────────────────────────┤
│  • localStorage (Session storage)                       │
│  • FastAPI Backend (Optional - prod)                   │
│  • MongoDB (Backend DB)                                │
└─────────────────────────────────────────────────────────┘
```

## 📁 Structure détaillée

```
frontend/
│
├── src/
│   ├── app/                          # Pages et layout
│   │   ├── page.tsx                 # Home (~150 lignes)
│   │   ├── login/page.tsx           # Login form (~140 lignes)
│   │   ├── register/page.tsx        # Registration form (~200 lignes)
│   │   ├── dashboard/
│   │   │   ├── patient/page.tsx     # Patient dashboard (~200 lignes)
│   │   │   └── doctor/
│   │   │       ├── page.tsx         # Doctor list (~200 lignes)
│   │   │       └── patient/[id]/page.tsx  # Patient details (~350 lignes)
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   │
│   ├── components/                  # Reusable components
│   │   ├── ProtectedRoute.tsx       # Route protection HOC
│   │   ├── DashboardNavbar.tsx      # Dashboard navigation bar
│   │   ├── AlertBell.tsx            # Alert notification
│   │   ├── AlertPanel.tsx           # Alert panel
│   │   ├── RiskBadge.tsx            # Risk level badge
│   │   ├── RiskHistoryChart.tsx     # Risk history chart
│   │   ├── ObservanceChart.tsx      # Observance chart
│   │   ├── StatCard.tsx             # KPI card
│   │   ├── PatientRow.tsx           # Patient table row
│   │   ├── RecommendCard.tsx        # Recommendation card
│   │   ├── SegmentCard.tsx          # Segment/profile card
│   │   ├── Navbar.tsx               # Home navbar
│   │   └── MessageThread.tsx        # Message thread
│   │
│   └── lib/                         # Business logic & utils
│       ├── api.ts                   # API layer (mock/axios)
│       ├── types.ts                 # TypeScript interfaces
│       ├── session.tsx              # Session management (Context)
│       ├── mockData.ts              # Mock data for development
│       └── utils.ts                 # Utility functions
│
├── public/                          # Static assets
├── .env.example                     # Environment template
├── .eslintrc.json                   # ESLint config
├── eslint.config.mjs                # ESLint rules
├── next.config.js                   # Next.js config
├── package.json                     # Dependencies
├── postcss.config.js                # PostCSS config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── README.md                         # Documentation
├── QUICKSTART.md                    # Quick start guide
└── ARCHITECTURE.md                  # This file
```

## 🔄 Data Flow

### Authentication Flow

```
User → Login Form
        ↓
      API (login)
        ↓
    localStorage.setSession()
        ↓
Session Provider updated
        ↓
useSession() hook triggers
        ↓
Redirect to Dashboard
```

### Dashboard Data Loading

```
Component Mount
    ↓
useEffect with dependencies
    ↓
Parallel API calls
    ↓
setState updates
    ↓
Component re-render
    ↓
Display data / Charts / Tables
```

## 🔐 Authentication & Authorization

### How it works

```typescript
// session.tsx - Context based authentication
SessionProvider
├── session: { role, userId }
├── setSession: (session) => void
└── ready: boolean

// ProtectedRoute.tsx - HOC for route protection
ProtectedRoute
├── Checks if session exists
├── Validates role matches
└── Redirects if unauthorized
```

### Routes Protection

| Route                           | Auth Required | Role    | Redirect                   |
| ------------------------------- | ------------- | ------- | -------------------------- |
| `/`                             | No            | Any     | —                          |
| `/login`                        | No            | Any     | Dashboard if authenticated |
| `/register`                     | No            | Any     | Dashboard if authenticated |
| `/dashboard/patient`            | Yes           | patient | Login                      |
| `/dashboard/doctor`             | Yes           | doctor  | Login                      |
| `/dashboard/doctor/patient/:id` | Yes           | doctor  | Login                      |

## 🎨 Component Architecture

### Component Types

```
Pages/Routes
    ├── Protected Pages (with ProtectedRoute HOC)
    │   ├── Fetch Data (useEffect)
    │   └── Render Components
    │
├── Public Pages
│   ├── Static Content
│   └── Links to Auth Pages
    │
Composable Components
    ├── UI Components (Cards, Badges, etc.)
    ├── Forms (Input, validation)
    └── Charts (Recharts wrappers)

Hooks
    ├── useSession() - Auth state
    ├── useState() - Local state
    └── useEffect() - Side effects
```

### Component Hierarchy Example (Patient Dashboard)

```
PatientDashboardPage
├── ProtectedRoute (with requiredRole="patient")
│   └── PatientDashboardContent
│       ├── DashboardNavbar
│       ├── KPI Cards (StatCard)
│       │   ├── Risk Level
│       │   ├── Observance
│       │   └── Patient Info
│       ├── Charts
│       │   ├── Observance LineChart
│       │   └── Risk History
│       └── Recommendations
│           └── RecommendCard (multiple)
```

## 🔗 API Layer

### Mock API (api.ts)

Used for development without backend:

```typescript
export async function login(email, password);
export async function getPatient(id);
export async function getPatientProfile(id);
export async function getRecommendedItems(id);
export async function getDoctor(userId);
export async function getAllPatients();
// ... more endpoints
```

### Integration with Real Backend

To use actual API endpoints:

```typescript
// Replace mock functions with Axios calls
export async function login(email: string, password: string) {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    { email, password }
  );
  return data;
}
```

## 📦 State Management

### Session State (Global)

```typescript
// Context API
useSession() → { session, setSession, ready }

// Flow
setSession({ role: "patient", userId: "pat_001" })
  → sessionState updated
  → all components re-render
  → localStorage persisted
```

### Component State (Local)

```typescript
// useState for local component state
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState("");
```

### Data Fetching

```typescript
// useEffect pattern
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await apiCall();
      setData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [dependencies]);
```

## 🎯 Key Features Implementation

### 1. Multi-Role Authentication

- Patient and Doctor roles
- Role-based route protection
- Different UI based on role

### 2. Dashboard Layouts

- Patient: Personal metrics, recommendations, history
- Doctor: Patient list, patient details

### 3. Data Visualization

- Recharts for charts (Line, Bar)
- Custom components for KPIs
- Responsive grid layouts

### 4. Responsive Design

- Mobile-first approach
- Tailwind breakpoints (sm, md, lg)
- Hamburger menu on mobile

## 🛠️ Development Guidelines

### Adding a New Page

```bash
# 1. Create page file
src/app/new-route/page.tsx

# 2. Add types if needed
src/lib/types.ts

# 3. Add API calls if needed
src/lib/api.ts

# 4. Import and use
// Wrap with ProtectedRoute if needed
<ProtectedRoute requiredRole="patient">
  <YourComponent />
</ProtectedRoute>
```

### Adding a New Component

```bash
# 1. Create component
src/components/MyComponent.tsx

# 2. Export from file
export function MyComponent({ props }) {
  return <div>...</div>
}

# 3. Use in pages/other components
<MyComponent prop="value" />
```

### Adding API Endpoints

```typescript
// src/lib/api.ts
export async function myNewEndpoint(id: string) {
  await delay();
  // Mock implementation or axios call
  return mockData.find((item) => item.id === id);
}
```

## 🚀 Performance Optimization

### Current

- Code splitting per route (Next.js automatic)
- Lazy loading components (React.lazy)
- Parallel data fetching
- Memoization with useState

### Future

- Dynamic imports for heavy components
- Image optimization
- Caching strategies
- React Query for data synchronization

## 🧪 Testing Strategy

### Unit Tests

- Components: React Testing Library
- Utils: Jest

### Integration Tests

- API layer: Mock API responses
- Flow: Auth → Dashboard → Data display

### E2E Tests

- Cypress/Playwright
- Full user journeys

## 📊 Performance Metrics

Current performance targets:

- Page load: < 2s
- Dashboard render: < 1s
- Data fetch: < 500ms
- Interactions: < 100ms

## 🔒 Security Considerations

### Current Implementation

- Session stored in localStorage (not secure for sensitive data)
- Mock JWT tokens (for development only)
- No credential transmission over network (mock)

### Production Recommendations

- Use HTTPOnly cookies for tokens
- Implement CSRF protection
- Add rate limiting
- Validate all inputs server-side
- Use OAuth2/OIDC for real auth

## 🚦 Build & Deployment

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm run start
```

### Deployment Platforms

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Docker + any server

## 📚 Dependencies Summary

| Package      | Version | Purpose         |
| ------------ | ------- | --------------- |
| next         | 14.2.5  | React framework |
| react        | 18.3.1  | UI library      |
| tailwindcss  | 3.4.6   | Styling         |
| recharts     | 2.12.7  | Charts          |
| lucide-react | 0.408.0 | Icons           |
| axios        | 1.7.2   | HTTP client     |
| jose         | 5.6.3   | JWT (optional)  |

## 🔄 Versioning & Updates

- Next.js: Keep up-to-date monthly
- Dependencies: Update quarterly
- Security patches: Apply immediately

## 📞 Support & Maintenance

### Common Issues

1. **Port conflict**: Use `npm run dev -- -p 3001`
2. **Build errors**: `rm -rf .next && npm install`
3. **Style issues**: Check tailwind.config.ts

### Debugging

- React DevTools browser extension
- Next.js debugging in VS Code
- Console logs for API issues

---

**Last Updated**: May 2026
