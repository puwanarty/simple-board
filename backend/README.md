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
