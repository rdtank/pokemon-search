import { Link, useParams } from "react-router";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePokemon } from "@/hooks/usePokemon";
import { useFavorites } from "@/lib/favorites";
import {
  formatPokemonNumber,
  getOfficialArtwork,
  type Pokemon,
} from "@/lib/api";

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

const MAX_STAT = 255;

export function PokemonDetailsPage() {
  const { name = "" } = useParams();
  const { data: pokemon, isPending, isError, error } = usePokemon(name);
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1">
        <Link to="/">
          <ArrowLeft className="size-4" />
          Back to Pokédex
        </Link>
      </Button>

      {isPending && <p className="text-muted-foreground">Loading Pokémon…</p>}

      {isError && (
        <p className="text-destructive">{(error as Error).message}</p>
      )}

      {pokemon && (
        <PokemonDetails
          pokemon={pokemon}
          favorite={isFavorite(pokemon.name)}
          onToggleFavorite={() => toggleFavorite(pokemon.name)}
        />
      )}
    </div>
  );
}

interface PokemonDetailsProps {
  pokemon: Pokemon;
  favorite: boolean;
  onToggleFavorite: () => void;
}

function PokemonDetails({
  pokemon,
  favorite,
  onToggleFavorite,
}: PokemonDetailsProps) {
  const artwork =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    getOfficialArtwork(pokemon.id);

  return (
    <div className="grid gap-8 md:grid-cols-[280px_1fr]">
      <div className="flex flex-col items-center gap-4 rounded-xl border bg-card p-6">
        <img
          src={artwork}
          alt={pokemon.name}
          className="size-48 object-contain"
        />
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {formatPokemonNumber(pokemon.id)}
          </p>
          <h1 className="text-2xl font-bold capitalize">{pokemon.name}</h1>
        </div>
        <Button
          variant={favorite ? "default" : "outline"}
          className="w-full gap-2"
          aria-pressed={favorite}
          onClick={onToggleFavorite}
        >
          <Heart className={cn("size-4", favorite && "fill-current")} />
          {favorite ? "Favorited" : "Add to favorites"}
        </Button>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Types
          </h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className="rounded-full bg-secondary px-3 py-1 text-sm font-medium capitalize text-secondary-foreground"
              >
                {type.name}
              </span>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Detail label="Height" value={`${pokemon.height / 10} m`} />
          <Detail label="Weight" value={`${pokemon.weight / 10} kg`} />
          <Detail label="Base XP" value={String(pokemon.base_experience)} />
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Abilities
          </h2>
          <div className="flex flex-wrap gap-2">
            {pokemon.abilities.map(({ ability, is_hidden }) => (
              <span
                key={ability.name}
                className="rounded-full border px-3 py-1 text-sm capitalize"
              >
                {ability.name}
                {is_hidden && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (hidden)
                  </span>
                )}
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Base stats
          </h2>
          <div className="space-y-2">
            {pokemon.stats.map((stat) => (
              <div key={stat.stat.name} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-sm text-muted-foreground">
                  {STAT_LABELS[stat.stat.name] ?? stat.stat.name}
                </span>
                <span className="w-8 shrink-0 text-right text-sm font-medium tabular-nums">
                  {stat.base_stat}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(100, (stat.base_stat / MAX_STAT) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}
