"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import teamMappings from "@/data/teamMappings.json";
import Link from "next/link";
import { useStocks } from "@/hooks/useStocks";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import StockPriceChange from "./ui/stock-price-change";
import { Skeleton } from "./ui/skeleton";
import { SkeletonCard } from "./ui/skeleton-card";
import { Lock, Star } from "lucide-react";
import teams from "@/data/teams.json";
import { useState } from "react";
import StockDisplayUnit from "./stock-display-unit";

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function StockDisplaySet() {
    const { stocksObject: stocks, isLoading, isError } = useStocks();

    if(isLoading) {
        return <div className="flex flex-col gap-6 p-4">
            <SkeletonCard/>
            <SkeletonCard/>
            <SkeletonCard/>
        </div>;
    }

    return (
        <div className="flex flex-col gap-6">
            {Object.values(stocks)
            .sort((a, b) => {
            const favorites = JSON.parse(localStorage.getItem('favoriteStocks') || '[]');
            const isAFavorite = favorites.includes(a.symbol);
            const isBFavorite = favorites.includes(b.symbol);
            if (isAFavorite && !isBFavorite) return -1; // 'a' goes first
            if (!isAFavorite && isBFavorite) return 1; // 'b' goes first
            return b.price - a.price; // Sort by price descending
            })
            .map((stock) =>
            <StockDisplayUnit stock={stock} key={stock.symbol}></StockDisplayUnit>
            )}
        </div>
    );    
}