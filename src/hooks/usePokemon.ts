import { fetchPokemon, fetchPokemonList } from "@/lib/api";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const POKEMON_PAGE_SIZE = 20;

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: ["pokemon-list", POKEMON_PAGE_SIZE],
    queryFn: ({ pageParam }) => fetchPokemonList(POKEMON_PAGE_SIZE, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.next ? allPages.length * POKEMON_PAGE_SIZE : undefined,
  });
}

export function usePokemon(nameOrId: string) {
  return useQuery({
    queryKey: ["pokemon", nameOrId],
    queryFn: () => fetchPokemon(nameOrId),
    enabled: Boolean(nameOrId),
  });
}
