export interface Figure {
    id: number; 
    imageUrl: string; 
    hoverImageUrl?: string;
    series: string; 
    fandomId?: number;
    name: string; 
    chase?: boolean; 
    glowInDark?: boolean; 
    flocked?: boolean; 
    exclusive?: boolean;
    isActive?: boolean;
  }
  