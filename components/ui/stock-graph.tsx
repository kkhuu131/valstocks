"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis } from "recharts"
import React, { useState } from "react";
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
import AnimatingNumber from "./animating-number";
import StockPriceChange from "./stock-price-change";
import teamMappings from "@/data/teamMappings.json";


const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
  timestamp: {
    label: "Timestamp",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface StockGraphProps {
  symbol: string
}

export function StockGraph({ symbol }: StockGraphProps) {
  const { stocks } = useStocksContext();
  const chartData = stocks[symbol]?.data || [];

  const [hoveredPrice, setHoveredPrice] = useState(chartData[chartData.length - 1]?.price || 0);

  const handleMouseMove = (e: any) => {
    if (e.isTooltipActive && e.activePayload && e.activePayload.length) {
      const hoveredData = e.activePayload[0].payload;
      setHoveredPrice(hoveredData.price);
    } else {
      setHoveredPrice(chartData[chartData.length - 1]?.price || 0);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPrice(chartData[chartData.length - 1]?.price || 0);
  };

  const getBorderColor = (data: any) => {
    if (data.length === 0) return 'gray';
    const leftmostPrice = data[0].price;
    const rightmostPrice = hoveredPrice || data[data.length - 1].price;

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

  return (
    <Card className="border border-transparent">
      <CardHeader>
        <CardTitle className="flex flex-col items-start min-w-[200px] text-left">
          <h1 className="text-4xl font-bold mb-2">{teamMappings.teamBySymbolMap[symbol as keyof typeof teamMappings.teamBySymbolMap]?.name}</h1>
          <div className="flex items-center">
            <p className="text-3xl">$</p>
            <AnimatingNumber value={hoveredPrice || (chartData.length > 0 ? chartData[chartData.length - 1].price : 0)} />
          </div>
          <div className="h-2" />
          <StockPriceChange
            firstPrice={chartData[0]?.price || 0}
            secondPrice={hoveredPrice || (chartData.length > 0 ? chartData[chartData.length - 1].price : 0)}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[50px] w-full">
          <LineChart data={chartData} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={(value) => new Date(value).toLocaleTimeString()} />
            <Line
              type="monotone"
              dot={false}
              dataKey="price"
              stroke={getBorderColor(chartData)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
