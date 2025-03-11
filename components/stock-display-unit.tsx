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
    Filler,
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
import { useStockHistory } from "@/hooks/useStockHistory";
import teams from "@/data/teams.json";
import { useState } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function StockDisplayUnit({stock}: any) {
    const { stockHistory, isLoading, isError } = useStockHistory(stock.symbol);

    if (isLoading) {
        return <div></div>;
    }

    const getChartData = () => {
        const stockData = stockHistory.minute || [];

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
            <div className="w-full flex flex-row items-center gap-4" key={stock.symbol}>
                <Link href={"/stocks/" + stock.symbol} className="flex-grow mr-2">
                    <div className="w-full h-auto overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 group">
                        <Card className="flex flex-row items-center p-4 sm:p-6 gap-4 sm:gap-6">
                            <div className="min-w-[120px] sm:w-1/5 flex flex-col items-start">
                                <div className="flex items-center gap-2">
                                    <p className="text-base sm:text-lg font-semibold">{stock.symbol}</p>
                                    <img
                                        src={teamMappings.teamBySymbolMap[stock.symbol as keyof typeof teamMappings.teamBySymbolMap]?.img}
                                        alt={'${stock.symbol} image'}
                                        className="w-6 h-6 object-contain"
                                    />
                                </div>
                                <CardDescription className="text-sm truncate max-w-[120px]">
                                    {teamMappings.teamBySymbolMap[stock.symbol as keyof typeof teamMappings.teamBySymbolMap]?.name}
                                </CardDescription>
                            </div>
                            <div className="hidden md:block w-2/5 h-8 flex-shrink">
                                <Line
                                    data={getChartData()}
                                    options={getChartOptions()}
                                />
                            </div>
                            <div className="flex flex-col items-start ml-auto">
                                <p className="text-lg sm:text-xl font-bold">${stock.price.toFixed(2)}</p>
                                <div className="text-sm">
                                    <StockPriceChange 
                                        firstPrice={stockHistory?.minute?.[0].price || 0} 
                                        secondPrice={stock.price || 0}
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
                    className="flex-shrink-0"
                >
                    <Star 
                        className={`w-6 h-6 transition-colors duration-300 ease-in-out ${
                            JSON.parse(localStorage.getItem('favoriteStocks') || '[]').includes(stock.symbol) 
                                ? 'fill-current text-yellow-500' 
                                : 'fill-transparent text-gray-400'
                        }`}
                    />
                </button>
                <div className="w-6 h-6 flex-shrink-0 flex justify-center items-center">
                    {stock.locked ? <Lock/> : null}
                </div>
            </div>
    );    
};