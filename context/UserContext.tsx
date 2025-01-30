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
    fetchUserProfile();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
      } else {
        fetchUserProfile();
      }
    });

    return () => {
      subscription.subscription?.unsubscribe();
    };
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
