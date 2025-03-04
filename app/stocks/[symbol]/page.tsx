"use client"

import StockDisplaySet from "@/components/stock-display-set";
import { Button } from "@/components/ui/button"
import NavBar from "@/components/ui/nav-bar";
import { StockGraph } from "@/components/ui/stock-graph";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import TradePanel from "@/components/ui/trade-panel";

interface StockPageProps {
    params: {
        symbol: string;
    };
}

export default function Stocks({ params }: StockPageProps) {
    const symbol = decodeURIComponent(params.symbol);

    return (
        <main className="mt-20 mb-20 px-4 sm:px-6">
            <section className="items-center justify-center py-2 w-full max-w-screen-lg mx-auto">
                <div className="flex flex-col lg:flex-row w-full gap-4">
                    <div className="w-full lg:w-2/3">
                        <StockGraph symbol={symbol} />
                    </div>
                    <div className="w-full lg:w-1/3">
                        <TradePanel symbol={symbol} />
                    </div>
                </div>
            </section>
        </main>
    );
}