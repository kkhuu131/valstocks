"use client";

import ProfileDisplay from "@/components/profile-display";
import StockDisplaySet from "@/components/stock-display-set";
import { useUser } from "@/context/UserContext";
import MatchesDisplay from "@/components/matches-display";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="py-20">
      <section className="flex flex-col items-center justify-center min-h-screen py-2 px-4 sm:px-6">
        <h1 className="text-4xl font-bold mb-6">ValStocks</h1>
        {user && (
          <div className="w-full max-w-md mx-auto my-5">
            <ProfileDisplay profile={user}/>
          </div>
        )}
        <p className="text-2xl text-muted-foreground mb-6">- Invest below -</p>
        <div className="w-full max-w-2xl mx-auto">
          <StockDisplaySet/>
        </div>
      </section>
    </main>
  );
}
