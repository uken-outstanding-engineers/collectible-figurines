export interface Figure {
  id: number | null; 
  name: string; 
  series: string; 
  imageUrl: string; 
  hoverImageUrl: string;
  number: number | null;
  fandomId?: number;
  chase?: boolean; 
  glowInDark?: boolean; 
  flocked?: boolean; 
  exclusive?: boolean;
  isLiked?: boolean;
  isWanted?: boolean;
  isOwned?: boolean;
  [key: string]: any;
}