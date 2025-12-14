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

## Future Enhancements

- Purchase history with filters
- Advanced admin analytics
- Inventory alerts
- Sweet details/reviews
- Bulk import/export
- Dark mode toggle
- Mobile app version
