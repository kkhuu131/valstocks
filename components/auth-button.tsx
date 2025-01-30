"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '../lib/supabase';
import { NavUser } from '@/components/ui/nav-user';

const AuthButton = () => {
    const [session, setSession] = useState<any>(null);

    useEffect(() => {
        const session = supabase.auth.getSession();
        setSession(session);

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const getURL = () => {
        let url =
          process.env.NEXT_PUBLIC_SITE_URL ??
          process.env.NEXT_PUBLIC_VERCEL_URL ??
          'http://localhost:3000';
        // Make sure to include `https://` when not localhost.
        url = url.includes('http') ? url : `https://${url}`;
        // Make sure to include a trailing `/`.
        url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
        return url;
    };

    const handleAuth = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'discord',
        });
    };

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

