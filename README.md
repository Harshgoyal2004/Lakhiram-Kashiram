# Lakhiram-Kashiram

A professional business website for Lakhiram-Kashiram, a leading provider of quality oils, extracts, and related commodities. Built with modern web technologies, this platform showcases our extensive product catalog and serves various industries including pharmaceuticals, cosmetics, and ayurvedic products.

## Tech Stack

- **Frontend Framework**: Next.js 15.2.3 with App Router
- **Language**: TypeScript
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS with class-variance-authority
- **State Management**: React Query (TanStack Query)
- **Backend & Auth**: Firebase
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Features

- Comprehensive product catalog with detailed information
- Advanced search functionality
- Industry-specific solutions
- Contact and feedback forms
- Responsive design for all devices
- Modern user interface
- Optimized performance
- SEO-friendly structure

## Getting Started

1. **Clone the repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Development Server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:9002`

## Project Structure

```
src/
├── app/           # Next.js pages and API routes
├── components/    # Reusable UI components
├── context/       # React context providers
├── hooks/         # Custom React hooks
└── lib/           # Utilities and configurations
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request


