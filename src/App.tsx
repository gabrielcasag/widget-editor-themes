import React, { useEffect, useState } from "react";

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

import {
  enableTheme,
  isOnWidgetEditorPage,
  removeCurrentTheme,
} from "@/utils/extension";
import { clearStorage, StorageItem, storageKey } from "@/utils/storage";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";

export const App: React.FC = () => {
  const [theme, setTheme] = useState<string>("");
  const [isOnWidgetPage, setIsOnWidgetPage] = useState<boolean>(false);

  function themeChange(t: string) {
    setTheme(t);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (theme) {
      enableTheme(theme);
    }
  }

  async function handleRevert(e: React.MouseEvent) {
    e.preventDefault();
    await removeCurrentTheme();
    await clearStorage();
    setTheme("");
  }

  useEffect(() => {
    isOnWidgetEditorPage().then((isOnWidgetPage) => {
      setIsOnWidgetPage(isOnWidgetPage);
    });

    chrome.storage.local.get(storageKey).then((storage) => {
      const currentTheme: StorageItem = storage[storageKey];
      if (currentTheme && currentTheme.active) {
        setTheme(currentTheme.name);
      }
    });
  }, []);

  return (
    <Card className="rounded-none">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <img
              src="logo.png"
              alt="Widget Editor Themes"
              width={32}
              height={32}
            />
            <span>Widget Editor Themes</span>
          </div>
          <SettingsMenu />
        </CardTitle>
        <CardDescription className="max-w-[80%] mt-3">
          Choose the best theme for you, to create the best Widgets
        </CardDescription>
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

          {isOnWidgetPage ? (
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="secondary" onClick={handleRevert}>
                Revert
              </Button>
              <Button variant="default" type="submit">
                Apply
              </Button>
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-end space-x-4 mt-6">
                    <Button variant="secondary" onClick={handleRevert} disabled>
                      Revert
                    </Button>
                    <Button variant="default" type="submit" disabled>
                      Apply
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  You need to be on the Widget Editor page to apply a theme
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
