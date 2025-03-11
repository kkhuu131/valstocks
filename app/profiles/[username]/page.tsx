"use client"

import ProfileDisplay from "@/components/profile-display";
import { useEffect, useState } from "react";
import createClient from "@/utils/supabase/client";
import { getProfileByUsername } from "@/queries/get-profile-by-username";

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
            const supabase = createClient();

            const { data, error } = await getProfileByUsername(supabase, username);
        
            if (error) {
                console.error("Error fetching profile:", error);
                return;
            }

            console.log(data);
            setProfile(data);
        };

        fetchProfile();
    }, []);

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