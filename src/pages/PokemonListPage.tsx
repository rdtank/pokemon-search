import { PokemonCard } from "@/components/PokemonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { usePokemon, usePokemonList } from "@/hooks/usePokemon";
import { getPokemonId } from "@/lib/api";
import { useMemo, useState } from "react";

export function PokemonListPage() {
  const [search, setSearch] = useState("");
  const trimmedSearch = search.trim();
  const showingSearch = trimmedSearch.length > 0;

  const debouncedSearch = useDebounce(trimmedSearch.toLowerCase(), 300);
  const searchQuery = usePokemon(debouncedSearch);
  const isDebouncing =
    showingSearch && trimmedSearch.toLowerCase() !== debouncedSearch;
  const searchPending = isDebouncing || searchQuery.isLoading;

  const {
    data,
    isPending,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = usePokemonList();

  const allPokemon = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Pokédex</h1>
        <p className="text-sm text-muted-foreground">
          Browse Pokémon 20 at a time, or search by exact name. Tap a card for
          details, or the heart to save a favorite.
        </p>
      </div>

      <Input
        placeholder="Search Pokémon by name (e.g. pikachu)…"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className="max-w-sm"
      />

      {showingSearch ? (
        <SearchResults
          term={debouncedSearch}
          pending={searchPending}
          isError={searchQuery.isError}
          pokemon={searchQuery.data}
        />
      ) : (
        <>
          {isPending && (
            <p className="text-muted-foreground">Loading Pokémon…</p>
          )}

          {isError && (
            <p className="text-destructive">{(error as Error).message}</p>
          )}

          {!isPending && !isError && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {allPokemon.map((pokemon) => (
                <PokemonCard
                  key={pokemon.name}
                  name={pokemon.name}
                  id={getPokemonId(pokemon.url)}
                />
              ))}
            </div>
          )}

          {!isPending && !isError && hasNextPage && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface SearchResultsProps {
  term: string;
  pending: boolean;
  isError: boolean;
  pokemon: { id: number; name: string } | undefined;
}

function SearchResults({
  term,
  pending,
  isError,
  pokemon,
}: SearchResultsProps) {
  if (pending) {
    return <p className="text-muted-foreground">Searching…</p>;
  }

  if (isError || !pokemon) {
    return (
      <p className="text-muted-foreground">
        No Pokémon found for “{term}”. Try an exact name like “pikachu”.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <PokemonCard name={pokemon.name} id={pokemon.id} />
    </div>
  );
}
