Absolutely! Here's a **completely idiot-proof, step-by-step guide** for someone who doesn't know how to code. Every single step tells you EXACTLY where to click and what to type.

---

# 🟢 COMPLETE BEGINNER GUIDE: Connect React to Spring Boot

## 📌 What You Have:
- **Backend** (Java/Spring Boot) → Runs on port 8081 → Edit in **IntelliJ**
- **Frontend** (React/Vite) → Runs on port 5173 → Edit in **VS Code**

---

# 📁 PART 1: BACKEND SETUP (Do this in IntelliJ)

### Step 1: Open IntelliJ
- Open your Spring Boot project in IntelliJ IDEA

### Step 2: Create a New File for CORS Configuration
**In IntelliJ:**
1. In the left sidebar (Project panel), find the folder: `src/main/java/com/booking`
2. **Right-click** on the `booking` folder
3. Hover over **New** → Click **Java Class**
4. Name it: `CorsConfig`
5. Press **Enter**

### Step 3: Copy This Code Into the New File
**Replace everything** in `CorsConfig.java` with this exact code:

```java
package com.booking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "DELETE", "PUT")
                .allowedHeaders("*");
    }
}
```

### Step 4: Save the File
- Press `Ctrl + S` (Windows/Linux) or `Cmd + S` (Mac)

### Step 5: Run Your Backend
- Click the **green triangle** ▶️ at the top of IntelliJ
- Or press `Shift + F10`
- Wait until you see: `Started Application in X seconds`

✅ **Backend is now ready!** Leave it running.

---

# 📁 PART 2: FRONTEND SETUP (Do this in VS Code)

### Step 1: Open VS Code
- Open your React/Vite project in VS Code

### Step 2: Install Axios (One Time Only)
**In VS Code:**
1. Open the **Terminal**:
   - Click `Terminal` in the top menu
   - Click `New Terminal`
2. In the terminal that appears at the bottom, type this EXACT command:
   ```bash
   npm install axios
   ```
3. Press **Enter**
4. Wait for it to finish (you'll see a message like "added X packages")

### Step 3: Create the API Service File
**In VS Code:**
1. In the left sidebar (Explorer), find the `src` folder
2. **Right-click** on the `src` folder
3. Click **New File**
4. Name it exactly: `api.js`
5. Press **Enter**

### Step 4: Add Code to api.js
**Click on `api.js`** to open it, then copy this ENTIRE code:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bookings
export const getAllBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (booking) => api.post('/bookings', booking);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);

// Users
export const getAllUsers = () => api.get('/users');
export const getUserById = (id) => api.get(`/users/${id}`);
export const createUser = (user) => api.post('/users', user);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;
```

- Press `Ctrl + S` (or `Cmd + S` on Mac) to save

---

# 🎨 PART 3: USING THE API IN YOUR REACT COMPONENTS

Now you'll learn how to **use** these API functions in any React component.

## Example 1: Get and Show Bookings

**In VS Code:**
1. Find your React component file (example: `App.jsx` or `BookingList.jsx`)
2. **Add this at the VERY TOP** of the file (with the other imports):

```javascript
import { getAllBookings, createBooking, deleteBooking } from './api';
```

3. **Inside your component**, add this code (usually before the `return` statement):

```javascript
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(false);

// This automatically loads bookings when the page opens
useEffect(() => {
  loadBookings();
}, []);

const loadBookings = async () => {
  setLoading(true);
  try {
    const response = await getAllBookings();
    setBookings(response.data);
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to load bookings. Is your backend running?');
  } finally {
    setLoading(false);
  }
};
```

4. **To DISPLAY the bookings** in your JSX (inside the `return` statement):

```jsx
{loading && <p>Loading...</p>}
{bookings.map(booking => (
  <div key={booking.id}>
    {/* Put your Figma design here */}
    <p>Name: {booking.customerName}</p>
    <p>Date: {booking.date}</p>
  </div>
))}
```

---

## Example 2: Create a New Booking

**Inside your component** (before the `return`), add this function:

```javascript
const handleCreateBooking = async (bookingData) => {
  try {
    const response = await createBooking(bookingData);
    setBookings([...bookings, response.data]); // Add to list
    alert('Booking created!');
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to create booking');
  }
};
```

**To use it** (example: when a form is submitted):

```jsx
<button onClick={() => handleCreateBooking({ 
  customerName: "John Doe", 
  date: "2024-12-25", 
  seats: 2 
})}>
  Create Booking
</button>
```

---

## Example 3: Delete a Booking

**Add this function** (before the `return`):

```javascript
const handleDeleteBooking = async (id) => {
  if (window.confirm('Are you sure you want to delete this?')) {
    try {
      await deleteBooking(id);
      setBookings(bookings.filter(booking => booking.id !== id));
      alert('Deleted!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete');
    }
  }
};
```

**To use it** (next to each booking):

```jsx
<button onClick={() => handleDeleteBooking(booking.id)}>
  Delete
</button>
```

---

# 🚀 PART 4: RUN EVERYTHING

### Start Your Backend (IntelliJ):
1. Go back to IntelliJ
2. Click the **green triangle** ▶️
3. Keep it running (don't close the terminal)

### Start Your Frontend (VS Code):
1. Go back to VS Code
2. Open the **Terminal** (Terminal → New Terminal)
3. Type:
   ```bash
   npm run dev
   ```
4. Press **Enter**
5. You'll see: `Local: http://localhost:5173/`
6. **Hold Ctrl** and click that link (or open Chrome and type `http://localhost:5173`)

---

# ✅ TEST IF IT WORKS

1. Open Chrome at `http://localhost:5173`
2. Open your browser's **Console**:
   - Right-click anywhere on the page
   - Click **Inspect**
   - Click the **Console** tab
3. You should see NO red errors
4. If you see `✅ Backend connected!` messages, it's working!

---

# 🔥 QUICK COPY-PASTE TEMPLATE

If you want a **complete working component** to test, create a new file in VS Code called `TestAPI.jsx` and paste this:

```jsx
import React, { useState, useEffect } from 'react';
import { getAllBookings, createBooking, deleteBooking } from './api';

function TestAPI() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await getAllBookings();
      setBookings(response.data);
    } catch (error) {
      alert('Backend connection failed!');
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const testBooking = {
      customerName: "Test User",
      date: new Date().toISOString().split('T')[0],
      seats: 2
    };
    try {
      const response = await createBooking(testBooking);
      setBookings([...bookings, response.data]);
      alert('Created!');
    } catch (error) {
      alert('Create failed');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete?')) {
      await deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  return (
    <div>
      <h1>Bookings Test</h1>
      <button onClick={handleCreate}>Add Test Booking</button>
      {loading && <p>Loading...</p>}
      {bookings.map(booking => (
        <div key={booking.id}>
          {booking.customerName} - {booking.date}
          <button onClick={() => handleDelete(booking.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TestAPI;
```

Then import it in your main `App.jsx`:

```jsx
import TestAPI from './TestAPI';

function App() {
  return <TestAPI />;
}
```

---

# 🆘 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Network error" | Backend isn't running. Start it in IntelliJ |
| "CORS error" | You forgot the CorsConfig file in backend |
| "404 not found" | Wrong URL. Check backend is on port 8081 |
| "Can't find module 'axios'" | Run `npm install axios` in VS Code terminal |

---

**That's it!** You now have a working connection between React and Spring Boot. 🎉