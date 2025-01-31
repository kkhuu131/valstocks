"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useStocksContext } from "@/context/StocksContext";
import AnimatingNumber from "./ui/animating-number";
import StockPriceChange from "./ui/stock-price-change";
import teamMappings from "@/data/teamMappings.json";
import { supabase } from "@/lib/supabase";


const chartConfig = {
  price: {
    label: "Net Worth",
    color: "hsl(var(--chart-1))",
  },
  timestamp: {
    label: "Timestamp",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface NetworthGraphProps {
  userId: string
}

export function NetworthGraph({ userId }: NetworthGraphProps) {
    const [chartData, setChartData] = useState<{ timestamp: string; networth: number }[]>([]);
    const [hoveredNetWorth, setHoveredNetWorth] = useState(0);

    useEffect(() => {
        if (!userId) return;

        const fetchNetWorthHistory = async () => {
            console.log("userId", userId);

            const { data, error } = await supabase
                .from("networth_history")
                .select("timestamp, networth")
                .eq("user_id", userId)
                .eq("interval_type", "minute")
                .order("timestamp", { ascending: true });

            if (error) {
                console.error("Error fetching net worth history:", error);
                return;
            }

            console.log(data);

            setChartData(data);
            if (data.length > 0) {
                setHoveredNetWorth(data[data.length - 1].networth); // Set latest net worth
            }
        };

        fetchNetWorthHistory();
    }, []);

    
    const handleMouseMove = (e: any) => {
        if (e.isTooltipActive && e.activePayload?.length) {
          setHoveredNetWorth(e.activePayload[0].payload.networth);
        }
    };

    const handleMouseLeave = () => {
        if (chartData.length > 0) {
            setHoveredNetWorth(chartData[chartData.length - 1].networth);
        }
    };

    const getBorderColor = () => {
        if (chartData.length === 0) return "gray";
        const firstValue = chartData[0].networth;
        const lastValue = hoveredNetWorth;

        return lastValue > firstValue ? "#5ac639" : lastValue < firstValue ? "#eb5c28" : "gray";
    };

    return (
        <Card className="border border-transparent">
            <CardHeader>
            <CardTitle className="flex flex-col items-start min-w-[200px] text-left">
                <h1 className="text-4xl mb-2">Investing</h1>
                <div className="flex items-center">
                <p className="text-3xl">$</p>
                <AnimatingNumber value={hoveredNetWorth} />
                </div>
                <div className="h-2" />
                <StockPriceChange
                    firstPrice={chartData[0]?.networth || 0}
                    secondPrice={hoveredNetWorth || chartData[chartData.length - 1]?.networth || 0}
                />
            </CardTitle>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            tick={false}
                            axisLine={false}
                            width={0}
                        />
                        <Line
                            type="monotone"
                            dot={false}
                            dataKey="networth"
                            stroke={getBorderColor()}
                        />
                        <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => new Date(label).toLocaleTimeString()} />} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
            </CardContent>
        </Card>
    );
}