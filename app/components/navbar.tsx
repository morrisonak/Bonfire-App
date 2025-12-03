import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import type { AgencyData } from "~/lib/types";

interface NavbarProps {
  selectedAgency?: AgencyData;
}

export function Navbar({ selectedAgency }: NavbarProps) {
  return (
    <header className="w-full border-b bg-white shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4">
        <div className="text-xl font-bold tracking-tight text-primary">
          The Hot List
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm">
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
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
