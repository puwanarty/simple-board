# Simple Board

## Installation

```bash
git clone https://github.com/your-username/simple-board.git
cd simple-board
```

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Initialize the database:

   ```bash
   docker-compose up -d
   ```

4. Set up environment variables:
   Create a `.env` file in the `backend` directory and add the following:

   ```env
   DATABASE_URL=your_database_url
   ```

5. Run database migrations:

   ```bash
   pnpm prisma migrate dev
   ```

6. Start the application:
   ```bash
   pnpm start:dev
   ```

### Frontend

1. Navigate to the frontend directory:

   ```bash
    cd frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the `frontend` directory and add the following:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the application:
   ```bash
   pnpm dev
   ```

## Application Architecture

The application is built using the NestJS framework for the backend and Next.js for the frontend. It follows a monolithic architecture with a single codebase for the backend and frontend.

### Features

- **Database**: PostgreSQL database with Prisma ORM.
- **Authentication**: User login with JWT-based authentication.
- **CRUD Operations**: Create, read, update, and delete posts and comments.
- **Validation**: Input validation using class-validator.
- **Error Handling**: Centralized error handling using custom exceptions.
- **Frontend**: Next.js frontend with SWR for data fetching.
- **Testing**: Unit tests for services and controllers.

## Libraries and Packages

- **react-hook-form**: Library for managing form state.
- **swr**: React Hooks library for data fetching.
- **dayjs**: Library for date and time formatting.
- **lucide-react**: Icon library for React.
- **cookies-next**: Library for managing cookies in Next.js.

## Running Unit Tests

### Backend

To run unit tests, use the following command:

```bash
pnpm test
```

To run tests in watch mode:

```bash
pnpm test:watch
```

To generate a coverage report:

```bash
pnpm test:cov
```
