# Heart Rate Monitor

This is a [Next.js](https://nextjs.org) project that monitors heart rate data and stores it in a Supabase database.

## Supabase Integration

This application uses Supabase for data storage. The configuration uses the Supabase JavaScript client.

The system stores heart rate request data and displays the last 5 requests on the homepage.

## Getting Started

1. First, create a Supabase project at [supabase.com](https://supabase.com)
2. Create a table called `heart_rate_data` with the following columns:
   - `id` (bigint, primary key, auto-increment)
   - `data` (jsonb, storing heart rate data)
   - `created_at` (timestamp with timezone)
3. Copy `.env.local.example` to `.env.local` and update with your Supabase credentials
4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Supabase integration for data storage
- Display of latest heart rate data
- Display of the last 5 heart rate requests
- Real-time data refreshing

## Supabase Configuration

The Supabase configuration is stored in `src/lib/supabase.ts`. The application uses Supabase Tables for storing heart rate data.

## API Routes

- `POST /api/heart-rate` - Send heart rate data to be stored in the database (any valid JSON)
- `GET /api/heart-rate` - Get the latest heart rate data and the last 5 requests

## Input Data Format

The heart rate data input can be any valid JSON object. Example:

```json
{
  "heartRate": 75,
  "userId": "user123",
  "deviceId": "device456",
  "timestamp": "2025-04-29T15:43:01Z"
}
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features and APIs.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
