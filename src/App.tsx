import React, { useEffect, useState } from "react";

import { clearStorage, StorageItem, storageKey } from "@/utils/storage";
import {
  enableTheme,
  getCurrentTab,
  isOnWidgetEditorPage,
  removeCurrentTheme,
} from "@/utils/extension";
import { hasHostPermission, requestHostPermission } from "@/utils/permissions";

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
import { ApplyButton } from "./components/apply-button";

export const App: React.FC = () => {
  const [theme, setTheme] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isOnWidgetPage, setIsOnWidgetPage] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(true);

  function themeChange(t: string) {
    setTheme(t);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setStatus("loading");

      if (theme) {
        enableTheme(theme);
        setTimeout(() => {
          setStatus("success");
        }, 300);
      }

      setTimeout(() => {
        setStatus("idle");
      }, 1200);
    } catch (error) {
      setStatus("idle");
      console.error("Error submitting form:", error);
    }
  }

  async function handleRevert(e: React.MouseEvent) {
    e.preventDefault();
    await removeCurrentTheme();
    await clearStorage();
    setTheme("");
  }

  async function handleGrantAccess(e: React.MouseEvent) {
    e.preventDefault();

    const tab = await getCurrentTab();
    const granted = await requestHostPermission(tab.url);

    setHasPermission(granted);

    // O background reaplica o tema em todas as abas ao receber a permissão,
    // mas a aba atual já está aberta e o usuário espera ver o efeito agora.
    if (granted && theme) enableTheme(theme);
  }

  useEffect(() => {
    isOnWidgetEditorPage().then((isOnWidgetPage) => {
      setIsOnWidgetPage(isOnWidgetPage);
    });

    getCurrentTab().then((tab) =>
      hasHostPermission(tab.url).then(setHasPermission)
    );

    chrome.storage.local.get(storageKey).then((storage: Record<string, unknown>) => {
      const currentTheme: StorageItem = storage[storageKey] as StorageItem;
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
              <SelectItem value="aura-dark">Aura Dark</SelectItem>
              <SelectItem value="aura-dark-soft">Aura Dark Soft</SelectItem>
              <SelectItem value="catppuccin-frappe">Catppuccin Frappe</SelectItem>
              <SelectItem value="catppuccin-latte">Catppuccin Latte</SelectItem>
              <SelectItem value="catppuccin-mocha">Catppuccin Mocha</SelectItem>
              <SelectItem value="catppuccin-macchiato">Catppuccin Macchiato</SelectItem>
              <SelectItem value="dracula">Dracula</SelectItem>
              <SelectItem value="omni">Omni</SelectItem>
              <SelectItem value="omni-owl">Omni Owl</SelectItem>
            </SelectContent>
          </Select>

          {isOnWidgetPage && !hasPermission && (
            <div className="mt-4 rounded-md border border-border bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground mb-3">
                This instance runs on a custom domain. Allow access to it so the
                theme is re-applied automatically on new and duplicated tabs.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleGrantAccess}
              >
                Allow on this site
              </Button>
            </div>
          )}

          {isOnWidgetPage ? (
            <div className="buttons__container">
              <div className="mr-auto">
                <SettingsMenu />
              </div>
              <Button variant="secondary" onClick={handleRevert}>
                Revert
              </Button>
              <ApplyButton status={status} />
            </div>
          ) : (
            <div className="buttons__container">
              <div className="mr-auto">
                <SettingsMenu />
              </div>

              <TooltipProvider>
                <Tooltip delayDuration={500}>
                  <TooltipTrigger asChild>
                    <div className="flex gap-2">
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
