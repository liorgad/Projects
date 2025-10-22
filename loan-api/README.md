# Loan API

A Node.js API for loan eligibility evaluation with MySQL database integration.

## Features

- Loan application submission and evaluation
- Crime grade assessment
- Credit score and income validation
- MySQL database persistence
- Docker containerization

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- pnpm (package manager)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=loan_api
DB_USER=loan_user
DB_PASSWORD=loan_password

# Application Configuration
PORT=3000
NODE_ENV=development

# API Key for authentication
API_KEY=your-secret-api-key-here
```

## Quick Start with Docker

1. Clone the repository
2. Create your `.env` file with the variables above
3. Run the application with Docker Compose:

```bash
docker-compose up --build
```

This will start both the MySQL database and the Node.js application.

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start MySQL database:
```bash
docker-compose up mysql -d
```

3. Run the application:
```bash
pnpm run dev
```

## API Endpoints

### POST /loan
Submit a new loan application.

**Request Body:**
```json
{
  "applicantName": "John Doe",
  "propertyAddress": "123 Main St, City, State",
  "creditScore": 750,
  "monthlyIncome": 5000,
  "requestedAmount": 200000,
  "loanTermMonths": 360
}
```

**Response:**
```json
{
  "id": "uuid",
  "eligible": true,
  "reason": "Passed all checks"
}
```

### GET /loan/:id
Retrieve a specific loan application by ID.

### GET /loans
Retrieve all loan applications.

## Database Schema

The application uses a MySQL database with the following table:

- `loan_applications`: Stores loan application data with eligibility results

## Docker Services

- **mysql**: MySQL 8.0 database
- **app**: Node.js application

## Development

- `pnpm run dev`: Start development server
- `pnpm run build`: Build for production
- `pnpm run start`: Start production server
- `pnpm test`: Run tests
