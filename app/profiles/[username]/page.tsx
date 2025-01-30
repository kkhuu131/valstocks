"use client"

import ProfileDisplay from "@/components/profile-display";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProfilePageProps {
    params: {
        username: string;
    };
}

export default function Stocks({ params }: ProfilePageProps) {
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
    }, [username]);

    return (
        <main className="mt-20 mb-20">
            <section className="items-center justify-center py-2 w-full max-w-screen-lg mx-auto">
                <div className="flex w-full">
                    <div className="max-w-md mx-auto">
                        <ProfileDisplay profile={profile} />
                    </div>
                </div>
            </section>
        </main>
    );
}