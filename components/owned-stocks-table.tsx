"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { useStocksContext } from "@/context/StocksContext";
import { SkeletonCard } from "./ui/skeleton-card";
import StockPriceChange from "./ui/stock-price-change";

  export default function OwnedStocksTable({ stocks: ownedStocks }: { stocks: Map<string, number> }) {
    const { stocks, loading } = useStocksContext();

    if(loading) {
        return <SkeletonCard/>;
    }

    return (
        <Table>
            <TableCaption></TableCaption>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">Team</TableHead>
                <TableHead className="text-right">Owned</TableHead>
                <TableHead className="text-right">Price</TableHead>
                {/* <TableHead className="text-right">Total Value</TableHead> */}
                <TableHead className="text-right">Last Hour</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
        {       Object.entries(ownedStocks)
                        .sort(([, amountA], [, amountB]) => amountB - amountA)
                        .map(([symbol, amount]) => (
                    <TableRow key={symbol} onClick={() => window.location.href = `/stocks/${symbol}`} className="cursor-pointer">
                            <TableCell className="w-[100px]">
                                {symbol}
                            </TableCell>
                            <TableCell className="text-right">
                                {amount}
                            </TableCell>
                            <TableCell className="text-right">
                                ${(stocks[symbol]?.price || 0).toFixed(2)}
                            </TableCell>
                            {/* <TableCell className="text-right">
                                ${(amount * stocks[symbol]?.price || 0).toFixed(2)}
                            </TableCell> */}
                            <TableCell className="text-right">
                                <div className="text-sm">
                                    <StockPriceChange 
                                        firstPrice={stocks[symbol]?.data?.[0]?.price || 0} 
                                        secondPrice={stocks[symbol]?.data?.[stocks[symbol].data.length - 1]?.price || 0} 
                                    />
                                </div>
                            </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );    
}