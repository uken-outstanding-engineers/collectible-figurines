export interface Figure {
  id: number; 
  name: string; 
  series: string; 
  imageUrl: string; 
  hoverImageUrl: string;
  fandomId?: number;
  chase?: boolean; 
  glowInDark?: boolean; 
  flocked?: boolean; 
  exclusive?: boolean;
  isActive?: boolean;
}
  