# BookLib

A microservices-based library management system built with Node.js, MongoDB, and RabbitMQ. The platform handles book cataloging, user authentication, and borrow tracking across three independent services orchestrated with Docker Compose.

---

## Architecture Overview

BookLib is split into three independently deployable services, each with its own database:

| Service         | Port | Responsibility                        | Database       |
|-----------------|------|---------------------------------------|----------------|
| auth-service    | 3001 | User registration, login, JWT tokens  | MongoDB (auth) |
| book-service    | 3002 | Book catalog: add, search, manage     | MongoDB (books)|
| borrow-service  | 3003 | Borrow and return tracking            | MongoDB (borrows)|

Services communicate asynchronously through **RabbitMQ** (AMQP). A shared Docker network (`booklib-network`) connects all containers.

```
Frontend
   |
   |--- auth-service   (port 3001)  <-->  mongo-auth
   |--- book-service   (port 3002)  <-->  mongo-books
   |--- borrow-service (port 3003)  <-->  mongo-borrows
              |
           RabbitMQ (port 5672 / management UI: 15672)
```

---

## Tech Stack

| Layer            | Technology                     |
|------------------|--------------------------------|
| Runtime          | Node.js / JavaScript           |
| Databases        | MongoDB 6 (one per service)    |
| Message broker   | RabbitMQ 3 (with management UI)|
| Frontend         | React | Tailwend Css           |
| Orchestration    | Docker Compose                 |

---

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed

### 1. Clone the repository

```bash
git clone https://github.com/bahasalah255/BookLib.git
cd BookLib
git checkout dev-salah
```

### 2. Configure environment variables

Each service reads from its own `.env` file. Create one for the auth service at minimum:

```bash
cp auth-service/.env.example auth-service/.env
# Edit the file with your JWT secret and any other settings
```

### 3. Start all services

```bash
docker compose up --build
```

This will spin up all three services, three MongoDB instances, and RabbitMQ.

### 4. Access the application

| Endpoint                        | Description                  |
|---------------------------------|------------------------------|
| `http://localhost:3001`         | Auth service API             |
| `http://localhost:3002`         | Book service API             |
| `http://localhost:3003`         | Borrow service API           |
| `http://localhost:15672`        | RabbitMQ management UI       |

> Default RabbitMQ credentials: `guest` / `guest`

---

## Project Structure

```
BookLib/
├── auth-service/           # Authentication microservice
│   ├── .env                # Environment variables (JWT secret, DB URI)
│   └── ...
├── book-service/           # Book catalog microservice
│   └── ...
├── borrow-service/         # Borrow/return tracking microservice
│   └── ...
├── frontend/               # Web frontend (HTML, CSS, JS)
├── docker-compose.yml      # Full stack orchestration
└── .gitignore
```

---

## Services in Detail

### auth-service (port 3001)
Handles user accounts and authentication. Issues JWT tokens consumed by the other services to verify identity.

### book-service (port 3002)
Manages the book catalog. Listens to RabbitMQ events to stay in sync with borrow state (e.g., marking books as available or borrowed).

### borrow-service (port 3003)
Tracks active loans and return history. Publishes events to RabbitMQ when a book is borrowed or returned, so other services can react.

---

## Development

To run a single service in isolation:

```bash
cd auth-service
npm install
npm run dev
```

Make sure a local MongoDB instance is running, or update the `.env` to point to a remote one.

---

## Roadmap

- API Gateway to unify service routing behind a single entry point
- JWT verification middleware shared across services
- Admin dashboard for librarians
- Search and filter on the book catalog
- Automated tests per service (unit + integration)
- CI/CD pipeline with GitHub Actions

---

## Contributing

Contributions are welcome. Please open an issue to discuss changes before submitting a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request targeting the `dev-salah` branch

---

## License

This project is open source. See the repository for more details.