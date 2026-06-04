import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/Layout";
import { PokemonListPage } from "@/pages/PokemonListPage";
import { PokemonDetailsPage } from "@/pages/PokemonDetailsPage";
import { FavoritesPage } from "@/pages/FavoritesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <PokemonListPage /> },
      { path: "pokemon/:name", element: <PokemonDetailsPage /> },
      { path: "favorites", element: <FavoritesPage /> },
    ],
  },
]);
