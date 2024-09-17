import {
  HeartHandshake,
  Sun,
  Moon,
  SunMoon,
  Palette,
  Settings,
  Bug,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useTheme } from "@/hooks/useTheme";

export function SettingsMenu() {
  const { setTheme } = useTheme();

  const openLink = (url: string) => {
    window.open(url, "_blank");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="absolute right-6 top-6">
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            <span>Popup Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <SunMoon className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem onClick={() => openLink("https://github.com/gabrielcasag/widget-editor-themes")}>
          <GitHubLogoIcon className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openLink("https://github.com/gabrielcasag/widget-editor-themes/issues")}>
          <Bug className="mr-2 h-4 w-4" />
          <span>Report a bug</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openLink("https://github.com/sponsors/gabrielcasag")}>
          <HeartHandshake className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
