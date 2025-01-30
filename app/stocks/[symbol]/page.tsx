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
    const { symbol } = params;

    return (
        <main className="mt-20 mb-20">
            <section className="items-center justify-center py-2 w-full max-w-screen-lg mx-auto">
                <div className="flex w-full">
                    <div className="w-2/3">
                        <StockGraph symbol={symbol} />
                    </div>
                    <div className="w-1/3 mt-auto">
                        <TradePanel symbol={symbol} />
                    </div>
                </div>
            </section>
        </main>
    );
}