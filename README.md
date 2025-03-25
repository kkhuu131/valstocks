# ValStocks

ValStocks is a stock trading simulator for the popular FPS game, VALORANT. There is no real money involved and is simply for fun. Each stock is based on a pro team's performance in the Champions League. The value of stocks also take into account general sentiment using Reddit, and supply and demand. You can buy and sell stocks to earn money or to root for your favorite teams, and compete against other players. Currently, you have to be logged in using Discord OAuth to trade stocks.

## Setup and Running the Project

To get started with ValStocks, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kkhuu131/valstocks.git
   cd valstocks
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   - Create a `.env.local` file in the root directory.
   - Add the necessary environment variables (e.g., Supabase keys, Discord OAuth credentials). Refer to `.env.example` for the required variables.

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

Make sure you have Node.js and npm installed on your machine before proceeding.

## Tech Stack

Frontend:

- Typescript
- React
- Next.js
- Tailwind CSS
- Shadcn UI

Backend:

- Node.js
- Express

Database:

- Supabase
- PostgreSQL

Deployment:

- Vercel
- Render

## Features

- User authentication (Discord OAuth)
- Stock portfolio
- Stock trading (buy/sell)
- Stock and Networth history
- User rankings
