
# CapStone Photo Booking Website

A full-stack photo booking application with separate frontend and backend systems.

## 📁 Project Structure

```
CapStone/
├── frontend/                    # React + TypeScript frontend (PORT 5173)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Reusable UI components
│   │   │   ├── pages/           # Page components
│   │   │   ├── api.js           # API client
│   │   │   ├── App.tsx
│   │   │   └── routes.tsx
│   │   ├── styles/
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── backend/                     # Spring Boot Java backend (PORT 8081)
│   └── demo/
│       ├── src/main/java/com/booking/
│       ├── pom.xml
│       └── mvnw
│
└── README.md
```

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### Backend
```bash
cd backend/demo
mvn clean install
mvn spring-boot:run  # http://localhost:8081
```

## 🔧 Technologies

**Frontend**: React, TypeScript, Vite, Tailwind CSS, React Router
**Backend**: Spring Boot, Spring Security (JWT), MySQL

## 📚 Features

✅ User Authentication (JWT)
✅ Photo Gallery
✅ Booking Management (CRUD)
✅ Admin Functions
✅ Responsive Design
✅ REST API

## 📖 API Endpoints

Base: `http://localhost:8081/api`

- `POST /auth/login` - Login
- `POST /auth/register` - Register
- `GET/POST/PUT/DELETE /bookings` - Booking operations
- `GET/POST/DELETE /users` - User management

See [FIXES_APPLIED.md](./FIXES_APPLIED.md) for detailed changes and setup instructions.
  