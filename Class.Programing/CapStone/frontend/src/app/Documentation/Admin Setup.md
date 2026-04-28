# 🔐 ADDING USER PAGE & ADMIN PAGE - Complete Idiot-Proof Guide

## 📌 What You're Adding
- **User Page** → Normal users can see their own bookings
- **Admin Page** → Admins can see ALL users and ALL bookings, and delete anything

---

# 🗂️ PART 1: BACKEND CHANGES (Do this in IntelliJ FIRST)

## Step 1: Add Role to Your User Entity

**In IntelliJ:**

1. Open `User.java` (in `entity` folder)
2. **Add this line** inside the class (with the other fields like `username`, `password`, `email`):

```java
private String role = "USER";
```

3. **Add these two methods** (with all your other getters and setters):

```java
public String getRole() { return role; }
public void setRole(String role) { this.role = role; }
```

Your `User.java` should now look like this (only showing the important parts):

```java
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String username;
    private String password;
    private String email;
    private String role = "USER";  // ← ADD THIS LINE
    
    // ALL your getters and setters...
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }      // ← ADD THIS
    public void setRole(String role) { this.role = role; }  // ← ADD THIS
}
```

- Press `Ctrl + S` to save

---

## Step 2: Update SecurityConfig.java

**In IntelliJ:**

1. Open `SecurityConfig.java` (in `config` folder)
2. **Find** the section that says `.authorizeHttpRequests` (around line 40-45)
3. **Replace** that whole section with this:

```java
.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/users/register").permitAll()
    .requestMatchers("/api/admin/**").hasRole("ADMIN")  // ← ADD THIS LINE
    .anyRequest().authenticated()
)
```

The whole method should look like this:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/users/register").permitAll()
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
```

- Press `Ctrl + S` to save

---

## Step 3: Create Admin Controller

**In IntelliJ:**

1. Navigate to: `src/main/java/com/booking/controller/`
2. **Right-click** on the `controller` folder
3. Hover over **New** → Click **Java Class**
4. Name it: `AdminController`
5. Press **Enter**

**Replace everything** with this code:

```java
package com.booking.controller;

import com.booking.entity.Booking;
import com.booking.entity.User;
import com.booking.service.BookingService;
import com.booking.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final BookingService bookingService;

    public AdminController(UserService userService, BookingService bookingService) {
        this.userService = userService;
        this.bookingService = bookingService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/bookings")
    public List<Booking> getAllBookings() {
        return bookingService.findAll();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/bookings/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/users/{id}/make-admin")
    public ResponseEntity<?> makeAdmin(@PathVariable Long id) {
        User user = userService.findById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setRole("ADMIN");
        userService.save(user);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "User " + user.getUsername() + " is now an ADMIN");
        return ResponseEntity.ok(response);
    }
}
```

- Press `Ctrl + S` to save

---

## Step 4: Update CustomUserDetailsService.java

**In IntelliJ:**

1. Open `CustomUserDetailsService.java` (in `service` folder)
2. **Find** the line that says: `Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))`
3. **Replace** that line with this:

```java
Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
```

The whole method should look like this:

```java
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username);
    if (user == null) {
        throw new UsernameNotFoundException("User not found: " + username);
    }

    return new org.springframework.security.core.userdetails.User(
            user.getUsername(),
            user.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
    );
}
```

- Press `Ctrl + S` to save

---

## Step 5: Restart Your Backend

**In IntelliJ:**
1. Click the **red square** ⬛ to stop the backend
2. Click the **green triangle** ▶️ to start it again
3. Wait for "Started Application"

✅ **Backend is ready!**

---

## Step 6: Create One Admin User (Do this ONCE)

**In IntelliJ:** (or you can use Postman)

Since your backend is running, let's create an admin user directly in the database.

**Option A - Using your Register page:**
1. Open your frontend (http://localhost:5173/register)
2. Create a user called "admin" with password "admin123"
3. Then you need to manually change this user's role to ADMIN in the database

**Option B - Add this code temporarily to your UserService (EASIEST):**

1. Open `UserService.java`
2. **Add this method** anywhere in the class:

```java
@javax.annotation.PostConstruct
public void createAdminUser() {
    if (userRepository.findByUsername("admin") == null) {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setEmail("admin@example.com");
        admin.setRole("ADMIN");
        userRepository.save(admin);
        System.out.println("✅ Admin user created! Username: admin, Password: admin123");
    }
}
```

3. You also need to add `passwordEncoder` to your UserService. Add this line at the top of the class (with the other variables):

```java
private final PasswordEncoder passwordEncoder;
```

4. Update the constructor to include it:

```java
public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
}
```

5. Press `Ctrl + S` and restart the backend
6. Look in the console - you should see "✅ Admin user created!"

---

# 🎨 PART 2: FRONTEND CHANGES (Do this in VS Code)

## Step 1: Update api.js

**In VS Code:**

1. Open `src/api.js`
2. **Add these new functions** at the bottom (before `export default api`):

```javascript
// ========== ADMIN API ==========
export const adminGetAllUsers = () => api.get('/admin/users');
export const adminGetAllBookings = () => api.get('/admin/bookings');
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);
export const adminDeleteBooking = (id) => api.delete(`/admin/bookings/${id}`);
export const adminMakeUserAdmin = (id) => api.put(`/admin/users/${id}/make-admin`);
```

Your `api.js` should now have ALL these sections:

```javascript
// ========== AUTH API ==========
export const login = (username, password) => ...
export const register = (username, password, email) => ...

// ========== EXISTING APIs ==========
export const getAllBookings = () => api.get('/bookings');
export const createBooking = (booking) => api.post('/bookings', booking);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

export const getAllUsers = () => api.get('/users');
export const createUser = (user) => api.post('/users', user);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ========== ADMIN API (NEW) ==========
export const adminGetAllUsers = () => api.get('/admin/users');
export const adminGetAllBookings = () => api.get('/admin/bookings');
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);
export const adminDeleteBooking = (id) => api.delete(`/admin/bookings/${id}`);
export const adminMakeUserAdmin = (id) => api.put(`/admin/users/${id}/make-admin`);
```

- Press `Ctrl + S` to save

---

## Step 2: Create UserPage.jsx

**In VS Code:**

1. **Right-click** on the `src` folder
2. Click **New File**
3. Name it: `UserPage.jsx`

**Add this code:**

```jsx
// src/UserPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings, deleteBooking } from './api';

function UserPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const username = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    loadBookings();
  }, [navigate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      setBookings(response.data);
      setError('');
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    
    try {
      await deleteBooking(id);
      // Reload the list
      loadBookings();
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading your bookings...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px'
      }}>
        <h1>📅 My Bookings</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      
      {/* Welcome message */}
      <p style={{ marginTop: '20px' }}>Welcome, <strong>{username}</strong>!</p>
      
      {/* Error message */}
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px',
          margin: '10px 0'
        }}>
          {error}
        </div>
      )}
      
      {/* Bookings list */}
      <div style={{ marginTop: '20px' }}>
        <h2>Your Bookings</h2>
        
        {bookings.length === 0 ? (
          <p style={{ color: '#666' }}>You don't have any bookings yet.</p>
        ) : (
          <div>
            {bookings.map((booking) => (
              <div 
                key={booking.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div><strong>Customer:</strong> {booking.customerName || 'N/A'}</div>
                  <div><strong>Date:</strong> {booking.date || 'N/A'}</div>
                  <div><strong>Seats:</strong> {booking.seats || '1'}</div>
                </div>
                <button
                  onClick={() => handleDeleteBooking(booking.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default UserPage;
```

- Press `Ctrl + S` to save

---

## Step 3: Create AdminPage.jsx

**In VS Code:**

1. **Right-click** on the `src` folder
2. Click **New File**
3. Name it: `AdminPage.jsx`

**Add this code:**

```jsx
// src/AdminPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  adminGetAllUsers, 
  adminGetAllBookings, 
  adminDeleteUser, 
  adminDeleteBooking,
  adminMakeUserAdmin
} from './api';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'bookings'
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Check if user is admin
    if (role !== 'ADMIN') {
      setError('You do not have admin access!');
      setTimeout(() => navigate('/dashboard'), 2000);
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, bookingsRes] = await Promise.all([
        adminGetAllUsers(),
        adminGetAllBookings()
      ]);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
      setError('');
    } catch (err) {
      console.error('Error loading admin data:', err);
      if (err.response?.status === 403) {
        setError('You do not have admin permission!');
        setTimeout(() => navigate('/dashboard'), 2000);
      } else {
        setError('Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }
    
    try {
      await adminDeleteUser(id);
      setMessage(`User "${username}" deleted successfully!`);
      loadData(); // Reload
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }
    
    try {
      await adminDeleteBooking(id);
      setMessage('Booking deleted successfully!');
      loadData(); // Reload
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleMakeAdmin = async (id, username) => {
    if (!window.confirm(`Make "${username}" an admin?`)) {
      return;
    }
    
    try {
      await adminMakeUserAdmin(id);
      setMessage(`${username} is now an ADMIN!`);
      loadData(); // Reload
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error making admin:', err);
      setError('Failed to make user admin');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading admin data...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #ccc',
        paddingBottom: '10px'
      }}>
        <h1>👑 Admin Control Panel</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
      
      {/* Success/Error messages */}
      {message && (
        <div style={{ 
          backgroundColor: '#e8f5e9', 
          color: '#2e7d32', 
          padding: '10px', 
          borderRadius: '4px',
          margin: '10px 0'
        }}>
          {message}
        </div>
      )}
      
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px',
          margin: '10px 0'
        }}>
          {error}
        </div>
      )}
      
      {/* Tab buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        margin: '20px 0',
        borderBottom: '1px solid #ddd'
      }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'users' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'users' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px 4px 0 0'
          }}
        >
          👥 Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'bookings' ? '#007bff' : '#f0f0f0',
            color: activeTab === 'bookings' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px 4px 0 0'
          }}
        >
          📅 Bookings ({bookings.length})
        </button>
      </div>
      
      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <h2>All Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{user.id}</td>
                      <td style={{ padding: '12px' }}>{user.username}</td>
                      <td style={{ padding: '12px' }}>{user.email}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          backgroundColor: user.role === 'ADMIN' ? '#4caf50' : '#9e9e9e',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {user.role || 'USER'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => handleMakeAdmin(user.id, user.username)}
                              style={{
                                backgroundColor: '#ffc107',
                                color: 'black',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Make Admin
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div>
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Customer Name</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Seats</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{booking.id}</td>
                      <td style={{ padding: '12px' }}>{booking.customerName || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>{booking.date || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>{booking.seats || '1'}</td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Navigation buttons */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          ← Back to Dashboard
        </button>
        <button
          onClick={loadData}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}

export default AdminPage;
```

- Press `Ctrl + S` to save

---

## Step 4: Update Dashboard.jsx

**In VS Code:**

1. Open `src/Dashboard.jsx`
2. **Replace everything** with this code:

```jsx
// src/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings, getAllUsers } from './api';

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('USER');
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get user role from localStorage (we'll set it after login)
    const role = localStorage.getItem('role');
    if (role) {
      setUserRole(role);
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
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      
      <p>Welcome, {username}!</p>
      
      {/* Role-based navigation buttons */}
      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate('/user-page')}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          📅 My Bookings
        </button>
        
        {/* Only show Admin button if user is ADMIN */}
        {userRole === 'ADMIN' && (
          <button
            onClick={() => navigate('/admin-page')}
            style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            👑 Admin Panel
          </button>
        )}
      </div>
      
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
                {user.role === 'ADMIN' && <span style={{color: 'red'}}> (ADMIN)</span>}
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

## Step 5: Update Login.jsx to Save User Role

**In VS Code:**

1. Open `src/Login.jsx`
2. **Find** the line where you save to localStorage (around line 22-24)
3. **Replace** that section with this:

```javascript
const response = await login(username, password);
const { token, username: userName } = response.data;

// Save token and username to localStorage
localStorage.setItem('token', token);
localStorage.setItem('username', userName);

// Try to get the user's role
try {
  const userResponse = await api.get('/users');
  const currentUser = userResponse.data.find(u => u.username === userName);
  if (currentUser) {
    localStorage.setItem('role', currentUser.role || 'USER');
  } else {
    localStorage.setItem('role', 'USER');
  }
} catch (err) {
  console.error('Could not fetch user role:', err);
  localStorage.setItem('role', 'USER');
}
```

But wait, you need to import `api` at the top. Add this with the other imports:

```javascript
import api, { login } from './api';
```

**The whole Login.jsx should look like this:**

```jsx
// src/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { login } from './api';  // ← ADDED 'api'

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
      
      // Save token and username to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', userName);
      
      // Try to get the user's role
      try {
        const userResponse = await api.get('/users');
        const currentUser = userResponse.data.find(u => u.username === userName);
        if (currentUser) {
          localStorage.setItem('role', currentUser.role || 'USER');
        } else {
          localStorage.setItem('role', 'USER');
        }
      } catch (err) {
        console.error('Could not fetch user role:', err);
        localStorage.setItem('role', 'USER');
      }
      
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
        <button type="submit" disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
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

## Step 6: Update App.jsx with New Routes

**In VS Code:**

1. Open `src/App.jsx`
2. **Replace everything** with this:

```jsx
// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import UserPage from './UserPage';
import AdminPage from './AdminPage';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Admin only route wrapper
function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
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
        <Route 
          path="/user-page" 
          element={
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-page" 
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
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

## Step 7: Run Everything!

**In VS Code terminal:**
```bash
npm run dev
```

**In IntelliJ:** Make sure backend is running (green triangle)

---

# 🚀 PART 3: TEST YOUR USER & ADMIN PAGES

## Test 1: Create a Regular User
1. Go to `http://localhost:5173/register`
2. Create a user: `john` / `john123` / `john@test.com`
3. Login with this user
4. You should see:
   - Dashboard with "My Bookings" button
   - **NO** "Admin Panel" button (because regular users can't see it)
5. Click "My Bookings" → You see your bookings page

## Test 2: Create/Use Admin User
1. Login with `admin` / `admin123` (if you set that up)
2. You should see:
   - Dashboard with BOTH "My Bookings" AND "Admin Panel" buttons
3. Click "Admin Panel" → You see:
   - List of ALL users
   - List of ALL bookings
   - Buttons to delete anything
   - Button to make any user an admin

## Test 3: Make Another User Admin
1. As admin, go to Admin Panel
2. Find a regular user (like "john")
3. Click "Make Admin" button
4. That user now has admin powers when they log in next time!

---

# 📁 WHAT YOU SHOULD HAVE NOW

```
booking-frontend/
├── src/
│   ├── api.js (updated)
│   ├── App.jsx (updated)
│   ├── Login.jsx (updated)
│   ├── Register.jsx (same)
│   ├── Dashboard.jsx (updated)
│   ├── UserPage.jsx (NEW)
│   └── AdminPage.jsx (NEW)
└── ...

backend/
├── src/main/java/com/booking/
│   ├── config/
│   │   └── SecurityConfig.java (updated)
│   ├── controller/
│   │   ├── AdminController.java (NEW)
│   │   └── ...
│   ├── entity/
│   │   └── User.java (updated with role)
│   └── service/
│       └── CustomUserDetailsService.java (updated)
```

---

# 🆘 TROUBLESHOOTING

| Problem | What to do |
|---------|-------------|
| "You do not have admin access" | You logged in as a regular user. Login as admin instead |
| Admin button doesn't appear | Your user role wasn't saved. Logout and login again |
| Can't see users in Admin Panel | Check that your backend is running and you're logged in as admin |
| 403 Forbidden error | The backend says you're not admin. Check your role in the database |
| "Admin user created" not showing | Make sure you added the @PostConstruct code to UserService |

---

**You're done!** 🎉 Regular users can only see their stuff, admins can see and delete everything!