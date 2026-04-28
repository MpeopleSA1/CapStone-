# Backend - Photo Booking Website

Spring Boot Java backend application for the CapStone photo booking system.

## 📁 Structure

```
backend/demo/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/booking/
│   │   │       ├── BookingApplication.java          # Main Spring Boot app
│   │   │       ├── config/
│   │   │       │   ├── CorsConfig.java              # CORS configuration
│   │   │       │   ├── JwtAuthenticationFilter.java # JWT filter
│   │   │       │   └── SecurityConfig.java          # Spring Security config
│   │   │       ├── controller/
│   │   │       │   ├── AuthController.java          # Auth endpoints
│   │   │       │   ├── BookingController.java       # Booking CRUD
│   │   │       │   ├── UserController.java          # User management
│   │   │       │   └── ...
│   │   │       ├── dto/
│   │   │       │   ├── AuthRequest.java
│   │   │       │   ├── AuthResponse.java
│   │   │       │   ├── BookingDTO.java
│   │   │       │   └── ...
│   │   │       ├── entity/
│   │   │       │   ├── User.java                    # User entity
│   │   │       │   ├── Booking.java                 # Booking entity
│   │   │       │   └── ...
│   │   │       ├── repository/
│   │   │       │   ├── UserRepository.java
│   │   │       │   ├── BookingRepository.java
│   │   │       │   └── ...
│   │   │       ├── service/
│   │   │       │   ├── AuthService.java
│   │   │       │   ├── BookingService.java
│   │   │       │   ├── UserService.java
│   │   │       │   └── ...
│   │   │       └── [Other utility classes]
│   │   │
│   │   └── resources/
│   │       ├── application.properties                # Configuration
│   │       └── BookingDB.sql                         # Database schema
│   │
│   └── test/
│       └── java/demo/DemoApplicationTests.java
│
├── pom.xml                                           # Maven dependencies
├── mvnw                                              # Maven wrapper (Linux/Mac)
├── mvnw.cmd                                          # Maven wrapper (Windows)
├── README.md
└── HELP.md
```

## 🚀 Getting Started

### Prerequisites
- Java 11+
- Maven 3.6+
- MySQL 8.0+

### Installation

```bash
# Navigate to backend
cd backend/demo

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

## 🌐 Server

**Backend Server**: http://localhost:8081
**API Base URL**: http://localhost:8081/api

## 🗄️ Database Setup

### Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE BookingDB;
USE BookingDB;
SOURCE src/main/resources/BookingDB.sql;
```

### Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/BookingDB
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=your_password

# JWT
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000  # 24 hours

# Server
server.port=8081

# Hibernate
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## 🔑 Authentication

JWT-based authentication:

1. **Register**: POST `/api/auth/register`
   - Creates new user
   - Returns JWT token

2. **Login**: POST `/api/auth/login`
   - Validates credentials
   - Returns JWT token

3. **Request with Auth**:
   ```
   Header: Authorization: Bearer <token>
   ```

## 📡 REST API Endpoints

### Authentication
```
POST   /api/auth/login          Login user
POST   /api/auth/register       Register new user
```

### Bookings
```
GET    /api/bookings            Get all bookings
GET    /api/bookings/{id}       Get booking by ID
POST   /api/bookings            Create new booking
PUT    /api/bookings/{id}       Update booking
DELETE /api/bookings/{id}       Delete booking
```

### Users
```
GET    /api/users               Get all users
GET    /api/users/{id}          Get user by ID
POST   /api/users               Create user
DELETE /api/users/{id}          Delete user
```

## 📋 Data Models

### User Entity
```java
id (Long)
username (String)
email (String)
password (String)
role (String) - ADMIN, USER
createdAt (LocalDateTime)
```

### Booking Entity
```java
id (Long)
customerName (String)
date (LocalDate)
seats (Integer)
status (String) - PENDING, CONFIRMED, COMPLETED, CANCELLED
userId (Long) - Foreign key to User
createdAt (LocalDateTime)
updatedAt (LocalDateTime)
```

## 🔧 Technologies

- **Spring Boot**: Application framework
- **Spring Security**: Authentication & Authorization
- **JWT**: Token-based authentication
- **Hibernate**: ORM framework
- **MySQL**: Database
- **Maven**: Build tool
- **Lombok**: Code generation

## 🏗️ Architecture

### Layers
1. **Controller**: REST endpoints
2. **Service**: Business logic
3. **Repository**: Data access
4. **Entity**: JPA entities
5. **DTO**: Data transfer objects
6. **Config**: Spring configuration

### Security
- JWT token validation on each request
- CORS configured for frontend
- Password encoding with BCrypt
- Role-based access control

## 🧪 Development

### Build
```bash
mvn clean package
```

### Run Tests
```bash
mvn test
```

### View Logs
```bash
# Show detailed logs
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"
```

## 🐛 Common Issues

### Database Connection Failed
- Check MySQL is running
- Verify credentials in `application.properties`
- Ensure database exists

### JWT Token Invalid
- Token may have expired
- Check token format in Authorization header
- Verify jwt.secret matches configuration

### CORS Errors
- Frontend and backend ports must be correct
- Check CorsConfig.java is properly configured
- Verify frontend sends credentials if needed

## 📦 Dependencies

Key Maven dependencies:
- spring-boot-starter-web
- spring-boot-starter-security
- spring-boot-starter-data-jpa
- mysql-connector-java
- jjwt (JWT library)
- lombok

See `pom.xml` for complete list.

## 🔐 Security Notes

⚠️ **Production Security**:
- Never commit credentials to version control
- Use environment variables for secrets
- Update JWT secret in production
- Enable HTTPS
- Use proper password hashing
- Implement rate limiting
- Add request validation

## 📖 Related Documentation

- See [../README.md](../README.md) for full project structure
- See [../FIXES_APPLIED.md](../FIXES_APPLIED.md) for recent changes

## 🚀 Deployment

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

## 📞 Support

For issues or questions, check:
1. Application logs in console
2. Database connectivity
3. Network/Firewall settings
4. JWT configuration
