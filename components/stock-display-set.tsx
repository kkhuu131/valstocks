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
        const leftmostPrice = data[0].price;
        const rightmostPrice = data[data.length - 1].price;
    
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

    return (
        <div className="flex flex-col gap-6 p-4">
            {Object.values(stocks).map((stock) =>
                <Link href={"/stocks/" + stock.symbol}>
                    <div key={stock.symbol}  className="w-full h-auto overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 group">
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
            )}
        </div>
    );    
}