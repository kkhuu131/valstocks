"use client";

import ProfileDisplay from "@/components/profile-display";
import StockDisplaySet from "@/components/stock-display-set";
import { Button } from "@/components/ui/button"
import NavBar from "@/components/ui/nav-bar";
import { StockGraph } from "@/components/ui/stock-graph";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function Home() {
  const { user, loading } = useUser();

  return (
    <main className="pt-20">
      <section className="flex flex-col items-center justify-center min-h-screen py-2 w-full max-w-screen-lg mx-auto px-4">
        <h1 className="text-4xl font-bold">ValStocks</h1>
        {user && 
          <div className="w-full m-5">
            <ProfileDisplay profile={user}/>
          </div>
        }
        <p className="text-2xl text-muted-foreground">- Invest below -</p>
        <StockDisplaySet/>
      </section>
    </main>
  );
}
