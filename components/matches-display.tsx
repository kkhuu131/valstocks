"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "@/lib/supabase";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

  export default function MatchesDisplay() {
    const [matches, setMatches] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchMatches = async () => {
            const { data, error } = await supabase
                .from("matches")
                .select("*")
                .order("status", { ascending: false })
                .limit(100);
        
            if (error) {
                console.error("Error fetching matches:", error.message);
                return;
            }
            setMatches(data);
        };

        fetchMatches();
    }, []);

    return (
        <div className="mx-auto w-full max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <span>Matches</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mt-5">
                        <Table>
                            <TableCaption>Recent matches</TableCaption>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead>Event</TableHead>
                                    <TableHead>Series</TableHead>
                                    <TableHead className="w-[100px]">Team 1</TableHead>
                                    <TableHead className="text-center">Score</TableHead>
                                    <TableHead className="w-[100px] text-right">Team 2</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {matches.map((match, index) => (
                                    <TableRow key={match.link} onClick={() => window.location.href = match.link} className="cursor-pointer">
                                        <TableCell>{match.match_event}</TableCell>
                                        <TableCell>{match.match_series}</TableCell>
                                        <TableCell>{match.team1_symbol || "TBD"}</TableCell>
                                        <TableCell className="text-center">{match.team1_score || "0"} - {match.team2_score || "0"}</TableCell>
                                        <TableCell className="text-right">{match.team2_symbol || "TBD"}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );    
}