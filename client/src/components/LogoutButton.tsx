import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

type LogoutButtonProps = {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "farm" | "harvest";
  size?: "default" | "sm" | "lg" | "icon" | "touch";
  className?: string;
  showIcon?: boolean;
};

export const LogoutButton = ({ 
  variant = "outline", 
  size = "default", 
  className = "",
  showIcon = true 
}: LogoutButtonProps) => {
  const handleLogout = () => {
    toast({
      title: "Logging out...",
      description: "You have been successfully logged out.",
    });
    
    // Small delay to show the toast before redirect
    setTimeout(() => {
      logout();
    }, 500);
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant={variant} 
      size={size}
      className={className}
    >
      {showIcon && <LogOut className="size-5" />}
      Logout
    </Button>
  );
};
