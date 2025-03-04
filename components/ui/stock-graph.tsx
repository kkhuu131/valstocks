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
import AnimatingNumber from "./animating-number";
import StockPriceChange from "./stock-price-change";
import teamMappings from "@/data/teamMappings.json";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchStockBySymbol } from "@/lib/supabaseQueries";
import { SkeletonCard } from "./skeleton-card";

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

type Timeframe = '1H' | '1D' | '1W' | '1M' | 'ALL';

interface HistoricalDataCache {
  minute: any[];
  fiveMinute: any[];
  hourly: any[];
  daily: any[];
}

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

export function StockGraph({ symbol }: StockGraphProps) {
  const { stocks } = useStocksContext();
  const [timeframe, setTimeframe] = useState<Timeframe>('1H');
  const [historicalDataCache, setHistoricalDataCache] = useState<HistoricalDataCache>({
    minute: [],
    fiveMinute: [],
    hourly: [],
    daily: []
  });
  const [hoveredPrice, setHoveredPrice] = useState(stocks[symbol]?.price || 0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllHistoricalData = async () => {
      setIsLoading(true);
      try {
        const [minuteData, fiveMinuteData, hourlyData, dailyData] = await Promise.all([
          fetchStockBySymbol(symbol, 'minute'),
          fetchStockBySymbol(symbol, '5-minute'),
          fetchStockBySymbol(symbol, 'hourly'),
          fetchStockBySymbol(symbol, 'daily')
        ]);

        setHistoricalDataCache({
          minute: minuteData || [],
          fiveMinute: fiveMinuteData || [],
          hourly: hourlyData || [],
          daily: dailyData || []
        });
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllHistoricalData();
  }, [symbol]);

  // Get the appropriate data based on timeframe
  const getDisplayData = () => {
    if (timeframe === '1H') {
      return stocks[symbol]?.data || [];
    }

    switch (timeframe) {
      case '1D':
        return historicalDataCache.fiveMinute;
      case '1W':
        return historicalDataCache.hourly;
      case '1M':
      case 'ALL':
        return historicalDataCache.daily;
      default:
        return stocks[symbol]?.data || [];
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

  if (isLoading) {
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
      <CardHeader>
        <CardTitle className="flex flex-col items-start min-w-[200px] text-left">
          <h1 className="text-4xl font-bold mb-2">{teamMappings.teamBySymbolMap[symbol as keyof typeof teamMappings.teamBySymbolMap]?.name}</h1>
          <div className="flex items-center">
            <p className="text-3xl">$</p>
            <AnimatingNumber value={hoveredPrice || stocks[symbol]?.price || 0} />
          </div>
          <div className="h-2" />
          <StockPriceChange
            firstPrice={displayData[0]?.price || 0}
            secondPrice={hoveredPrice || stocks[symbol]?.price || 0}
          />
        </CardTitle>
        <Tabs 
          defaultValue="1H" 
          value={timeframe}
          className="w-fit pt-2" 
          onValueChange={(value) => setTimeframe(value as Timeframe)}
        >
          <TabsList className="grid grid-cols-5 w-fit">
            <TabsTrigger value="1H">1H</TabsTrigger>
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="ALL">ALL</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[50px] w-full">
          <LineChart data={displayData} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => formatTimestamp(value, timeframe)}
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
