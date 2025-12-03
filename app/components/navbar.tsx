import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import type { AgencyData } from "~/lib/types";
import { useDarkMode } from "~/lib/use-dark-mode";

interface NavbarProps {
  selectedAgency?: AgencyData;
}

export function Navbar({ selectedAgency }: NavbarProps) {
  const { isDark, toggle } = useDarkMode();

  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
        <div className="text-xl font-bold tracking-tight text-primary">
          The Hot List
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center text-sm">
          <a
            href="/"
            className="hover:text-primary transition-colors font-medium"
          >
            Home
          </a>
          {selectedAgency && (
            <a
              href={selectedAgency.baseUrl.replace("/opportunities/", "")}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors font-medium"
            >
              {selectedAgency.name} Portal
            </a>
          )}

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
