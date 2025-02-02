"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface UserProfile {
    id: string;
    username: string;
    balance: number;
    stocks: Record<string, number>;
    picture: string;
    networth: number;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  fetchUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile from Supabase
  const fetchUserProfile = async () => {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;

    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
    } else {
      setUser(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchUserProfile();
    
      const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          setUser(null);
        } else {
          fetchUserProfile();
        }
      });

      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
    
      const channel = supabase
        .channel("user-profile-updates")
        .on("postgres_changes", 
            {
                event: "UPDATE",
                schema: "public",
                table: "profiles",
                filter: `id=eq.${session?.user?.id}`,
            },
            (payload) => {
              setUser(payload.new as UserProfile);
              console.log("Updated:", payload.new);
            }
        )
        .subscribe();
    
      return () => {
        subscription.subscription?.unsubscribe();
        supabase.removeChannel(channel);
      };
    };

    initialize();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
