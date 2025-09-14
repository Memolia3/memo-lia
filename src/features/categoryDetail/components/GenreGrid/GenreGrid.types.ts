import { GenreData } from "../../types";

export interface GenreGridProps {
  genres: GenreData[];
  onGenreDelete?: (genreId: string) => void;
  className?: string;
}
