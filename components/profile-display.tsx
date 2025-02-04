"use client"

import { Avatar } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import OwnedStocksTable from "./owned-stocks-table";
import { NetworthGraph } from "./networth-graph";

  export default function ProfileDisplay({profile}: {profile: any}) {

    return (
        <div className="mx-auto w-full max-w-4xl">
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
                {profile?.id && (
                    <div>
                        <NetworthGraph networth={profile.networth} userId={profile.id}/>
                    </div>
                )}
                <p >Balance: ${profile?.balance || "0.00"}</p>
                </div>

                <div className="mt-5">
                <OwnedStocksTable stocks={profile?.stocks || {}}/>
                </div>
            </CardContent>
            </Card>
        </div>
    );    
}