# DD — Professional Nursing Portfolio

A modern, responsive nursing portfolio website built with React, TypeScript, Vite, Tailwind CSS, and Supabase.

The portfolio includes a secure admin panel for managing profile information, education, clinical experience, skills, certifications, projects, achievements, and contact messages.

---

## ✨ Features

### Public Portfolio

- Responsive nursing portfolio
- Professional hero section
- About/profile information
- Education history
- Clinical experience
- Skills
- Certifications
- Projects
- Achievements
- Contact form
- Resume/document viewer
- SEO-friendly metadata
- Open Graph and Twitter metadata
- Dynamic profile information
- Accessible UI components
- Mobile-first responsive design

### Admin Panel

- Secure admin authentication
- Admin-only dashboard
- Profile management
- Education CRUD
- Clinical experience CRUD
- Skills CRUD
- Certifications CRUD
- Projects CRUD
- Achievements CRUD
- Contact message management
- Item reordering
- Validation and error handling
- Protected administrative operations

---

## 🛠️ Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

### Backend / Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)
- Supabase RPC functions
- Supabase Realtime

### Development Tools

- ESLint
- TypeScript ESLint
- PostCSS
- Autoprefixer
- Git
- GitHub

---

## 📁 Project Structure

```text
DD/
├── public/
│   └── documents/
│
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── sections/
│   │   └── ...
│   │
│   ├── hooks/
│   │   └── usePortfolioData.ts
│   │
│   ├── lib/
│   │   ├── auth.tsx
│   │   └── supabase.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── ...
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts