import { GenreData } from "../../types";

export interface GenreFolderProps {
  genre: GenreData;
  onDelete?: (genreId: string) => void;
  className?: string;
}
