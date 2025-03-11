"use client"

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
import AnimatingNumber from "./ui/animating-number";
import StockPriceChange from "./ui/stock-price-change";
import teamMappings from "@/data/teamMappings.json";
import { useNetworthHistory } from "@/hooks/useNetworthHistory";


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
  networth: number,
  userId: string
}

export function NetworthGraph({ networth, userId }: NetworthGraphProps) {
    const [hoveredNetWorth, setHoveredNetWorth] = useState(0);
    const { networthHistory, isLoading, isError } = useNetworthHistory(userId);

    const chartData = networthHistory?.minute ?? [];

    useEffect(() => {
        setHoveredNetWorth(networth);
    }, [networth]);
    
    const handleMouseMove = (e: any) => {
        if (e.isTooltipActive && e.activePayload?.length) {
          setHoveredNetWorth(e.activePayload[0].payload.networth);
        }
    };

    const handleMouseLeave = () => {
        if (chartData.length > 0) {
            setHoveredNetWorth(networth);
        }
    };

    const getBorderColor = () => {
        if (chartData.length === 0) return "gray";
        const firstValue = chartData[0].networth || 0;
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
                    secondPrice={hoveredNetWorth || networth || 0}
                />
            </CardTitle>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig}>
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
            </ChartContainer>
            </CardContent>
        </Card>
    );
}