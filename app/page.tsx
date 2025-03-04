"use client";

import ProfileDisplay from "@/components/profile-display";
import StockDisplaySet from "@/components/stock-display-set";
import { useUser } from "@/context/UserContext";
import MatchesDisplay from "@/components/matches-display";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="py-20">
      <section className="flex flex-col items-center justify-center min-h-screen py-2 mx-auto px-4">
        <h1 className="text-4xl font-bold">ValStocks</h1>
          {
            user && (
              <div className="flex-1 my-5">
                <ProfileDisplay profile={user}/>
              </div>
            )
          }
          {/* <div className="flex flex-row gap-6 items-center justify-center w-full max-w-4xl mx-auto my-5">
            {
              user && (
                <div className="flex-1">
                  <ProfileDisplay profile={user}/>
                </div>
              )
            }
            <div className="flex-1">
              <MatchesDisplay />
            </div>
          </div> */}
        <p className="text-2xl text-muted-foreground">- Invest below -</p>
        <StockDisplaySet/>
      </section>
    </main>
  );
}
