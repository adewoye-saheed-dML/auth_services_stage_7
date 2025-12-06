# A Mini Authentication + API Key System for Service-to-Service Access


A robust, backend-only authentication system built with NestJS, TypeORM, and PostgreSQL. This service provides a hybrid authentication mechanism supporting both User Login (JWT) and Service-to-Service Access (API Keys).

## Features

- **Hybrid Authentication**: Protected routes support both `Bearer <JWT>` tokens and `x-api-key` headers via a unified Guard.
- **User Management**: Secure signup and login with **Bcrypt** password hashing.
- **API Key Management**:
  - Generate cryptographically secure API keys.
  - Store hashed keys (never raw keys) for security.
  - **Expiration & Revocation**: Keys support `isActive` flags and expiration dates.
- **Swagger UI**: Fully interactive API documentation available at `/api`.
- **TypeORM Integration**: Structured database schema with relationships between Users and API Keys.
- **Modular Architecture**: Clean separation of concerns using NestJS Modules (Auth, Users, Keys).

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: Passport-JWT, Bcrypt
- **Documentation**: Swagger (OpenAPI)

---

## Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **PostgreSQL** (Running locally or via Docker)
- **npm** or **yarn**

---

## Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/adewoye-saheed-dML/auth_services_stage_7
   cd auth-service


2.  **Install dependencies:**
    
    
    
        npm install
    
3.  Configure Environment Variables:
    
    Create a .env file in the root directory and add your database and JWT configurations:
    
    Code snippet
    
        # Database Configuration
        DB_HOST=localhost
        DB_PORT=5432
        DB_USER=postgres
        DB_PASSWORD=root
        DB_NAME=nest_auth_service
        
        # JWT Secret (Use a strong secret in production)
        JWT_SECRET=my_super_secure_secret_key_123
    
4.  Create the Database:
    
    Ensure the database defined in DB\_NAME exists in your Postgres instance.
    
    
    
        # Example using psql
        psql -U postgres -c "CREATE DATABASE nest_auth_service;"
    

* * *

##   

## Running the Application

### Development Mode



    npm run start:dev

The server will start on `http://localhost:3000`.

### Production Mode


    npm run build
    npm run start:prod

* * *

## API Documentation

This project includes a built-in Swagger UI for testing and documentation.

1.  Start the server (`npm run start:dev`).
    
2.  Navigate to **[http://localhost:3000/api](https://www.google.com/search?q=http://localhost:3000/api)** in your browser.
    
3.  You can test all endpoints directly from this interface.

### Test Screenshots
<img width="1342" height="400" alt="Image" src="https://github.com/user-attachments/assets/6f50aaad-5f62-498d-afbc-e8ffda7d9e4d" />

<img width="1319" height="735" alt="Image" src="https://github.com/user-attachments/assets/84201bb9-8f52-4442-93fd-626ff0d5bd51" />

<img width="1333" height="386" alt="Image" src="https://github.com/user-attachments/assets/5ca88596-6dbb-4f04-8243-0cef8b17eafa" />

<img width="1365" height="673" alt="Image" src="https://github.com/user-attachments/assets/27e50bad-f031-4811-978f-3c1e663293e5" />

<img width="1366" height="679" alt="Image" src="https://github.com/user-attachments/assets/1a8646ae-4bc1-4cb3-8117-40bd90086594" />
    

* * *

##   

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | /auth/signup | Register a new user. Returns an access token. | No |
| POST | /auth/login | Login with email/password. Returns access token. | No |
| GET | /auth/profile | Get details of the authenticated user. | JWT / Key |

### API Keys

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | /keys/create | Generate a new API Key for the current user. | JWT Only |

* * *

## Testing

The project is configured with Jest for unit and end-to-end testing.


    # Run unit tests
    npm run test
    
    # Run e2e tests
    npm run test:e2e
    
    # Test coverage
    npm run test:cov

##   

## Project Structure

```text
src/
├── auth/               # Authentication logic (Login, Signup, Guards)
│   ├── guards/         # The Hybrid ApiOrJwtAuthGuard
│   └── dto/            # Data Transfer Objects
├── keys/               # API Key generation and validation logic
│   └── entities/       # ApiKey Entity (Schema)
├── users/              # User management
│   └── entities/       # User Entity (Schema)
├── common/             # Shared utilities (Decorators)
└── app.module.ts       # Root module wiring everything together
```
## License

This project is [MIT licensed](https://www.google.com/search?q=LICENSE).