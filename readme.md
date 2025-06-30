# Finance Dashboard Application

## Overview

This is a full-stack personal finance management application built with React, Express, and PostgreSQL. The application allows users to track income and expenses, categorize transactions, and view financial analytics through an intuitive dashboard interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Request Logging**: Custom middleware for API request/response logging
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot module replacement with Vite integration

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Validation**: Zod schemas for runtime type validation
- **Development Storage**: In-memory storage implementation for testing

## Key Components

### Database Schema
- **Transactions Table**: Core entity storing financial transactions with fields for type (income/expense), amount, category, description, payment method, and timestamps
- **Users Table**: User authentication and management (defined but not fully implemented)
- **Schema Validation**: Drizzle-Zod integration for automatic schema validation

### API Endpoints
- `GET /api/transactions` - Retrieve all transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `PATCH /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- Analytics endpoints for financial summaries and reporting

### UI Components
- **Dashboard**: Financial overview with summary cards, charts, and recent transactions
- **Transaction Management**: CRUD operations with form validation
- **Analytics**: Bar charts for monthly trends and pie charts for expense categories
- **Responsive Design**: Mobile-first approach with collapsible sidebar navigation
- **ShadCN UI Integration**: Official ShadCN components for Button, Card, Input, Form, Select, Dialog, and other UI elements

### Form Handling
- React Hook Form with Zod resolver for type-safe form validation
- Custom form components for transaction creation and editing
- Real-time validation with user feedback

## Data Flow

1. **Client Requests**: React components initiate API calls through TanStack Query
2. **API Processing**: Express server processes requests with validation middleware
3. **Database Operations**: Drizzle ORM handles database interactions with type safety
4. **Response Handling**: JSON responses are cached and managed by React Query
5. **UI Updates**: Components reactively update based on query state changes

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components
- **drizzle-orm**: Type-safe ORM
- **express**: Web application framework
- **react-hook-form**: Form handling
- **zod**: Runtime type validation
- **date-fns**: Date manipulation and formatting

### Development Dependencies
- **drizzle-kit**: Database migrations and introspection
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite compiles React application to static assets
2. **Backend Build**: esbuild bundles Express server with external dependencies
3. **Output Structure**: 
   - Frontend assets in `dist/public/`
   - Server bundle in `dist/index.js`

### Environment Configuration
- **Development**: `NODE_ENV=development` with hot reloading
- **Production**: `NODE_ENV=production` with optimized builds
- **Database**: `DATABASE_URL` environment variable for PostgreSQL connection

### Deployment Commands
- `npm run dev`: Start development server with hot reloading
- `npm run build`: Build both frontend and backend for production
- `npm start`: Start production server
- `npm run db:push`: Apply database schema changes

## Changelog

```
Changelog:
- June 29, 2025. Initial setup with complete finance dashboard
  - Fixed sidebar positioning for proper layout
  - Improved responsive design with fixed navigation
  - Complete dashboard with charts and financial summaries
  - Transaction management with CRUD operations
  - Portuguese language interface
- June 29, 2025. Migration to official ShadCN UI components
  - Replaced all Radix UI direct dependencies with ShadCN CLI components
  - Cleaned up package.json by removing 19 unused Radix UI packages
  - Maintained only essential Radix UI dependencies used by ShadCN internally
  - All components now follow official ShadCN patterns and structure
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
