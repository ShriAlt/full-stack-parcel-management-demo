# Parecel Management Syatem Project Documentation

## Overview

`Parecel Management Syatem` is a full-stack parcel management demo application. It combines an Angular 17 single-page application with a Spring Boot 3 REST API and a MySQL database. The application covers the core parcel lifecycle: user registration, login, parcel booking, payment, tracking, order management, cancellation, feedback, and administrator operations.

The repository is organized as:

```text
parcelX/
  database/
    schema.sql
  outputs/
    defectlogs/
      DefectLogs_Functional_Defects.xlsx
  parcelx-backend/
    Spring Boot REST API
  parcelx-frontend/
    Angular web application
  PROJECT_DOCUMENTATION.md
```

## Technology Stack

### Frontend

- Angular 17
- TypeScript 5.2
- Standalone Angular components
- Angular Router
- Angular HttpClient interceptors
- RxJS
- Component-scoped CSS

### Backend

- Java 17
- Spring Boot 3.4.5
- Spring Web
- Spring Security
- Method-level authorization with `@PreAuthorize`
- JWT authentication with `jjwt` 0.12.6
- Spring Data JPA
- Hibernate
- MySQL Connector/J 8.3.0
- Lombok

### Database

- MySQL
- Default database name: `parcel_db`
- Reference schema: `database/schema.sql`
- Runtime schema management: `spring.jpa.hibernate.ddl-auto=update`

## Local Application URLs

| Service | URL |
| --- | --- |
| Frontend dev server | `http://127.0.0.1:4201` |
| Backend API | `http://localhost:8082` |
| Frontend API base URL | `http://localhost:8082/api` |

The Angular development environment uses:

```ts
apiUrl: 'http://localhost:8082/api'
```

The Angular production environment uses:

```ts
apiUrl: '/api'
```

## Prerequisites

- Java 17
- Maven 3.8 or newer
- Node.js and npm
- MySQL running locally
- A database named `parcel_db`

Create the database manually or run the reference script:

```sql
CREATE DATABASE IF NOT EXISTS parcel_db;
```

## Backend Configuration

Backend configuration is loaded from `parcelx-backend/src/main/resources/application.yml`. The backend also imports an optional `.env` file from the backend folder:

```yaml
spring:
  config:
    import: optional:file:.env[.properties]
```

Create `parcelx-backend/.env` from `parcelx-backend/.env.example`:

```properties
DB_USERNAME=root
DB_NAME=parcel_db
DB_PASSWORD=your db password
JWT_SECRET=replace-with-a-long-secure-secret
JWT_EXPIRATION_MS=3600000
```

Important defaults:

- Backend port: `8082`
- Database URL: `jdbc:mysql://localhost:3306/${DB_NAME:parcel_db}`
- JWT expiration: `3600000` ms
- CORS allows the configured frontend URL plus local `localhost:*` and `127.0.0.1:*` origins.

## Running Locally

### 1. Start MySQL

Make sure MySQL is running and the `parcel_db` database exists.

### 2. Start the Backend

```bash
cd parcelx-backend
mvn spring-boot:run
```

The backend starts on:

```text
http://localhost:8082
```

If Maven is not on `PATH`, use the local Maven installation available on this machine:

```text
C:\Users\shrih\.m2\wrapper\dists\apache-maven-3.8.4-bin\52ccbt68d252mdldqsfsn03jlf\apache-maven-3.8.4\bin\mvn.cmd
```

### 3. Start the Frontend

```bash
cd parcelx-frontend
npm install
npm start -- --port 4201 --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:4201
```

## Demo Data and Login Credentials

`DemoDataConfig` seeds demo users on backend startup when they do not already exist.

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `admin123` |
| Customer | `user33` | `user123` |

The backend also seeds one sample parcel when the parcel table is empty.

## Application Roles

The `User.Role` enum defines:

- `ADMIN`
- `CUSTOMER`

The frontend role helper maps the user-facing customer role to route access for customer pages and the admin role to admin pages.

## Authentication Flow

1. User submits credentials on `/login`.
2. Frontend calls `POST /api/auth/login`.
3. Backend validates credentials and returns a JWT in the standard API response wrapper.
4. Frontend stores these values in `localStorage`:
   - `authToken`
   - `username`
   - `userRole`
5. The auth interceptor adds the token to every authenticated request:

```text
Authorization: Bearer <token>
```

Login response shape:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "username": "admin",
    "role": "ADMIN",
    "token": "...",
    "tokenType": "Bearer",
    "expiresIn": 3600000
  }
}
```

## Standard API Response

Most backend endpoints return:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

The Angular `apiResponseInterceptor` unwraps this object and passes only `data` to components. For example, when the backend returns:

```json
{
  "success": true,
  "message": "Parcels fetched successfully",
  "data": [
    {
      "id": 1,
      "trackingId": "TRK-12345678"
    }
  ]
}
```

the component receives:

```json
[
  {
    "id": 1,
    "trackingId": "TRK-12345678"
  }
]
```

## Frontend Routes

| Route | Component | Access |
| --- | --- | --- |
| `/` | `LandingComponent` | Public |
| `/login` | `LoginComponent` | Public |
| `/register` | `RegisterComponent` | Public |
| `/user-dashboard` | `UserDashboardComponent` | Customer |
| `/user/book-parcel` | `BookParcelComponent` | Customer |
| `/user/track-parcel` | `TrackParcelComponent` | Customer/Admin |
| `/user/manage-orders` | `ManageOrdersComponent` | Customer |
| `/user/profile` | `UserProfileComponent` | Customer |
| `/payment/new` | `PaymentComponent` | Customer |
| `/payment/:id` | `PaymentComponent` | Customer |
| `/admin-dashboard` | `AdminDashboardComponent` | Admin |
| `**` | Redirects to `/` | Public fallback |

## Frontend Feature Summary

### Public Pages

- Landing page with navigation to login and registration.
- Registration page for customer account creation.
- Login page with role-based redirects.

### Customer Dashboard

The customer dashboard is a tabbed workspace with:

- Dashboard stats for total, active, delivered, and in-transit parcels.
- Recent orders table.
- My Orders table with search, status filter, pagination, detail modal, tracking, payment, feedback, and cancellation actions.
- Book Parcel form with sender, receiver, pickup, drop, package, delivery, packaging, pickup date, and estimated cost.
- Track Parcel tab by tracking ID.
- Profile view and update form.

### Payment Page

The payment page supports:

- Loading parcel payment details from route state or by parcel ID.
- UPI, credit card, and debit card payment methods.
- UPI ID validation.
- Cardholder, card number, expiry, and CVV validation.
- Payment validation through the backend.
- Payment status update after validation.
- Redirect back to the user dashboard orders tab after successful payment.

### Admin Dashboard

The admin dashboard is a tabbed workspace with:

- Dashboard stats for parcels, delivered parcels, in-transit parcels, and users.
- All Orders table with search, weight sorting, pagination, payment status, detail modal, and status update.
- Parcel status updates are available to admins only after payment is confirmed.
- Book Parcel form using the same booking endpoint.
- Users table with search and user-order lookup.
- Feedback list.
- Admin profile update form.

## Backend API Endpoints

All protected endpoints require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register a customer/admin payload according to backend validation |
| `POST` | `/api/auth/login` | Public | Authenticate and return JWT metadata |

### Users

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/users/profile` | Authenticated | Fetch current user profile |
| `PUT` | `/api/users/profile` | Authenticated | Update current user profile |
| `GET` | `/api/users/admin/all` | Admin | Fetch all users |

### Parcels

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/parcels` | Customer/Admin | Book a parcel |
| `GET` | `/api/parcels` | Customer | List current customer's parcels |
| `GET` | `/api/parcels/{id}` | Admin/Customer | Fetch parcel by ID |
| `GET` | `/api/parcels/track/{trackingId}` | Admin/Customer | Track by tracking ID |
| `PUT` | `/api/parcels/{id}` | Customer | Update eligible parcel details |
| `POST` | `/api/parcels/{id}/cancel` | Customer | Cancel an eligible parcel |
| `GET` | `/api/parcels/admin/all` | Admin | Fetch all parcels |
| `PUT` | `/api/parcels/admin/{id}/status` | Admin | Update parcel status |
| `GET` | `/api/parcels/{id}/invoice` | Customer | Generate invoice data |

### Payments

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/payments/validate` | Customer | Validate payment details and create pending payment |
| `POST` | `/api/payments/update-status` | Customer | Update persisted payment status |

### Feedback

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/feedback` | Customer | Submit feedback for a parcel |
| `GET` | `/api/feedback/{parcelId}` | Admin/Customer | Fetch feedback for one parcel |
| `GET` | `/api/feedback/admin/all` | Admin | Fetch all feedback |

## Core Workflows

### Parcel Booking

1. Customer opens the Book Parcel tab.
2. Frontend validates sender, receiver, address, PIN code, phone, weight, delivery type, packaging type, and pickup date.
3. Frontend sends `POST /api/parcels`.
4. Backend creates a parcel with status `CREATED`.
5. Backend returns parcel details including ID, tracking ID, cost, and status.
6. Frontend redirects to `/payment/:id`.

Booking payload:

```json
{
  "senderName": "Ananya Sharma",
  "pickupAddress": "House 12, MG Road",
  "pickupZipCode": "560001",
  "pickupContactInfo": "9876543210",
  "receiverName": "Rohan Mehta",
  "dropLocation": "Flat 42, Park Street",
  "dropZipCode": "110001",
  "dropContactInfo": "9123456789",
  "weight": 2000,
  "deliveryType": "STANDARD",
  "packagingType": "BASIC",
  "pickupDate": "2026-05-10"
}
```

### Payment

1. User opens payment after booking or from the orders table.
2. Frontend validates UPI or card details.
3. Frontend sends `POST /api/payments/validate`.
4. Backend creates a payment record with `PAYMENT_PENDING`.
5. Frontend sends `POST /api/payments/update-status`.
6. Backend updates the payment to `CONFIRMED` or `PAYMENT_FAILED`.
7. Parcel responses include payment fields such as status, method, and transaction ID when available.

Payment methods:

- `UPI`
- `CREDIT_CARD`
- `DEBIT_CARD`

Payment statuses:

- `PAYMENT_PENDING`
- `CONFIRMED`
- `PAYMENT_FAILED`

### Tracking

Tracking can start from:

- Manual tracking ID entry.
- Track action from an order row.
- Track action from an order detail modal.

The frontend calls:

```text
GET /api/parcels/track/{trackingId}
```

The customer dashboard merges tracking data with the current user's order list when possible so the tracking panel can show more detail.

### Cancellation

Customers can cancel parcels that are still in `CREATED` status.

```text
POST /api/parcels/{id}/cancel
```

Payload:

```json
{
  "parcelId": 1,
  "reason": "Customer requested cancellation"
}
```

The backend stores the cancellation reason and updates the parcel status to `CANCELLED`.

### Feedback

Feedback is submitted from the customer dashboard after delivery.

```text
POST /api/feedback
```

Payload:

```json
{
  "parcelId": 1,
  "rating": 5,
  "comment": "Delivery was good"
}
```

Admins can view all feedback from the Feedback tab.

## Domain Model

### User

Important fields:

- `id`
- `username`
- `password`
- `email`
- `name`
- `phone`
- `address`
- `city`
- `state`
- `zipCode`
- `role`
- `createdAt`
- `updatedAt`

### Parcel

Important fields:

- `id`
- `trackingId`
- `sender`
- `senderName`
- `receiverName`
- `pickupAddress`
- `pickupZipCode`
- `pickupContactInfo`
- `dropLocation`
- `dropZipCode`
- `dropContactInfo`
- `weight`
- `deliveryType`
- `packagingType`
- `cost`
- `pickupDate`
- `status`
- `cancelReason`
- `createdAt`
- `updatedAt`

Parcel statuses:

- `CREATED`
- `PENDING`
- `IN_TRANSIT`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELLED`

### Payment

Important fields:

- `id`
- `parcel`
- `amount`
- `status`
- `method`
- `transactionId`
- `createdAt`
- `updatedAt`

### Feedback

Important fields:

- `id`
- `parcel`
- `user`
- `rating`
- `comment`
- `createdAt`

## Important Backend Files

| Area | Files |
| --- | --- |
| Application entry | `src/main/java/com/tcs/parcelX/ParcelApplication.java` |
| Configuration | `config/DemoDataConfig.java`, `src/main/resources/application.yml` |
| Security | `security/SecurityConfig.java`, `security/JwtFilter.java`, `security/JwtUtil.java`, `security/CustomUserDetailsService.java` |
| Controllers | `controller/AuthController.java`, `controller/UserController.java`, `controller/ParcelController.java`, `controller/PaymentController.java`, `controller/FeedbackController.java` |
| Services | `service/AuthService.java`, `service/UserService.java`, `service/ParcelService.java`, `service/PaymentService.java`, `service/FeedbackService.java` |
| Entities | `entity/User.java`, `entity/Parcel.java`, `entity/Payment.java`, `entity/Feedback.java` |
| Repositories | `repository/UserRepository.java`, `repository/ParcelRepository.java`, `repository/PaymentRepository.java`, `repository/FeedbackRepository.java` |
| DTOs | `dto/*Request.java`, `dto/*Response.java`, `dto/ApiResponse.java` |

## Important Frontend Files

| Area | Files |
| --- | --- |
| Routing | `src/app/app.routes.ts` |
| App configuration | `src/app/app.config.ts` |
| Auth guard/interceptors | `src/app/core/auth.guard.ts`, `src/app/core/auth.interceptor.ts` |
| Environment config | `src/environments/environment.ts`, `src/environments/environment.prod.ts` |
| Auth pages | `src/app/auth/login.component.ts`, `src/app/auth/register.component.ts` |
| Landing page | `src/app/landing/landing.component.ts` |
| Customer dashboard | `src/app/dashboard/user-dashboard.component.ts` |
| Admin dashboard | `src/app/admin/admin-dashboard.component.ts` |
| Standalone parcel pages | `src/app/parcel/book-parcel.component.ts`, `src/app/parcel/manage-orders.component.ts`, `src/app/parcel/track-parcel.component.ts` |
| Payment | `src/app/payment/payment.component.ts` |
| Profile | `src/app/dashboard/user-profile.component.ts` |

## Build Commands

```bash
cd parcelx-frontend
npm run build
```

## Development Notes

- The backend is stateless and uses JWTs instead of server sessions.
- The Angular app stores authentication state in `localStorage`.
- The backend standardizes success responses through `ApiResponse`.
- The Angular response interceptor unwraps `ApiResponse.data`.
- `database/schema.sql` is a reference schema. The live local schema may differ if Hibernate has already updated it through `ddl-auto=update`.
- Do not commit real `.env` secrets.
- Use a long JWT secret in local and deployed environments.

## Project Artifacts

| Artifact | Location | Purpose |
| --- | --- | --- |
| Functional defect log | `outputs/defectlogs/DefectLogs_Functional_Defects.xlsx` | Tracks open and closed functional defects with module, steps, severity, priority, status, owner, dates, and remarks. |
