# 🚀 Projet INTELLECT BUILDING — Next.js Frontend + NestJS Backend

Une plateforme SaaS BTP moderne combinant **NestJS** (backend solide, API, JWT, rôles, test formateur) et **Next.js** (frontend vitrine, dashboard dynamique, test interactif).

---

## 🌐 Architecture générale
```
project_root/
│
├── backend/              # NestJS
│   ├── src/
│   │   ├── auth/         # JWT, rôles, login
│   │   ├── users/        # gestion utilisateurs + test
│   │   ├── chantiers/
│   │   ├── devis/
│   │   └── formations/
│   └── main.ts
│
└── frontend/             # Next.js
    ├── app/              # pages (Next.js App Router)
    │   ├── page.tsx      # Vitrine
    │   ├── login/        # Auth + choix de rôle
    │   ├── test/         # Test formateur
    │   └── dashboard/    # Dashboard selon rôle
    ├── components/
    ├── lib/              # axios, auth helpers
    └── styles/           # TailwindCSS
```

---

## 👥 Rôles définis
- **Admin** → gestion totale de la plateforme
- **Formateur** → création contenus, validation test formateur, supervision
- **Étudiant** → accès cours et progression
- **Client** → demande de devis et suivi chantier

> Note : Seul le rôle Formateur passe un test de compétences pour valider le rôle.

---

## ⚡ Fonctionnalités clés
- Vitrine publique moderne
- Auth JWT + choix de rôle
- Test formateur interactif
- Dashboard dynamique selon rôle
- Gestion devis, chantiers, formations
- Chat interne / notifications en temps réel (via Socket.IO)

---

## 🧱 Backend — NestJS

### 1️⃣ Initialisation du projet
```bash
npm i -g @nestjs/cli
nest new backend
cd backend
```

### 2️⃣ Installation des dépendances principales
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs class-validator class-transformer
npm install @nestjs/websockets socket.io socket.io-client
npm install @prisma/client prisma  # si vous utilisez Prisma ORM
```

### 3️⃣ Démarrage serveur dev
```bash
npm run start:dev
```

---

## ⚛️ Frontend — Next.js

### 1️⃣ Initialisation
```bash
npx create-next-app@latest frontend
cd frontend
```

### 2️⃣ Installation dépendances
```bash
npm install axios tailwindcss @headlessui/react
npx tailwindcss init -p
```

### 3️⃣ Démarrage dev
```bash
npm run dev
```

---

## 🔗 Communication Frontend ↔ Backend
- Axios pour appels API NestJS
- JWT pour authentification et rôle
- Socket.IO pour chat et notifications en temps réel

Exemple instance axios :
```ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});
```

---

## 🧩 Commandes globales

- **Backend**
```bash
cd backend
npm run start:dev
```

- **Frontend**
```bash
cd frontend
npm run dev
```

---

## 🔮 Prochaines étapes
- Création des modèles utilisateurs et rôles dans NestJS
- Endpoints auth, dashboard, test formateur
- Template frontend minimal pour vitrine + login + dashboard
- Intégration test formateur interactif
- Système Socket.IO pour chat et notifications

