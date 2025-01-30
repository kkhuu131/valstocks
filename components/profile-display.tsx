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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import OwnedStocksTable from "./owned-stocks-table";

  export default function ProfileDisplay({profile}: {profile: any}) {

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Avatar>
                            <img 
                                src={profile?.picture || "https://owcdn.net/img/64168fe1322dd.png"}
                                alt="User Image"
                                className="w-8 h-8 rounded-full"
                                onError={(e) => { e.currentTarget.src = "https://owcdn.net/img/64168fe1322dd.png"; }}
                            />
                        </Avatar>
                        <span>{profile?.username}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <p className="text-6xl m-5">${profile?.networth || "0.00"}</p>
                        <p>Balance: ${profile?.balance || "0.00"}</p>
                    </div>

                    <div className="mt-5">
                        <OwnedStocksTable stocks={profile?.stocks || {}}/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );    
}