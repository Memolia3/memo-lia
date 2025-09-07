import { GenreData } from "../../types";

export interface GenreFolderProps {
  genre: GenreData;
  onClick: (genre: GenreData) => void;
  onDelete?: (genreId: string) => void;
  className?: string;
}
