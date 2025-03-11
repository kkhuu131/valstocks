"use client";

import ProfileDisplay from "@/components/profile-display";
import StockDisplaySet from "@/components/stock-display-set";
import { useUserProfile } from "@/hooks/useUserProfile";
import MatchesDisplay from "@/components/matches-display";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export default function Home() {
  const {profile, isLoading, isError} = useUserProfile();

  if(isLoading) {
    return 
      <div className="mx-auto w-full max-w-4xl">
      </div>;
  }

  return (
    <main className="py-20">
      <section className="flex flex-col items-center justify-center min-h-screen py-2 px-4 sm:px-6">
        <h1 className="text-4xl font-bold mb-6">ValStocks</h1>
        {profile && (
          <div className="w-full max-w-md mx-auto my-5">
            <ProfileDisplay profile={profile}/>
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
