# Sweet Shop Frontend

A modern React + TypeScript frontend for the Sweet Shop inventory management system.

## Features

- 🔐 User authentication (Login/Register) with JWT
- 🍰 Browse and search sweet inventory
- 💰 Purchase sweets with customer tracking
- 📦 Restock management (admin only)
- 👨‍💼 Admin dashboard with analytics
- 🎨 Beautiful Tailwind CSS design
- 📱 Responsive mobile-first layout

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Context API** - State management
- **Vitest** - Unit testing framework
- **@testing-library/react** - Component testing utilities
- **jsdom** - DOM emulation for tests

## Setup

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:3000`

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

All 32 frontend tests passing:

- **7 tests** - API client (axios configuration & interceptors)
- **7 tests** - AuthContext (login, register, logout, admin role)
- **5 tests** - ProtectedRoute (access control & redirects)
- **6 tests** - LoginPage (form submission, validation, error handling)
- **7 tests** - RegisterPage (form submission, password validation, loading states)

### Build for Production

```bash
npm run build
```

## Environment Variables

Create a `.env.local` file:

```
VITE_API_URL=http://localhost:3000/api
```

## Project Structure

```
src/
├── components/        # Reusable components
├── contexts/          # React Context (Auth)
├── lib/              # Utilities (API client)
├── pages/            # Page components
├── App.tsx           # Main app
└── main.tsx          # Entry point
```

## API Integration

The frontend communicates with the backend API at:

- Login: `POST /api/auth/login`
- Register: `POST /api/auth/register`
- Sweets: `GET /api/sweets/search`
- Purchases: `POST /api/purchases`, `GET /api/purchases`
- Restocks: `POST /api/restocks`, `GET /api/restocks`

JWT tokens are automatically attached to requests via axios interceptor.

## Implementation Notes

- Uses localStorage for JWT token persistence
- Automatic redirect to login on 401 responses
- Admin-only features behind role-based access control
- Case-insensitive sweet search via backend

## Testing

This project follows **Test-Driven Development (TDD)** principles with comprehensive test coverage:

### Test Coverage

- **API Client Tests** - Verify axios configuration, interceptors, and token handling
- **Authentication Tests** - Test login, register, logout, and admin role detection
- **Route Protection Tests** - Verify access control and redirect logic
- **Form Tests** - Comprehensive testing of form submission, validation, and error handling
- **Context Tests** - Test React Context behavior with proper provider setup

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- src/pages/__tests__/LoginPage.test.tsx
```

### Test Stack

- **Vitest** - Lightning-fast unit test framework (Vue ecosystem but works with React)
- **@testing-library/react** - Query components like users do
- **@testing-library/user-event** - Simulate realistic user interactions
- **jsdom** - Browser-like environment for testing
- **vi (Vitest mocking)** - Mock modules and functions

All tests follow best practices:

- Tests focus on **user behavior** not implementation details
- Proper **async/await** handling with waitFor
- Mock external dependencies (API calls, routing)
- Clear test names describing what should happen

## Future Enhancements

- Purchase history with filters
- Advanced admin analytics
- Inventory alerts
- Sweet details/reviews
- Bulk import/export
- Dark mode toggle
- Mobile app version
