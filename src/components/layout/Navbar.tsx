import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ApiBaseDialog } from "@/components/settings/ApiBaseDialog";

export const Navbar = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const linkCls = (p: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${pathname === p ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`;

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold">Stock Weaver</Link>
          <div className="hidden md:flex items-center gap-1">
            <Link to="/dashboard" className={linkCls("/dashboard")}>Dashboard</Link>
            <Link to="/stores" className={linkCls("/stores")}>Stores</Link>
            <Link to="/stock" className={linkCls("/stock")}>Stock</Link>
            <Link to="/compare" className={linkCls("/compare")}>Compare</Link>
            <Link to="/profile" className={linkCls("/profile")}>Profile</Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setOpen(true)}>Settings</Button>
          <Link to="/login"><Button variant="secondary">Login</Button></Link>
        </div>
      </nav>
      <ApiBaseDialog open={open} onOpenChange={setOpen} />
    </header>
  );
};
