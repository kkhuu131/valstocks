import RankingsTable from "@/components/rankings-table";
import StockDisplaySet from "@/components/stock-display-set";
import { Button } from "@/components/ui/button"
import NavBar from "@/components/ui/nav-bar";
import { StockGraph } from "@/components/ui/stock-graph";
import Link from "next/link";

export default function Rankings() {

  return (
    <main className="pt-20 pb-20">
      <section className="flex flex-col items-center justify-center py-2 w-full max-w-screen-lg mx-auto px-4">
        <h1 className="text-4xl font-bold m-5">Rankings</h1>
        <p className="text-2xl text-muted-foreground">Top 100 Users</p>
        <div className="w-full m-5">
            <RankingsTable/>
        </div>
      </section>
    </main>
  );
}