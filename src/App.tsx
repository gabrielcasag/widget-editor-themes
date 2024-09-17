import React, { useState } from "react";

import { LoaderCircle } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingsMenu } from "@/components/settings";

import { disableTheme, enableTheme } from "@/utils/extension";

export const App: React.FC = () => {
  const [theme, setTheme] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function themeChange(t: string) {
    setTheme(t);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (theme) {
      setIsLoading(true);
      enableTheme(theme);
    }
    setIsLoading(false);
  }

  async function handleRevert(e: React.MouseEvent) {
    e.preventDefault();
    if (theme) disableTheme(theme);
    setTheme("");
  }

  return (
    <Card className="rounded-none">
      <CardHeader className="relative">
        <CardTitle className="text-lg">Widget Editor Themes</CardTitle>
        <CardDescription className="max-w-[80%]">
          Choose the best theme for you, to create the best Widgets
        </CardDescription>
        <SettingsMenu />
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="themes">Themes</Label>
            <Select value={theme} onValueChange={(value) => themeChange(value)}>
              <SelectTrigger id="themes">
                <SelectValue placeholder="Select a theme.." />
              </SelectTrigger>
              <SelectContent position="item-aligned" align="end">
                <SelectItem value="dracula">Dracula</SelectItem>
                <SelectItem value="omni">Omni</SelectItem>
                <SelectItem value="omni-owl">Omni Owl</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={handleRevert}>
              Revert
            </Button>
            <Button variant="default" type="submit" disabled={isLoading}>
              {isLoading && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Apply
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
