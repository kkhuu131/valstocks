"use client";

import ProfileDisplay from "@/components/profile-display";
import StockDisplaySet from "@/components/stock-display-set";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="py-20">
      <section className="flex flex-col items-center justify-center min-h-screen py-2 mx-auto px-4">
        <h1 className="text-4xl font-bold">ValStocks</h1>
        {user && 
          <div className="flex w-full max-w-md mx-auto my-5">
            <ProfileDisplay profile={user}/>
          </div>
        }
        <p className="text-2xl text-muted-foreground">- Invest below -</p>
        <StockDisplaySet/>
      </section>
    </main>
  );
}
