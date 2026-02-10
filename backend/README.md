# CyberShield Authentication Backend

A secure Node.js/Express authentication server for the CyberShield application.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Setup Instructions

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Configure Environment**:
    - Copy the example environment file:
      ```bash
      cp .env.example .env
      ```
    - Open `.env` and set a secure `JWT_SECRET`.

4.  **Start the Server**:
    ```bash
    npm start
    ```
    The server will run at `http://localhost:3000`.

## API Endpoints

### Authentication

-   `POST /api/auth/register`
    -   Body: `{ "name": "...", "email": "...", "password": "..." }`
    -   Success: `201 Created`

-   `POST /api/auth/login`
    -   Body: `{ "email": "...", "password": "..." }`
    -   Success: `200 OK` (Returns JWT token)

-   `GET /api/auth/verify`
    -   Headers: `Authorization: Bearer <token>`
    -   Success: `200 OK` (Returns user info)

-   `POST /api/auth/logout`
    -   Headers: `Authorization: Bearer <token>`
    -   Success: `200 OK`

## Database

This project uses **SQLite**. The database file is automatically created at `src/database/users.db` upon first run.
