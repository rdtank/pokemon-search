import { Link } from "react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPokemonNumber, getOfficialArtwork } from "@/lib/api";
import { useFavorites } from "@/lib/favorites";

interface PokemonCardProps {
  name: string;
  id: number;
}

export function PokemonCard({ name, id }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(name);

  return (
    <div className="group relative rounded-xl border bg-card p-4 shadow-sm transition-colors hover:border-primary/40 hover:bg-accent/40">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 size-8"
        aria-label={favorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        aria-pressed={favorite}
        onClick={() => toggleFavorite(name)}
      >
        <Heart
          className={cn(
            "size-5 transition-colors",
            favorite ? "fill-red-500 text-red-500" : "text-muted-foreground",
          )}
        />
      </Button>

      <Link
        to={`/pokemon/${name}`}
        className="flex flex-col items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <img
          src={getOfficialArtwork(id)}
          alt={name}
          loading="lazy"
          className="size-28 object-contain transition-transform group-hover:scale-105"
        />
        <span className="text-xs font-medium text-muted-foreground">
          {formatPokemonNumber(id)}
        </span>
        <span className="text-base font-semibold capitalize">{name}</span>
      </Link>
    </div>
  );
}
