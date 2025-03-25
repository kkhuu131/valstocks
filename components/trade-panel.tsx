import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { SkeletonCard } from './ui/skeleton-card';
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import createClient from '@/utils/supabase/client';
import { getProfileById } from '@/queries/get-profile-by-id';
import { useStocks } from '@/hooks/useStocks';
import { useUserProfile } from '@/hooks/useUserProfile';

interface TradePanelProps {
    symbol: string
}

export default function TradePanel({ symbol }: TradePanelProps) {
    const supabase = createClient();

    const { profile, isLoading, isError } = useUserProfile();
    const { stocksObject: stocks, isLoading: stocksLoading, isError: stocksError } = useStocks();

    const [shares, setShares] = useState<number>(0);

    if(isLoading || stocksLoading) {
        return <SkeletonCard/>;
    }

    const pricePerShare = stocks[symbol]?.price || 0;
    const estimatedValue = shares * pricePerShare;

    const handleAuth = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'discord',
        });
    };

    const handleBuyConfirmation = async () => {
        if (!profile) {
            console.log("Not logged in!");
            return;
        }

        if (shares * pricePerShare > (profile?.balance || 0)) {
            console.log("Insufficient balance!");
            return;
        }

        const { error } = await supabase.rpc('buy_stock', {
            in_symbol: symbol,
            in_amount: shares,
        });

        if (error) {
            console.error("Error buying stock:", error);
            toast("There was an error buying stock.");
        } else {
            toast("Stock bought successfully! Changes might take several seconds to reflect.");
            setShares(0);
        }
    };

    const handleSellConfirmation = async () => {
        if (!profile) {
            toast("Not logged in!");
            return;
        }

        if (shares <= 0) {
            toast("Invalid shares amount!");
            return;
        }

        if (shares > ((profile?.stocks as Record<string, number> | undefined)?.[symbol] || 0)) {
            toast("Insufficient shares!");
            return;
        }

        const { error } = await supabase.rpc('sell_stock', {
            in_symbol: symbol,
            in_amount: shares,
        });

        if (error) {
            console.error("Error selling stock:", error);
            toast("There was an error selling stock.");
        } else {
            toast("Stock sold successfully! Changes might take several seconds to reflect.");
            setShares(0);
        }
    };

    const handleBuySharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
            setShares(0);
        } else if (value * pricePerShare <= (profile?.balance || 0)) {
            setShares(value);
        }
        else {
            setShares(Math.floor((profile?.balance || 0) / pricePerShare));
        }
    };

    const handleSellSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
            setShares(0);
        } else if (value <= ((profile?.stocks as Record<string, number> | undefined)?.[symbol] || 0)) {
            setShares(value);
        } else {
            setShares((profile?.stocks as Record<string, number> | undefined)?.[symbol] || 0);
        }
    };

    return (
        <Card>
            <Tabs defaultValue="buy" className="flex flex-col items-center">
                <CardHeader className="w-full flex items-center justify-center">
                    {profile ? (
                        <TabsList className="w-fit grid grid-cols-2 gap-2 px-5">
                            <TabsTrigger value="buy">
                                <CardTitle className="text-md sm:text-md">Buy {symbol}</CardTitle>
                            </TabsTrigger>
                            <TabsTrigger value="sell">
                                <CardTitle className="text-md sm:text-md">Sell {symbol}</CardTitle>
                            </TabsTrigger>
                        </TabsList>
                    ) : (
                        <CardTitle>Buy {symbol}</CardTitle>
                    )}
                </CardHeader>
                <TabsContent value="buy">
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="shares">Shares</label>
                                    <input
                                        placeholder='0'
                                        type="number"
                                        id="shares"
                                        value={shares}
                                        onChange={handleBuySharesChange}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="price">Price per Share</label>
                                    <input
                                        type="text"
                                        id="price"
                                        value={`$${pricePerShare.toFixed(2)}`}
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="cost">Estimated Cost</label>
                                    <input
                                        type="text"
                                        id="cost"
                                        value={`$${estimatedValue.toFixed(2)}`}
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                {profile && <div className="flex flex-col gap-2">
                                    <label htmlFor="balance">Balance</label>
                                    <input
                                        type="text"
                                        id="balance"
                                        value={`$${(profile?.balance || 0).toFixed(2)}`}
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                </div>}
                            </div>
                        </CardContent>
                        <CardFooter>
                            {profile ? (
                                stocks[symbol]?.locked ? (
                                    <button
                                        disabled
                                        className="w-full p-2 bg-gray-400 text-white rounded-md"
                                    >
                                        {symbol} is currently locked, cannot buy
                                    </button>
                                ) : (
                                    <AlertDialog>
                                        <AlertDialogTrigger className="w-full p-2 bg-green text-white rounded-md">
                                            Buy
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Buying {symbol}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    You are buying {shares} shares of {symbol} for ${estimatedValue.toFixed(2)}. This action cannot be undone. Are you sure?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="bg-green text-white rounded-md">
                                                    <button onClick={handleBuyConfirmation}>
                                                        Buy
                                                    </button>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )
                            ) : (
                                <button
                                    onClick={() => handleAuth()}
                                    className="w-full p-2 bg-green text-white rounded-md"
                                >
                                    Sign Up to Buy
                                </button>
                            )}
                        </CardFooter>
                </TabsContent>
                <TabsContent value="sell">
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="shares">Shares</label>
                                    <input
                                        type="number"
                                        id="shares"
                                        value={shares}
                                        onChange={handleSellSharesChange}
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="price">Price per Share</label>
                                    <input
                                        type="text"
                                        id="price"
                                        value={`$${pricePerShare.toFixed(2)}`}
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="cost">Estimated Value</label>
                                    <input
                                        type="text"
                                        id="cost"
                                        value={`$${estimatedValue.toFixed(2)}`}
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="balance">Shares Owned</label>
                                    <input
                                        type="text"
                                        id="balance"
                                        value={`${(profile?.stocks as Record<string, number> | undefined)?.[symbol] || 0}`}
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {stocks[symbol]?.locked ? (
                                <button
                                    disabled
                                    className="w-full p-2 bg-gray-400 text-white rounded-md"
                                >
                                    {symbol} is currently locked, cannot sell
                                </button>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger className="w-full p-2 bg-green text-white rounded-md">
                                        Sell
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Selling {symbol}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                You are selling {shares} shares of {symbol} for ${estimatedValue.toFixed(2)}. This action cannot be undone. Are you sure?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-green text-white rounded-md">
                                                <button onClick={handleSellConfirmation}>
                                                    Sell
                                                </button>
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </CardFooter>
                </TabsContent>
            </Tabs>
        </Card>
        
    );
};