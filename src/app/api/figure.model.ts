export interface Figure {
  id: number | null; 
  name: string; 
  series: string; 
  imageUrl: string; 
  hoverImageUrl: string;
  fandomId?: number;
  chase?: boolean; 
  glowInDark?: boolean; 
  flocked?: boolean; 
  exclusive?: boolean;
  isLiked?: boolean;
}