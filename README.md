🚀 Distributed Job Processing System

A production-style backend system built with NestJS, designed to handle asynchronous job processing with retries, caching, authentication, and observability.

🧠 Features

✅ RESTful API with NestJS
✅ PostgreSQL (Neon) with Prisma ORM
✅ Redis caching (cache-aside pattern)
✅ Background job processing using BullMQ
✅ Retry mechanism with exponential backoff
✅ Failure handling and lifecycle management
✅ Persistent job execution logs (observability)
✅ JWT-based authentication & protected routes
✅ Rate limiting (API protection)
✅ Structured logging (Pino)
✅ Analytics dashboard (/jobs/stats)

🏗 Architecture
Client
   ↓
NestJS API
   ↓
Redis Cache
   ↓
PostgreSQL (Neon)
   ↓
BullMQ Queue
   ↓
Worker Process


🔐 Authentication Flow
Register → Login → Receive JWT → Access Protected Routes
All /jobs endpoints are protected using JWT.

⚙️ Tech Stack
Backend: NestJS (Node.js)
Database: PostgreSQL (Neon)
ORM: Prisma
Cache: Redis (Redis Cloud)
Queue: BullMQ
Auth: JWT + bcrypt
Logging: Pino
Rate Limiting: @nestjs/throttler

📦 API Endpoints
Auth
POST /auth/register
POST /auth/login

Jobs (Protected)
POST /jobs
GET /jobs
GET /jobs/:id
PATCH /jobs/:id
DELETE /jobs/:id

Analytics
GET /jobs/stats

🔄 Job Lifecycle
PENDING → IN_PROGRESS → COMPLETED
                 ↓
               FAILED (after retries)

🧪 How to Run Locally
1️⃣ Install dependencies
npm install

2️⃣ Setup environment variables

Create .env:

DATABASE_URL=your_neon_url
REDIS_HOST=your_redis_host
REDIS_PORT=your_port
REDIS_PASSWORD=your_password
JWT_SECRET=your_secret

3️⃣ Setup database
npx prisma db push
npx prisma generate

4️⃣ Start API
npm run start

5️⃣ Start Worker (IMPORTANT)
npx ts-node src/queue/worker.ts

📊 Observability

Job execution logs stored in DB
Retry attempts tracked
Failure reasons logged

API logs structured via Pino

🔥 Key Highlights

Designed a fault-tolerant job processing system
Implemented retry + exponential backoff
Built cache-aside strategy with Redis
Added secure authentication layer
Ensured API protection via rate limiting
Created analytics endpoints for system monitoring

📌 Future Improvements

Dockerize the system
Add role-based access (RBAC)
Add pagination & filtering
Integrate monitoring dashboards (Grafana)

## 📘 API Documentation

Swagger UI available at:

https://job-processing-distributed-system-production.up.railway.app//api

Use JWT token to authorize protected endpoints.