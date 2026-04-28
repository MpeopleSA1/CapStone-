# Developer Guide - CapStone Photo Booking

This guide explains how to work with the CapStone project structure with separate frontend and backend.

## 📂 Project Organization

```
CapStone/
├── frontend/          # React + TypeScript (Port 5173)
├── backend/           # Spring Boot Java (Port 8081)
├── README.md          # Project overview
└── DEVELOPER_GUIDE.md # This file
```

## 🚀 Quick Start

### Option 1: Run Both Simultaneously (Recommended)

**Terminal 1 - Backend**:
```bash
cd backend/demo
mvn clean install
mvn spring-boot:run
```
Expected output: "Started BookingApplication in X seconds"

**Terminal 2 - Frontend** (open new terminal):
```bash
cd frontend
npm install  # First time only
npm run dev
```
Expected output: "Local: http://localhost:5173"

### Option 2: Build Production

```bash
# Frontend
cd frontend
npm run build  # Creates dist/ folder

# Backend
cd backend/demo
mvn clean package  # Creates JAR file
```

## 🔄 Development Workflow

### 1. Start Backend First
Backend must run before frontend makes API calls.

```bash
cd backend/demo
mvn spring-boot:run
```
- Accessible at: `http://localhost:8081`
- API endpoints at: `http://localhost:8081/api`

### 2. Start Frontend
In a new terminal:

```bash
cd frontend
npm run dev
```
- Accessible at: `http://localhost:5173`
- Auto-reloads on file changes
- API calls to backend on localhost:8081

### 3. Test Application

1. Open http://localhost:5173 in browser
2. Click "Register" or "Login"
3. Create account or login
4. Navigate to "Book Now"
5. Create a booking

## 📁 File Structure Quick Reference

### Frontend Key Files

| Path | Purpose |
|------|---------|
| `frontend/src/app/api.js` | API client configuration |
| `frontend/src/app/routes.tsx` | Route definitions |
| `frontend/src/app/pages/` | Page components |
| `frontend/src/app/components/Navigation.tsx` | Main navigation |
| `frontend/package.json` | Frontend dependencies |

### Backend Key Files

| Path | Purpose |
|------|---------|
| `backend/demo/pom.xml` | Backend dependencies |
| `backend/demo/src/main/resources/application.properties` | Configuration |
| `backend/demo/src/main/java/com/booking/` | Source code |
| `backend/demo/src/main/resources/BookingDB.sql` | Database schema |

## 🔐 Configuration

### Frontend API URL

File: `frontend/src/app/api.js`

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
```

Or set environment variable:
```bash
# .env file in frontend/
VITE_API_BASE_URL=http://localhost:8081/api
```

### Backend Database

File: `backend/demo/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/BookingDB
spring.datasource.username=root
spring.datasource.password=your_password
```

### Backend JWT

```properties
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
```

## 🔄 Adding New Features

### Adding a New Backend Endpoint

1. Create controller in `backend/demo/src/main/java/com/booking/controller/`
2. Add service in `backend/demo/src/main/java/com/booking/service/`
3. Test with Postman or curl
4. Document in this guide

Example:
```java
@RestController
@RequestMapping("/api/photos")
public class PhotoController {
    @GetMapping
    public List<Photo> getAllPhotos() {
        // Implementation
    }
}
```

### Adding a New Frontend Page

1. Create component in `frontend/src/app/pages/YourPage.tsx`
2. Add route in `frontend/src/app/routes.tsx`
3. Add link in `frontend/src/app/components/Navigation.tsx`

Example:
```typescript
// routes.tsx
{
    path: '/your-route',
    element: <Layout><YourPage /></Layout>
}
```

### Adding API Call

1. Add function in `frontend/src/app/api.js`:
```javascript
export const getPhotos = () => api.get('/photos');
```

2. Use in component:
```typescript
import { getPhotos } from '../api';

const response = await getPhotos();
```

## 🧪 Testing

### Backend Testing

```bash
cd backend/demo
mvn test
```

### Frontend Testing

```bash
cd frontend
npm test  # If configured
```

### Manual Testing

1. **Postman**: Test API endpoints directly
2. **Browser DevTools**: Check network requests
3. **Browser Console**: Check for errors

## 🐛 Debugging

### Frontend Debugging

1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for API calls
4. Use React DevTools extension

### Backend Debugging

1. Check console output
2. Check MySQL logs
3. Add breakpoints in IDE
4. Check application.properties for issues

## 📋 Common Tasks

### Database Issues

**Reset database**:
```bash
# Login to MySQL
mysql -u root -p

# Drop and recreate
DROP DATABASE BookingDB;
CREATE DATABASE BookingDB;
SOURCE backend/demo/src/main/resources/BookingDB.sql;
```

### Port Already in Use

**Frontend (5173)**:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

**Backend (8081)**:
```bash
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8081
kill -9 <PID>
```

### Clear Cache

**Frontend**:
```bash
# Clear npm cache
npm cache clean --force

# Clear node_modules
rm -rf frontend/node_modules frontend/package-lock.json
npm install
```

**Backend**:
```bash
mvn clean
```

## 📊 Project Status

✅ Frontend structure organized
✅ Backend structure organized
✅ API integration working
✅ Authentication implemented
✅ CRUD operations ready
✅ Database configured

## 🎯 Next Steps

- [ ] Add unit tests
- [ ] Configure CI/CD
- [ ] Add logging system
- [ ] Implement pagination
- [ ] Add email notifications
- [ ] Deploy to production

## 📚 Additional Resources

- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [Main README](README.md)
- [Fixes Applied](FIXES_APPLIED.md)

## 🤝 Team Guidelines

### Code Style

**Frontend**:
- Use TypeScript where possible
- Follow React best practices
- Use functional components
- Use hooks instead of class components

**Backend**:
- Follow Java naming conventions
- Use proper exception handling
- Add JavaDoc comments
- Use dependency injection

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description"

# Push to remote
git push origin feature/feature-name
```

### Commit Messages

```
feat: add new feature
fix: fix bug
docs: update documentation
refactor: refactor code
test: add tests
style: formatting changes
```

## 📞 Troubleshooting

**Not seeing changes?**
- Restart dev server
- Clear browser cache (Ctrl+Shift+Delete)
- Check console for errors

**API not responding?**
- Verify backend is running (`http://localhost:8081`)
- Check network tab in DevTools
- Review backend logs

**Database not connecting?**
- Verify MySQL is running
- Check credentials in application.properties
- Ensure database exists

For more help, check individual README files in frontend/ and backend/ folders.
