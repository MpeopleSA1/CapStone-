# 🔐 COMPLETE BEGINNER GUIDE: Login & Registration with JWT

## 📌 What You're Building
- **Backend** (Spring Boot): Handles user registration, login, and issues JWT tokens → Edit in **IntelliJ**
- **Frontend** (React/Vite): Login/registration forms that store and use JWT tokens → Edit in **VS Code**

---

# 🗂️ PART 1: BACKEND SETUP (Do this in IntelliJ)

## Step 1: Add Dependencies to `pom.xml`

**In IntelliJ:**
1. In the left sidebar, find the file: `pom.xml`
2. **Double-click** to open it
3. Scroll down to the `<dependencies>` section
4. **Add this code** inside the `<dependencies>` tags (anywhere before the closing `</dependencies>`):

```xml
<!-- JWT Library -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.6</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.6</version>
    <scope>runtime</scope>
</dependency>

<!-- Spring Security -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

5. Press `Ctrl + S` to save
6. Click the **Maven refresh** button (usually a blue circle icon in the top-right) or wait for IntelliJ to auto-download

---

## Step 2: Create the JWT Service

**In IntelliJ:**

1. Navigate to: `src/main/java/com/booking/service/`
2. **Right-click** on the `service` folder
3. Hover over **New** → Click **Java Class**
4. Name it: `JwtService`
5. Press **Enter**

**Replace everything** in `JwtService.java` with this code:

```java
package com.booking.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = java.util.Base64.getDecoder().decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }
}
```

- Press `Ctrl + S` to save 

---

## Step 3: Create the JWT Filter

**In IntelliJ:**

1. Navigate to: `src/main/java/com/booking/config/`
2. **Right-click** on the `config` folder (create it if it doesn't exist)
3. Hover over **New** → Click **Java Class**
4. Name it: `JwtAuthenticationFilter`
5. Press **Enter**

**Replace everything** in `JwtAuthenticationFilter.java` with this code:

```java
package com.booking.config;

import com.booking.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        final String username = jwtService.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

- Press `Ctrl + S` to save 

---

## Step 4: Create the Security Configuration

**In IntelliJ:**

1. Navigate to: `src/main/java/com/booking/config/`
2. **Right-click** on the `config` folder
3. Hover over **New** → Click **Java Class**
4. Name it: `SecurityConfig`
5. Press **Enter**

**Replace everything** in `SecurityConfig.java` with this code:

```java
package com.booking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/users/register").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "DELETE", "PUT"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

- Press `Ctrl + S` to save 

---

## Step 5: Add JWT Properties to `application.properties`

**In IntelliJ:**

1. Find the file: `src/main/resources/application.properties`
2. **Double-click** to open it
3. **Add these lines** at the bottom:

```properties
# JWT Configuration
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000
```

- Press `Ctrl + S` to save

> ⚠️ **IMPORTANT:** The secret above is for LEARNING ONLY. For a real app, generate a random 64-character string!

---

## Step 6: Create the Auth Controller

**In IntelliJ:**

1. Navigate to: `src/main/java/com/booking/controller/`
2. **Right-click** on the `controller` folder
3. Hover over **New** → Click **Java Class**
4. Name it: `AuthController`
5. Press **Enter**

**Replace everything** in `AuthController.java` with this code:

```java
package com.booking.controller;

import com.booking.entity.User;
import com.booking.service.JwtService;
import com.booking.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserService userService,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails.getUsername());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("username", userDetails.getUsername());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if (userService.findByUsername(registerRequest.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());

        userService.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // Inner classes for request bodies
    static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    static class RegisterRequest {
        private String username;
        private String password;
        private String email;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
```

- Press `Ctrl + S` to save 

---

## Step 7: Update Your User Entity

**Make sure** your `User.java` entity has these fields (add if missing):

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String password;
    private String email;
    
    // Getters and setters for all fields
    // ... (keep your existing ones, add these if missing)
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
```

---

## Step 8: Add Method to UserService

**In IntelliJ:**

1. Open `UserService.java`
2. **Add this method** inside the class:

```java
public User findByUsername(String username) {
    return userRepository.findByUsername(username);
}
```

3. Also make sure your `UserRepository` has this method:

```java
User findByUsername(String username);
```

- Press `Ctrl + S` to save

---

## Step 9: Create Custom UserDetailsService

**In IntelliJ:**

1. Navigate to: `src/main/java/com/booking/service/`
2. **Right-click** on the `service` folder
3. Click **New** → **Java Class**
4. Name it: `CustomUserDetailsService`
5. Press **Enter**

**Replace everything** with:

```java
package com.booking.service;

import com.booking.entity.User;
import com.booking.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
```

- Press `Ctrl + S` to save

---

## Step 10: Run the Backend

**In IntelliJ:**
- Click the **green triangle** ▶️ at the top
- Wait until you see: `Started Application in X seconds`

✅ **Backend is ready on port 8081!**

---

# 🎨 PART 2: FRONTEND SETUP (Do this in VS Code)

## Step 1: Create the API Service File

**In VS Code:**

1. Open your React/Vite project
2. In the left sidebar, find the `src` folder
3. **Right-click** on `src` → Click **New File**
4. Name it: `api.js`

**Add this code:**

```javascript
// src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH API ==========
export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const register = (username, password, email) =>
  api.post('/auth/register', { username, password, email });

// ========== EXISTING APIs (Bookings, Users) ==========
export const getAllBookings = () => api.get('/bookings');
export const createBooking = (booking) => api.post('/bookings', booking);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export const getAllUsers = () => api.get('/users');
export const createUser = (user) => api.post('/users', user);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;
```

- Press `Ctrl + S` to save 

---

## Step 2: Create Login Component

**In VS Code:**

1. **Right-click** on the `src` folder
2. Click **New File**
3. Name it: `Login.jsx`

**Add this code:**

```jsx
// src/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(username, password);
      const { token, username: userName } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', userName);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
```

- Press `Ctrl + S` to save 

---

## Step 3: Create Register Component

**In VS Code:**

1. **Right-click** on the `src` folder
2. Click **New File**
3. Name it: `Register.jsx`

**Add this code:**

```jsx
// src/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from './api';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(username, password, email);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0' }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <a href="/login">Login here</a>
      </p>
    </div>
  );
}

export default Register;
```

- Press `Ctrl + S` to save

---

## Step 4: Create Dashboard Component (Protected Page)

**In VS Code:**

1. **Right-click** on the `src` folder
2. Click **New File**
3. Name it: `Dashboard.jsx`

**Add this code:**

```jsx
// src/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings, getAllUsers } from './api';

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load data
    const loadData = async () => {
      try {
        const [bookingsRes, usersRes] = await Promise.all([
          getAllBookings(),
          getAllUsers()
        ]);
        setBookings(bookingsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>
          Logout
        </button>
      </div>
      
      <p>Welcome, {username}!</p>
      
      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2>Bookings ({bookings.length})</h2>
          <ul>
            {bookings.map(booking => (
              <li key={booking.id}>
                {booking.customerName} - {booking.date} ({booking.seats} seats)
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ flex: 1 }}>
          <h2>Users ({users.length})</h2>
          <ul>
            {users.map(user => (
              <li key={user.id}>
                {user.username} - {user.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

- Press `Ctrl + S` to save

---

## Step 5: Update App.jsx with Routes

**Open `src/App.jsx`** and replace everything with:

```jsx
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
```

- Press `Ctrl + S` to save

---

## Step 6: Install React Router

**In VS Code terminal:**

```bash
npm install react-router-dom
```

Press **Enter** and wait for it to finish.

---

## Step 7: Run the Frontend

**In VS Code terminal:**

```bash
npm run dev
```

Press **Enter**

---

# 🚀 PART 3: TEST YOUR LOGIN SYSTEM

## Test Registration:
1. Open Chrome at `http://localhost:5173/register`
2. Fill in:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
3. Click **Register**
4. You should see: "Registration successful!"

## Test Login:
1. You'll be redirected to `/login` (or go there manually)
2. Enter the same username and password
3. Click **Login**
4. You should see the Dashboard with your data!

---

# 📁 FINAL FILE STRUCTURE

```
booking-frontend/
├── src/
│   ├── api.js
│   ├── App.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Dashboard.jsx
├── package.json
└── ...

backend/
├── src/main/java/com/booking/
│   ├── config/
│   │   ├── CorsConfig.java
│   │   ├── SecurityConfig.java
│   │   └── JwtAuthenticationFilter.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── BookingController.java
│   │   └── UserController.java
│   ├── entity/
│   │   ├── User.java
│   │   └── Booking.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   └── BookingRepository.java
│   └── service/
│       ├── JwtService.java
│       ├── UserService.java
│       ├── BookingService.java
│       └── CustomUserDetailsService.java
└── src/main/resources/
    └── application.properties
```

---

# 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Whitelabel Error Page" | Backend isn't running. Start it in IntelliJ |
| "401 Unauthorized" | Token expired or invalid. Log in again |
| "CORS error" | SecurityConfig has CORS configuration for port 5173 |
| "UserDetailsService error" | Make sure CustomUserDetailsService is created |
| "Can't find symbol" | Run Maven clean: Right-click project → Maven → Reload project |

---

**That's it!** You now have a complete Login/Registration system with JWT tokens! 🎉