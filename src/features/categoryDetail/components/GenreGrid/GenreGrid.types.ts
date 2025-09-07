import { GenreData } from "../../types";

export interface GenreGridProps {
  genres: GenreData[];
  onGenreClick: (genre: GenreData) => void;
  onGenreDelete?: (genreId: string) => void;
  className?: string;
}
