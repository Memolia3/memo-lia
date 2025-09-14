export interface GenreData {
  id: string;
  userId: string;
  categoryId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GenreFolderProps {
  genre: GenreData;
  onClick: (genre: GenreData) => void;
  onDelete?: (genreId: string) => void;
  className?: string;
}

export interface GenreGridProps {
  genres: GenreData[];
  onGenreClick: (genre: GenreData) => void;
  onGenreDelete?: (genreId: string) => void;
  className?: string;
}
