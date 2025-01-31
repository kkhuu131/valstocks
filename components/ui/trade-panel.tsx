import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { useStocksContext } from "@/context/StocksContext";
import { useUser } from "@/context/UserContext";
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
  import { supabase } from "@/lib/supabase";
import { SkeletonCard } from './skeleton-card';
  

interface TradePanelProps {
    symbol: string
}

export default function TradePanel({ symbol }: TradePanelProps) {
    const { user, loading } = useUser();

    if(loading) {
        return <SkeletonCard/>;
    }

    const { stocks } = useStocksContext();
    const [shares, setShares] = useState<number>(0);

    const pricePerShare = stocks[symbol]?.price || 0;
    const estimatedValue = shares * pricePerShare;

    // const getURL = () => {
    //     let url =
    //         process.env.NEXT_PUBLIC_SITE_URL ??
    //         process.env.NEXT_PUBLIC_VERCEL_URL ??
    //         'http://localhost:3000';
    //     // Make sure to include `https://` when not localhost.
    //     url = url.includes('http') ? url : `https://${url}`;
    //     // Make sure to include a trailing `/`.
    //     url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    //     return url;
    // };

    const handleAuth = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'discord',
        });
    };

    const handleBuyConfirmation = async () => {
        if (!user) {
            console.log("Not logged in!");
            return;
        }

        if (shares * pricePerShare > (user?.balance || 0)) {
            console.log("Insufficient balance!");
            return;
        }

        const { error } = await supabase.rpc('buy_stock', {
            in_symbol: symbol,
            in_user_id: user.id,
            in_amount: shares,
        });

        if (error) {
            console.error("Error buying stock:", error);
        } else {
            console.log("Stock bought successfully!");
            setShares(0);
        }
    };

    const handleSellConfirmation = async () => {
        if (!user) {
            console.log("Not logged in!");
            return;
        }

        if (shares <= 0) {
            console.log("Invalid shares amount!");
            return;
        }

        if (shares > (user?.stocks[symbol] || 0)) {
            console.log("Insufficient shares!");
            return;
        }

        const { error } = await supabase.rpc('sell_stock', {
            in_symbol: symbol,
            in_user_id: user.id,
            in_amount: shares,
        });

        if (error) {
            console.error("Error selling stock:", error);
        } else {
            console.log("Stock sold successfully!");
            setShares(0);
        }
    };

    const handleBuySharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
            setShares(0);
        } else if (value * pricePerShare <= (user?.balance || 0)) {
            setShares(value);
        }
        else {
            setShares(Math.floor((user?.balance || 0) / pricePerShare));
        }
    };

    const handleSellSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 0) {
            setShares(0);
        } else if (value <= (user?.stocks[symbol] || 0)) {
            setShares(value);
        } else {
            setShares(user?.stocks[symbol] || 0);
        }
    };

    return (
        <Card>
            <Tabs defaultValue="buy">
                <CardHeader className="flex justify-start">
                    {user ? (<TabsList className="flex space-x-2">
                        <TabsTrigger value="buy"><CardTitle>Buy {symbol}</CardTitle></TabsTrigger>
                        <TabsTrigger value="sell"><CardTitle>Sell {symbol}</CardTitle></TabsTrigger>
                    </TabsList>) : (<CardTitle>Buy {symbol}</CardTitle>)}
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
                                {user && <div className="flex flex-col gap-2">
                                    <label htmlFor="balance">Balance</label>
                                    <input
                                        type="text"
                                        id="balance"
                                        value={`$${user?.balance.toFixed(2)}`}
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                </div>}
                            </div>
                        </CardContent>
                        <CardFooter>
                            {user ? (
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
                                        <AlertDialogAction className="bg-green text-white rounded-md"><button
                                            onClick={handleBuyConfirmation}
                                        >
                                            Buy
                                        </button></AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
                                        value={`${user?.stocks[symbol] || 0}`}
                                        disabled
                                        className="p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
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
                                    <AlertDialogAction className="bg-green text-white rounded-md"><button
                                        onClick={handleSellConfirmation}
                                    >
                                        Sell
                                    </button></AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                </TabsContent>
            </Tabs>
        </Card>
        
    );
};