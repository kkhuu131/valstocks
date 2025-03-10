"use client"

import ProfileDisplay from "@/components/profile-display";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProfilePageProps {
    params: {
        username: string;
    };
}

export default function Profile({ params }: ProfilePageProps) {
    const { username } = params;
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("username", username)
                .single();
        
            if (error) {
                console.error("Error fetching profile:", error.message);
                return;
            }

            console.log(data);
            setProfile(data);
        };

        fetchProfile();

        const profileSubscription = supabase
            .channel("profile-updates")
            .on("postgres_changes", 
            {
                event: "UPDATE",
                schema: "public",
                table: "profiles",
                filter: `username=eq.${username}`
            },
            (payload) => {
                setProfile(payload.new);
            }
            )
            .subscribe();


        return () => {
            supabase.removeChannel(profileSubscription);
        };
    }, [username]);

    return (
        <main className="mt-20 mb-20">
            <section className="items-center justify-center py-2 w-full max-w-screen-lg mx-auto">
                <div className="flex w-full max-w-md mx-auto">
                    <ProfileDisplay profile={profile} />
                </div>
            </section>
        </main>
    );
}