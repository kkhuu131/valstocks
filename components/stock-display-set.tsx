"use client"

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
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
import { useStocksContext } from "@/context/StocksContext";
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
    const { stocks, loading, error } = useStocksContext();

    if(loading) {
        return <div className="flex flex-col gap-6 p-4">
            <SkeletonCard/>
            <SkeletonCard/>
            <SkeletonCard/>
        </div>;
    }

    const getChartData = (stock: any) => {
        const stockData = stock.data || [];

        return {
            labels: stockData.map((entry: any) => new Date(entry.timestamp).toLocaleDateString()),
            datasets: [
                {
                    label: "Price Over Time",
                    data: stockData.map((entry: any) => entry.price),
                    borderColor: getBorderColor(stockData),
                    tension: 0.4,
                    fill: true,
                },
            ],
        };
    };

    const getBorderColor = (data: any) => {
        const leftmostPrice = data[0]?.price || 0;
        const rightmostPrice = data[data.length - 1]?.price || 0;
    
        return getPriceColor(rightmostPrice - leftmostPrice);
    };

    const getPriceColor = (val: number) => {
        if (val > 0) {
            return '#5ac639';
        } else if (val < 0) {
            return '#eb5c28';
        } else {
            return 'gray';
        }
    };

    const getChartOptions =() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
        elements: {
            point: {
                radius: 0,
            },
        },
        layout: {
            padding: 0,
        },
    });

    const toggleFavorite = (symbol: string) => {
        const favorites = JSON.parse(localStorage.getItem('favoriteStocks') || '[]');
        if (favorites.includes(symbol)) {
            // Remove from favorites
            console.log("unfavorite");
            const updatedFavorites = favorites.filter((fav: string) => fav !== symbol);
            localStorage.setItem('favoriteStocks', JSON.stringify(updatedFavorites));
        } else {
            console.log("fav");
            // Add to favorites
            favorites.push(symbol);
            localStorage.setItem('favoriteStocks', JSON.stringify(favorites));
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4">
            {Object.values(stocks)
            .sort((a, b) => {
                const favorites = JSON.parse(localStorage.getItem('favoriteStocks') || '[]');
                const isAFavorite = favorites.includes(a.symbol);
                const isBFavorite = favorites.includes(b.symbol);
                if (isAFavorite && !isBFavorite) return -1; // 'a' goes first
                if (!isAFavorite && isBFavorite) return 1; // 'b' goes first
                return 0; // No change
            })
            .map((stock) =>
                <div className="w-full flex flex-row items-center gap-4">
                <Link href={"/stocks/" + stock.symbol} key={stock.symbol} className="flex-grow mr-2">
                    <div className="w-full h-auto overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 group">
                    <Card className="flex flex-row items-center p-6 gap-6">
                        <div className="w-1/5 flex flex-col items-start">
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold">{stock.symbol}</p>
                            <img
                            src={teamMappings.teamBySymbolMap[stock.symbol as keyof typeof teamMappings.teamBySymbolMap]?.img}
                            alt={'${stock.symbol} image'}
                            className="w-6 h-6 object-contain"
                            />
                        </div>
                        <CardDescription>
                            {teamMappings.teamBySymbolMap[stock.symbol as keyof typeof teamMappings.teamBySymbolMap]?.name}
                        </CardDescription>
                        </div>
                        <div className="w-1/2 h-10 flex justify-center items-center">
                        <Line
                            data={getChartData(stock)}
                            options={getChartOptions()}
                        />
                        </div>
                        <div className="w-3/10 flex flex-col items-start">
                        <p className="text-xl font-bold">${stock.price.toFixed(2)}</p>
                        <div className="text-sm">
                            <StockPriceChange 
                            firstPrice={stock?.data?.[0]?.price || 0} 
                            secondPrice={stock?.data?.[stock.data.length - 1]?.price || 0} 
                            />
                        </div>
                        </div>
                    </Card>
                    </div>
                </Link>
                <button
                    onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(stock.symbol);
                    // Toggle the star color and fill manually
                    const star = e.currentTarget.querySelector('svg');
                    if (star) {
                        if (star.classList.contains('text-yellow-500')) {
                        star.classList.remove('text-yellow-500', 'fill-current');
                        star.classList.add('text-gray-400', 'fill-transparent');
                        } else {
                        star.classList.remove('text-gray-400', 'fill-transparent');
                        star.classList.add('text-yellow-500', 'fill-current');
                        }
                    }
                    }}
                >
                    <Star 
                    className={`w-6 h-6 transition-colors duration-300 ease-in-out ${JSON.parse(localStorage.getItem('favoriteStocks') || '[]').includes(stock.symbol) ? 'fill-current text-yellow-500' : 'fill-transparent text-gray-400'}`}
                    />
                </button>
                <div className="w-6 h-6 flex justify-center items-center">
                    {stock.locked ? <Lock/> : null}
                </div>
                </div>
            )}
        </div>
    );    
}