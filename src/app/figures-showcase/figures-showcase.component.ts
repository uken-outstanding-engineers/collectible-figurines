import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatIconModule } from '@angular/material/icon';

import { FigureService, Figure } from './figure.service';
import { FandomService } from '../fandoms/fandom.service';

interface FunkoNode {
  name: string;
  checked?: boolean; 
  children?: FunkoNode[]; 
}

interface FunkoFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  checked?: boolean;
}

@Component({
  selector: 'app-figures-showcase',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatButtonModule, 
    MatCardModule, 
    MatTreeModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatIconModule
  ],
  templateUrl: './figures-showcase.component.html',
  styleUrl: './figures-showcase.component.scss'
})
export class FiguresShowcaseComponent implements OnInit {
  
  private _transformer = (node: FunkoNode, level: number): FunkoFlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      checked: node.checked
    };
  };

  treeControl = new FlatTreeControl<FunkoFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<FunkoNode, FunkoFlatNode>(
    (node: FunkoNode, level: number): FunkoFlatNode => ({
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      checked: node.checked
    }),
    node => node.level,
    node => node.expandable,
    node => node.children,
  );
  

  dataFilters = new MatTreeFlatDataSource<FunkoNode, FunkoFlatNode>(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: FunkoFlatNode) => node.expandable;

  figures: Figure[] = [];
  filteredFigures: Figure[] = [];
  paginatedFigures: Figure[] = [];
  hoverTimeouts: { [key: string]: any } = {};

  fandoms: any[] = []; 
  selectedFandom: string | null = null; 

  /* Pagination variables */
  currentPage = 0;
  pageSize = 5;
  totalPages = 1;
  pages: number[] = [];

  private TREE_DATA: FunkoNode[] = [
    {
      name: 'WARIANTY',
      children: [
        { name: 'Exclusive', checked: false },
        { name: 'Chase', checked: false },
        { name: 'Glow in Dark', checked: false },
        { name: 'Flocked', checked: false },
        
      ],
    },
    {
      name: 'LICENCJA',
      children: [],
    },
  ];

  constructor(private figureService: FigureService, private fandomService: FandomService,) {
    //this.dataFilters.data = TREE_DATA;
  }

  ngOnInit(): void {
    this.loadTreeData();
    this.loadFigures();
    
    //Fandoms
    this.fandomService.getFandoms().subscribe(fandoms => {
      this.fandoms = fandoms; 
    });

    //Figures
    this.figureService.getFigures().subscribe(data => {
      this.figures = data;
      this.filterFigures();
    });
  }

  loadTreeData(): void {
    this.fandomService.getFandoms().subscribe(fandoms => {
      const licenseNode = this.TREE_DATA.find(node => node.name === 'LICENCJA');
      if (licenseNode) {
        licenseNode.children = fandoms.map(fandom => ({
          id: fandom.id, // dodaj id
          name: fandom.name,
          checked: false,
        }));
      }
      this.dataFilters.data = this.TREE_DATA;
    });
  }
  

  loadFigures(): void {
    this.figureService.getFigures().subscribe(data => {
      this.figures = data;
      this.filterFigures();
    });
  }
  
  paginate(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFigures = this.filteredFigures.slice(startIndex, endIndex);

    this.totalPages = Math.ceil(this.filteredFigures.length / this.pageSize);

    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);

    if (this.totalPages <= maxButtons) {
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
    } else {
      if (this.currentPage <= half) {
        this.pages = Array.from({ length: maxButtons }, (_, i) => i);
      } else if (this.currentPage >= this.totalPages - half) {
        this.pages = Array.from({ length: maxButtons }, (_, i) => this.totalPages - maxButtons + i);
      } else {
        this.pages = Array.from({ length: maxButtons }, (_, i) => this.currentPage - half + i);
      }
    }
  } 

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.paginate();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.paginate();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.paginate();
  }

  // onFandomChange(selectedFandom: string): void {
  //   this.selectedFandom = selectedFandom;
  //   console.log("Selected fandom:", this.selectedFandom); // Debug
  //   this.filterFigures(); // Uruchamiamy filtrowanie
  // }

  selectedFandoms: any[] = []; // Tablica wybranych fandomów

  onFandomChange(fandom: any): void {
    const index = this.selectedFandoms.indexOf(fandom);
    
    if (index === -1) {
      // Jeśli fandom nie jest w tablicy, dodaj go
      this.selectedFandoms.push(fandom);
    } else {
      // Jeśli już jest, usuń go
      this.selectedFandoms.splice(index, 1);
    }

    console.log("Selected fandoms:", this.selectedFandoms);
    this.filterFigures(); // Uruchamiamy filtrowanie
  }

  
  filterFigures(): void {
    const selectedFilters = this.treeControl.dataNodes
      .filter(node => node.checked)
      .map(node => node.name);
  
    const filteredData = this.figures.filter(figure => {
      const matchesFandom = this.selectedFandom
        ? figure.fandomId === this.fandoms.find(fandom => fandom.name === this.selectedFandom)?.id
        : true;
  
      const matchesFilters = selectedFilters.length > 0 ? (
        (selectedFilters.includes('Chase') && figure.chase) ||
        (selectedFilters.includes('Glow in Dark') && figure.glowInDark) ||
        (selectedFilters.includes('Flocked') && figure.flocked) ||
        (selectedFilters.includes('Exclusive') && figure.exclusive)
      ) : true;
  
      return matchesFandom && matchesFilters;
    });

    // console.log("Selected filters:", selectedFilters);
    // console.log("Selected fandom:", this.selectedFandom);
    // console.log("Fandoms:", this.fandoms);
    // console.log("Figures before filtering:", this.figures);
    // console.log("Filtered figures:", filteredData);

  
    this.filteredFigures = filteredData;
    this.currentPage = 0;
    this.paginate();
  }
  
  

  getFigureCount(node: FunkoFlatNode): number {
    if (node.name === 'Chase') {
      return this.figures.filter(figure => figure.chase).length;
    }
    if (node.name === 'Glow in Dark') {
      return this.figures.filter(figure => figure.glowInDark).length;
    }
    if (node.name === 'Flocked') {
      return this.figures.filter(figure => figure.flocked).length;
    }
    if (node.name === 'Exclusive') {
      return this.figures.filter(figure => figure.exclusive).length;
    }
    return 0; 
  }


  toggleActive(figure: Figure): void {
    figure.isActive = !figure.isActive;
  }

  /* Mouse over on figure picture */
  onMouseOver(figure: Figure, event: Event): void {
    const element = event.target as HTMLImageElement;
    this.hoverTimeouts[figure.name] = setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease-in-out';
      element.style.opacity = '0';
      setTimeout(() => {
        element.src = figure.hoverImageUrl;
        element.style.opacity = '1';
      }, 250);
    }, 250);
  }

  /* Mouse out on figure picture */
  onMouseOut(figure: Figure, event: Event): void {
    const element = event.target as HTMLImageElement;
    clearTimeout(this.hoverTimeouts[figure.name]);
    element.style.transition = 'opacity 0.5s ease-in-out';
    element.style.opacity = '0';
    setTimeout(() => {
      element.src = figure.imageUrl;
      element.style.opacity = '1';
    }, 250);
  }
 
  onCheckboxChange(node: FunkoFlatNode): void {
    node.checked = !node.checked;
    this.filterFigures();
  }
}
