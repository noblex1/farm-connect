import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

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
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
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
