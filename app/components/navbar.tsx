import { Download, Menu, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import type { AgencyData } from "~/lib/types";
import { useDarkMode } from "~/lib/use-dark-mode";
import { exportAllToJSON } from "~/lib/export-utils";
import { authClient } from "~/lib/auth-client";

interface NavbarProps {
  selectedAgency?: AgencyData;
  allAgencies?: AgencyData[];
}

export function Navbar({ selectedAgency, allAgencies }: NavbarProps) {
  const { isDark, toggle } = useDarkMode();
  const { data: session } = authClient.useSession();

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
        <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          The Hot List
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center text-sm">
          <a
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
          >
            Home
          </a>

          {/* Auth */}
          {session?.user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => authClient.signOut()}
            >
              Sign out
            </Button>
          ) : (
            <a
              href="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              Sign in
            </a>
          )}
          {selectedAgency && (
            <a
              href={selectedAgency.baseUrl.replace("/opportunities/", "")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors font-medium"
            >
              {selectedAgency.name} Portal
            </a>
          )}

          {/* Export JSON Button */}
          {allAgencies && allAgencies.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportAllToJSON(allAgencies)}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
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
          {allAgencies && allAgencies.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => exportAllToJSON(allAgencies)}
              aria-label="Export to JSON"
            >
              <Download className="h-5 w-5" />
            </Button>
          )}
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
