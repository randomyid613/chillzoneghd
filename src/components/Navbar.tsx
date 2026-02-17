import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/chillzone-logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Contact", path: "/contact" },
  { label: "Donate", path: "/donate" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-glass">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="ChillZone" className="h-12 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`font-heading text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                location.pathname === item.path ? "text-primary" : "text-foreground/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.charityextra.com/charity/chillzone"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-primary px-5 py-2 font-heading text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Donate Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-glass border-t border-border px-6 pb-6 pt-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className="block py-3 font-heading text-sm font-medium text-foreground/70 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.charityextra.com/charity/chillzone"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block rounded-full bg-primary px-5 py-2 text-center font-heading text-sm font-semibold text-primary-foreground"
          >
            Donate Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
