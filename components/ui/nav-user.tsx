import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";

interface iAppProps {
    email: string;
    name: string;
    userImage: string | undefined;
  }
  
  export function NavUser({ email, name, userImage }: iAppProps) {
    
    // Sign out function
    async function signOut() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Error during sign out:', error);
        } else {
          // Manually reset session to null after successful sign-out
          window.location.href = '/'; // Redirect to homepage or any other page after logout
        }
      } catch (error) {
        console.error('Error during sign-out:', error);
      }
    }
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userImage} alt="User Image" />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs leading-none text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {/* You can add additional menu items here */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild onClick={signOut}>
            <p>Log out</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  
