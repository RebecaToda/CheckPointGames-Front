import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {theme === "light" ? (
        <Moon className="h-6 w-6" /> // Mudei de h-5 w-5 para h-6 w-6
      ) : (
        <Sun className="h-6 w-6" /> // Mudei de h-5 w-5 para h-6 w-6
      )}
    </Button>
  );
}
