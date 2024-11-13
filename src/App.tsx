import React, { useEffect, useState } from "react";

import { clearStorage, StorageItem, storageKey } from "@/utils/storage";
import {
  enableTheme,
  isOnWidgetEditorPage,
  removeCurrentTheme,
} from "@/utils/extension";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SettingsMenu from "@/components/settings";

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
          <div className="flex gap-3 items-center">
            <img
              src="logo.png"
              alt="Widget Editor Themes"
              width={32}
              height={32}
            />
            <span>Widget Editor Themes</span>
          </div>
        </CardTitle>
        <CardDescription className="mt-4 tracking-wide">
          Choose the best theme for you, to create the best Widgets
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="themes" className="block mb-3">
            Themes
          </Label>

          <Select value={theme} onValueChange={(value) => themeChange(value)}>
            <SelectTrigger id="themes">
              <SelectValue placeholder="Select a theme.." />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectItem value="dracula">Dracula</SelectItem>
              <SelectItem value="omni">Omni</SelectItem>
              <SelectItem value="omni-owl">Omni Owl</SelectItem>
            </SelectContent>
          </Select>

          {isOnWidgetPage ? (
            <div className="buttons__container">
              <div className="mr-auto">
                <SettingsMenu />
              </div>
              <Button variant="secondary" onClick={handleRevert}>
                Revert
              </Button>
              <Button variant="default" type="submit">
                Apply
              </Button>
            </div>
          ) : (
            <div className="buttons__container">
              <SettingsMenu />

              <TooltipProvider>
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <div className="mr-4">
                      <Button variant="secondary" disabled>
                        Revert
                      </Button>
                      <Button variant="default" disabled>
                        Apply
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    You need to be on the Widget Editor to apply a theme
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
