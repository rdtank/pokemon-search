import { useQueries } from "@tanstack/react-query";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { PokemonCard } from "@/components/PokemonCard";
import { useFavorites } from "@/lib/favorites";
import { fetchPokemon } from "@/lib/api";

export function FavoritesPage() {
  const { favorites } = useFavorites();

  const results = useQueries({
    queries: favorites.map((name) => ({
      queryKey: ["pokemon", name],
      queryFn: () => fetchPokemon(name),
    })),
  });

  if (favorites.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Favorites</h1>
        <div className="rounded-xl border border-dashed bg-card p-10 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t saved any Pokémon yet.
          </p>
          <Button asChild className="mt-4">
            <Link to="/">Browse the Pokédex</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Favorites</h1>
        <p className="text-sm text-muted-foreground">
          {favorites.length} saved Pokémon.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {results.map((result, index) => {
          const name = favorites[index];

          if (result.data) {
            return (
              <PokemonCard key={name} name={name} id={result.data.id} />
            );
          }

          return (
            <div
              key={name}
              className="flex h-48 items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground"
            >
              {result.isError ? "Failed to load" : "Loading…"}
            </div>
          );
        })}
      </div>
    </div>
  );
}
