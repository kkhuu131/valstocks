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
  import { supabase } from "@/lib/supabase";
  import { useEffect, useState } from "react";
import { Avatar } from "./ui/avatar";
import { ChevronUp, ChevronDown } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton-card";

  export default function RankingsTable() {
        const [profiles, setProfiles] = useState<any[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            const fetchProfiles = async () => {
                setIsLoading(true);
                try {
                    const { data, error } = await supabase
                        .from("profiles")
                        .select("*")
                        .order("networth", { ascending: false })
                        .limit(100);
                
                    if (error) {
                        console.error("Error fetching profiles:", error.message);
                        setError(error.message);
                        return;
                    }

                    if (!data) {
                        setError("No data received");
                        return;
                    }

                    setProfiles(data);
                } catch (err) {
                    console.error("Error in fetchProfiles:", err);
                    setError("Failed to fetch profiles");
                } finally {
                    setIsLoading(false);
                }
            };

            fetchProfiles();
        }, []);

        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] w-full">
                    <div className="w-full max-w-4xl px-4">
                        {[...Array(5)].map((_, i) => (
                            <div className="mb-4 w-full" key={i}>
                                <SkeletonCard />
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (error) {
            return <div className="text-red text-center p-4">
                Error loading rankings: {error}
            </div>;
        }

        if (!profiles || profiles.length === 0) {
            return <div className="text-gray-500 text-center p-4">
                No rankings available
            </div>;
        }

        return (
            <Table className="font-bold">
                <TableCaption></TableCaption>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[100px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>PnL</TableHead>
                    <TableHead>Networth</TableHead>
                    {/* <TableHead className="text-right">Balance</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {profiles.map((profile, index) => (
                        <TableRow key={profile.id} onClick={() => window.location.href = `/profiles/${profile.username}`} className="cursor-pointer">
                            <TableCell className="w-[100px]">
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Avatar className="mr-2">
                                        <img 
                                            src={profile.picture || "https://owcdn.net/img/64168fe1322dd.png"} 
                                            alt="User Image" 
                                            className="w-8 h-8 rounded-full" 
                                            onError={(e) => { e.currentTarget.src = "https://owcdn.net/img/64168fe1322dd.png"; }}
                                        />
                                    </Avatar>
                                    {profile.username}
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className={`${
                                    profile.networth - 10000 > 0 
                                        ? 'text-green' 
                                        : profile.networth - 10000 < 0 
                                            ? 'text-red' 
                                            : 'text-gray-500'
                                }`}>
                                    {profile.networth - 10000 > 0 ? '▲' : profile.networth - 10000 < 0 ? '▼' : ''} 
                                    ${Math.abs((profile.networth - 10000.00)).toFixed(2)}
                                </span>
                            </TableCell>
                            <TableCell>${profile.networth.toFixed(2)}</TableCell>
                            {/* <TableCell className="text-right">${profile.balance.toFixed(2)}</TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );    
    }