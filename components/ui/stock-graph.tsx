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
import { useStocks } from "@/hooks/useStocks";
import AnimatingNumber from "./animating-number";
import StockPriceChange from "./stock-price-change";
import teamMappings from "@/data/teamMappings.json";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonCard } from "./skeleton-card";
import { useStockHistory } from "@/hooks/useStockHistory";

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


type Timeframe = '1H' | '1D' | '1W' | '1M' | 'ALL';

const formatTimestamp = (timestamp: string, timeframe: Timeframe) => {
  const date = new Date(timestamp);
  
  switch (timeframe) {
    case '1H':
    case '1D':
      return date.toLocaleTimeString();
    case '1W':
      return `${date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })} ${date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
      })}`;
    case '1M':
    case 'ALL':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });
    default:
      return date.toLocaleTimeString();
  }
};

export function StockGraph({ symbol }: { symbol: string }) {
  const { stocksObject: stocks, isLoading: stocksLoading, isError: stocksError } = useStocks();
  const [timeframe, setTimeframe] = useState<Timeframe>('1H');
  const { stockHistory, isLoading: historyLoading, isError: historyError } = useStockHistory(symbol);
  const [hoveredPrice, setHoveredPrice] = useState(stocks[symbol]?.price || 0);

  // Get the appropriate data based on timeframe
  const getDisplayData = () => {
    if (timeframe === '1H') {
      return stockHistory.minute;
    }

    switch (timeframe) {
      case '1D':
        return stockHistory.fiveMinute;
      case '1W':
        return stockHistory.hourly;
      case '1M':
      case 'ALL':
        return stockHistory.daily;
      default:
        return stockHistory.minute;
    }
  };

  const displayData = getDisplayData();

  const handleMouseMove = (e: any) => {
    if (e.isTooltipActive && e.activePayload && e.activePayload.length) {
      const hoveredData = e.activePayload[0].payload;
      setHoveredPrice(hoveredData.price);
    } else {
      setHoveredPrice(stocks[symbol]?.price || 0);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPrice(stocks[symbol]?.price || 0);
  };

  const getBorderColor = (data: any) => {
    if (data.length === 0) return 'gray';
    const leftmostPrice = data[0].price;
    const rightmostPrice = hoveredPrice || stocks[symbol]?.price;

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

  if (stocksLoading || historyLoading) {
    return (
      <Card className="border border-transparent">
        <CardHeader>
          <CardTitle>
            <SkeletonCard/>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border border-transparent">
      <CardHeader className="space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-start">
          <CardTitle className="flex flex-col items-start min-w-[200px] text-left">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">{teamMappings.teamBySymbolMap[symbol as keyof typeof teamMappings.teamBySymbolMap]?.name}</h1>
            <div className="flex items-center">
              <p className="text-2xl sm:text-3xl">$</p>
              <AnimatingNumber value={hoveredPrice || stocks[symbol]?.price || 0} />
            </div>
            <div className="h-2" />
            <StockPriceChange
              firstPrice={displayData?.[0]?.price || 0}
              secondPrice={hoveredPrice || stocks[symbol]?.price || 0}
            />
          </CardTitle>

          <Tabs 
            defaultValue="1H" 
            value={timeframe}
            className="w-full sm:w-fit" 
            onValueChange={(value) => setTimeframe(value as Timeframe)}
          >
            <TabsList className="grid w-full sm:w-fit grid-cols-5">
              <TabsTrigger className="text-xs sm:text-sm" value="1H">1H</TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm" value="1D">1D</TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm" value="1W">1W</TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm" value="1M">1M</TabsTrigger>
              <TabsTrigger className="text-xs sm:text-sm" value="ALL">ALL</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart 
            data={displayData} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => formatTimestamp(value, timeframe)}
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
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
              dataKey="price"
              stroke={getBorderColor(displayData)}
            />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  labelFormatter={(label) => formatTimestamp(label, timeframe)} 
                />
              } 
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
