# Nest Expense Splitter

A NestJS-based Expense Splitter API that helps manage group expenses and calculate balances between members.

## Features

- **Groups Management**: Create and list groups with members
- **Expense Tracking**: Add and list expenses for groups
- **Balance Calculation**: Calculate who owes money and who is owed money
- **Settlement Suggestions**: Get optimized settlement suggestions to minimize transactions
- **Validation**: Input validation using class-validator
- **In-Memory Storage**: Simple in-memory storage (no database required)

## API Endpoints

### Groups

- `POST /groups` - Create a new group
- `GET /groups` - List all groups
- `GET /groups/:id` - Get a specific group

### Expenses

- `POST /expenses` - Add a new expense
- `GET /expenses?groupId=:id` - List expenses for a group
- `GET /expenses/:id` - Get a specific expense

### Balances

- `GET /balances/group/:groupId` - Get balance calculation for a group
- `GET /balances/group/:groupId/settlements` - Get settlement suggestions for a group
- `GET /balances` - Get balances for all groups

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## Usage Examples

### Create a Group

```bash
curl -X POST http://localhost:3000/groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vacation Trip",
    "description": "Our summer vacation expenses",
    "members": ["Alice", "Bob", "Charlie"]
  }'
```

### Add an Expense

```bash
curl -X POST http://localhost:3000/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "your-group-id",
    "description": "Hotel accommodation",
    "amount": 300,
    "paidBy": "Alice",
    "splitAmong": ["Alice", "Bob", "Charlie"]
  }'
```

### Get Balance Calculation

```bash
curl -X GET http://localhost:3000/balances/group/your-group-id
```

### Get Settlement Suggestions

```bash
curl -X GET http://localhost:3000/balances/group/your-group-id/settlements
```

## Project Structure

```
src/
├── common/                 # Shared modules and services
│   ├── interfaces.ts       # TypeScript interfaces
│   ├── memory-storage.service.ts  # In-memory storage service
│   └── memory-storage.module.ts   # Storage module
├── groups/                 # Groups feature module
│   ├── dto/               # Data transfer objects
│   ├── groups.controller.ts
│   ├── groups.service.ts
│   └── groups.module.ts
├── expenses/              # Expenses feature module
│   ├── dto/
│   ├── expenses.controller.ts
│   ├── expenses.service.ts
│   └── expenses.module.ts
├── balances/              # Balances feature module
│   ├── balances.controller.ts
│   ├── balances.service.ts
│   └── balances.module.ts
├── app.module.ts          # Root application module
└── main.ts                # Application entry point
```

## Architecture

This application follows NestJS best practices:

- **Modular Architecture**: Features are organized into separate modules
- **Dependency Injection**: Services are injected using NestJS DI container
- **DTOs with Validation**: Input validation using class-validator decorators
- **Global Storage**: In-memory storage service available across all modules
- **Clean Separation**: Controllers handle HTTP, services handle business logic

## Balance Calculation Logic

The balance calculation works as follows:

1. For each expense, the person who paid gets credited the full amount
2. The expense amount is divided equally among all members in `splitAmong`
3. Each member in `splitAmong` gets debited their share
4. Final balances show:
   - Positive balance: Amount the person is owed
   - Negative balance: Amount the person owes

Settlement suggestions use a greedy algorithm to minimize the number of transactions needed to settle all debts.