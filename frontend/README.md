# FitTrack Pro - Fitness Routine Application

A full-featured fitness tracking application with modern UI/UX that helps users create, track, and optimize workout routines.

## Technologies Used

### Backend
- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API architecture

### Frontend
- Next.js 15
- Tailwind CSS
- shadcn UI component system
- Framer Motion for animations
- Three.js & React Three Fiber for 3D effects
- React Hook Form with Zod validation

## Development Phases

### Phase 2: UI Development with Mock Data
The current phase uses mock data for UI development. All interactions are client-side only.

### Phase 3: Backend Integration
The application is now prepared for backend integration. The data fetching hooks have been updated to conditionally use API services when available.

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend Integration Instructions

To switch from mock data to real API:

1. Make sure your backend server is running at the URL specified in `.env.local`
2. Change the `NEXT_PUBLIC_USE_MOCK_DATA` setting in `.env.local` to `false`
3. Restart your development server

```bash
# .env.local
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Update this to your backend URL
```

## Project Structure

- `/src/app` - Next.js app router pages and components
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and hooks
  - `api.ts` - API service functions for backend communication
  - `data-hooks.ts` - Custom hooks for data fetching
  - `mock-data.ts` - Mock data for UI development
  - `types.ts` - TypeScript interfaces and types

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
