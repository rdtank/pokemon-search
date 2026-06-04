import { cn } from "@/lib/utils";
import { Link, NavLink, Outlet } from "react-router";

const navItems = [
  { to: "/", label: "Pokédex", end: true },
  { to: "/favorites", label: "Favorites", end: false },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
          <Link to="/" className="mr-4 text-lg font-bold">
            ⚡ Pokémon Search
          </Link>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
