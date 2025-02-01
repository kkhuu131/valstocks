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
import Link from "next/link";

  export default function RankingsTable() {
        const [profiles, setProfiles] = useState<any[]>([]);

        useEffect(() => {
            const fetchProfiles = async () => {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .order("networth", { ascending: false })
                    .limit(100);
            
                if (error) {
                    console.error("Error fetching profiles:", error.message);
                    return;
                }
                setProfiles(data);
            };

            fetchProfiles();
        }, []);

    return (
        <Table>
            <TableCaption></TableCaption>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Networth</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {profiles.map((profile, index) => (
                    <TableRow key={profile.id} onClick={() => window.location.href = `/profiles/${profile.username}`} className="cursor-pointer">
                            <TableCell className="w-[100px]">{index + 1}
                            </TableCell>
                            <TableCell className="flex items-center">
                                <Avatar className="mr-2">
                                    <img 
                                        src={profile.picture || "https://owcdn.net/img/64168fe1322dd.png"} 
                                        alt="User Image" 
                                        className="w-8 h-8 rounded-full" 
                                        onError={(e) => { e.currentTarget.src = "https://owcdn.net/img/64168fe1322dd.png"; }}
                                    />
                                </Avatar>
                                {profile.username}
                            </TableCell>
                            <TableCell>${profile.networth.toFixed(2)}</TableCell>
                            <TableCell className="text-right">${profile.balance.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );    
}