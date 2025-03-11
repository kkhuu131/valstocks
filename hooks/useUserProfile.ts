import { useQuery, useQueryClient } from "@tanstack/react-query";
import createClient from "@/utils/supabase/client";
import { useEffect } from "react";

export function useUserProfile() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, isError} = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      // Fetch the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        return null;
      };

      // Fetch user profile from public.profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      console.log("profile", profile);
      return profile;
    },
    staleTime: 1000 * 60 * 5,
    
  });

  useEffect(() => {
    if (profile) {
      const profileSubscription = supabase
        .channel(`realtime:public:profiles=eq.${profile.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${profile.id}`,
          },
          (payload) => {
            console.log('Profile updated', payload);
          // Refetch the profile data to keep it updated
            queryClient.invalidateQueries({queryKey: ["userProfile"]});
          }
        )
        .subscribe();

      // Cleanup subscription on unmount or when the profile changes
      return () => {
        profileSubscription.unsubscribe();
      };
    }
  }, [profile, queryClient, supabase]);

  return { profile, isLoading, isError };
};