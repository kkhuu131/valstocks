"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { NavUser } from '@/components/ui/nav-user';
import { Session } from '@supabase/supabase-js';
import createClient from '@/utils/supabase/client'

const AuthButton = () => {
    const supabase = createClient();

    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const updateProfileImage = async (userId: string, avatarUrl: string) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ picture: avatarUrl })
                .eq('id', userId);

            if (error) {
                console.error('Error updating profile image:', error);
                setError('Failed to update profile image.');
            }
        } catch (error) {
            console.error('Error in updateProfileImage:', error);
            setError('An unexpected error occurred.');
        }
    };

    useEffect(() => {
        const getSession = async () => {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);

                if (session?.user) {
                    const avatarUrl = session.user.user_metadata?.avatar_url;
                    if (avatarUrl) {
                        await updateProfileImage(session.user.id, avatarUrl);
                    }
                }
            } catch (error) {
                console.error('Error fetching session:', error);
                setError('Failed to fetch session.');
            } finally {
                setLoading(false);
            }
        };

        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setSession(session);

            if (session?.user) {
                const avatarUrl = session.user.user_metadata?.avatar_url;
                if (avatarUrl) {
                    updateProfileImage(session.user.id, avatarUrl);
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleAuth = async () => {
        setLoading(true);
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'discord',
            });
        } catch (error) {
            console.error('Error during authentication:', error);
            setError('Authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    const user = session?.user;
    const userName = user?.user_metadata?.full_name || 'User';
    const userEmail = user?.email || '';
    const userImage = user?.user_metadata?.avatar_url || undefined;

    return (
        <div className="flex items-center justify-center">
            {user ? (
                <NavUser email={userEmail} name={userName} userImage={userImage} />
            ) : (
                <Button onClick={handleAuth}>
                    <p>Login</p>
                    <img
                        src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
                        alt="Discord Logo"
                        className="w-5"></img>
                </Button>
            )}
        </div>
    );
};

export default AuthButton;



