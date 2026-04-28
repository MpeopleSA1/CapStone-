# Frontend - Photo Booking Website

React + TypeScript frontend application for the CapStone photo booking system.

## 📁 Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Navigation.tsx       # Main navbar with auth
│   │   │   ├── Footer.tsx           # Footer component
│   │   │   ├── figma/
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   └── ui/                  # Shadcn UI components
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── Gallery.tsx          # Photo gallery
│   │   │   ├── About.tsx            # About page
│   │   │   ├── Contact.tsx          # Contact form
│   │   │   ├── Login.tsx            # User login
│   │   │   ├── Register.tsx         # User registration
│   │   │   ├── Booking.jsx          # Create booking
│   │   │   ├── BookingList.jsx      # View/manage bookings
│   │   │   └── EditBooking.tsx      # Edit booking
│   │   │
│   │   ├── api.js                   # Axios API client
│   │   ├── App.tsx                  # Main app component
│   │   ├── routes.tsx               # React Router config
│   │   └── Documentation/           # Additional docs
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── fonts.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   │
│   ├── main.tsx                     # React entry point
│   └── Main.java                    # (Legacy - can delete)
│
├── package.json
├── vite.config.ts                   # Vite configuration
├── index.html                       # HTML entry point
├── postcss.config.mjs               # PostCSS config
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.3.1+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Development

**Dev Server**: http://localhost:5173

The development server includes:
- Hot module replacement (HMR)
- Fast refresh for React components
- Vite's lightning-fast build system

## 🔑 Key Features

### Pages
- **Home**: Hero section with featured work
- **Gallery**: Photo showcase with lightbox
- **About**: Company information and features
- **Contact**: Contact form
- **Login**: User authentication
- **Register**: New user account creation
- **Booking**: Create new photo booking
- **BookingList**: View and manage bookings
- **EditBooking**: Update booking details

### Authentication
- JWT-based authentication
- Token stored in localStorage
- Automatic token refresh in headers
- Protected routes for authenticated users

### UI Components
- Responsive navigation with mobile menu
- Form inputs with validation
- Status badges for bookings
- Lightbox gallery viewer
- Tailwind CSS styling

## 🔌 API Integration

API client configured in `app/api.js`:
- Base URL: `http://localhost:8081/api`
- Automatic error handling
- JWT authorization headers
- Axios interceptors for requests/responses

### Available Endpoints

**Auth**:
- `POST /auth/login`
- `POST /auth/register`

**Bookings**:
- `GET /bookings`
- `GET /bookings/:id`
- `POST /bookings`
- `PUT /bookings/:id`
- `DELETE /bookings/:id`

**Users**:
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `DELETE /users/:id`

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Theme customization in `styles/`
- **Dark Mode**: Supported with theme switching
- **Responsive**: Mobile-first design approach

## 📦 Dependencies

Key packages:
- **react**: UI framework
- **react-router**: Client-side routing
- **axios**: HTTP client
- **tailwindcss**: CSS framework
- **lucide-react**: Icon library
- **shadcn/ui**: Component library
- **vite**: Build tool

See `package.json` for full list.

## 🧪 Development Tips

### Adding New Pages
1. Create component in `pages/`
2. Import and add route in `routes.tsx`
3. Add navigation link in `Navigation.tsx`

### Styling
- Use Tailwind classes directly
- Custom styles in component `className`
- Global styles in `styles/index.css`

### API Calls
```typescript
import { getAllBookings } from '../api';

const response = await getAllBookings();
```

## 🚀 Production Build

```bash
npm run build
```

Creates optimized build in `dist/` folder ready for deployment.

## ⚠️ Environment Variables

Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:8081/api
```

## 🐛 Troubleshooting

### API Connection Issues
- Verify backend is running on `http://localhost:8081`
- Check network tab in browser DevTools
- Review API error messages in console

### Login Issues
- Clear localStorage: `localStorage.clear()`
- Check token expiration in application.properties
- Verify credentials

### Styling Issues
- Rebuild Tailwind: `npm run dev`
- Clear cache: `rm -rf node_modules/.cache`

## 📖 For More Information

See [FIXES_APPLIED.md](../FIXES_APPLIED.md) for recent changes and architecture documentation.
