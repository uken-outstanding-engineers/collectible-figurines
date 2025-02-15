import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef } from '@angular/core';

import { Figure } from '../api/figure.model';
import { FigureService } from '../api/figure.service';
import { FandomService } from '../api/fandom.service';
import { FigureListService } from '../api/figure-list.service';
import { UserService } from '../api/user.service';
import { Fandom } from '../api/fandom.model';
import { API_URL } from '../api/api-url';

interface FunkoNode {
  name: string;
  id?: number;
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
    MatIconModule,
    TranslateModule ,
    RouterModule
  ],
  templateUrl: './figures-showcase.component.html',
  styleUrl: './figures-showcase.component.scss'
})
export class FiguresShowcaseComponent implements OnInit {
  apiUrl = API_URL.BASE_URL;
  
  constructor(
    private figureService: FigureService, 
    private fandomService: FandomService,
    private figureListService: FigureListService,
    private userService: UserService,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.setTreeData();

    this.translate.onLangChange.subscribe(() => {
      this.setTreeData();
    });
  }

  private TREE_DATA: FunkoNode[] = [];

  
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

  setTreeData(): void {
    this.translate.get(['figures-showcase.variants', 'figures-showcase.license']).subscribe(translations => {
      const variantTranslation = translations['figures-showcase.variants'];
      const licenseTranslation = translations['figures-showcase.license'];

      this.TREE_DATA = [
        {
          name: variantTranslation,
          children: [
            { name: 'Exclusive', checked: this.selectedFilters.includes('Exclusive') },
            { name: 'Chase', checked: this.selectedFilters.includes('Chase') },
            { name: 'Glow in Dark', checked: this.selectedFilters.includes('Glow in Dark') },
            { name: 'Flocked', checked: this.selectedFilters.includes('Flocked') },
          ],
        },
        {
          name: licenseTranslation, 
          children: [],  
        },
      ];
        
      this.loadTreeData(licenseTranslation);  
      this.dataFilters.data = [...this.TREE_DATA]; 
    });
  }
  
  selectedFilters: string[] = [];

  figures: Figure[] = [];
  filteredFigures: Figure[] = [];
  paginatedFigures: Figure[] = [];
  hoverTimeouts: { [key: string]: any } = {};

  fandoms: Fandom[] = []; 
  selectedFandom: string | null = null; 

  listName: string = "";
  userId: number | null = null;

  likedFigures: number[] = []; 

  /* Pagination variables */
  currentPage = 0;
  pageSize = 8;
  totalPages = 1;
  pages: number[] = [];

  fandomId: number | undefined; 

  isMobile: boolean = window.innerWidth < 900;
  showFilters: boolean = false;

  ngOnInit(): void {
    // User
    this.userService.getLoggedInUser().subscribe(user => {
      if (user) {
        this.userId = user.id;
      }
    });

    //Fandoms
    this.fandomService.getFandoms().subscribe(fandoms => {
      this.fandoms = fandoms; 
    });

    //Figures
    this.figureService.getFigures().subscribe(data => {
      this.figures = data;
      this.filterFigures();
    });

    this.TREE_DATA = this.TREE_DATA; 

    this.route.queryParams.subscribe(params => {
      const fandomId = params['fandomId'];
      if (fandomId) {
        this.TREE_DATA.forEach(category => {
          category.children?.forEach(node => {
            if (node.id == fandomId) {
              this.onCheckboxChange(node);
            }
          });
        });
      }
    });

    this.loadFiguresProperty('isLiked', 'liked');
    this.loadFiguresProperty('isWanted', 'wanted');
    this.loadFiguresProperty('isOwned', 'owned');
  }

  loadTreeData(license: string): void {
    this.fandomService.getFandoms().subscribe(fandoms => {
      const licenseNode = this.TREE_DATA.find(node => node.name === license);
      if (licenseNode) {
        licenseNode.children = fandoms.map(fandom => ({
          id: fandom.id ?? 0,
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 900;
    if (!this.isMobile) {
      this.showFilters = false;  
    }
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
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

  selectedFandoms: any[] = []; 

  onFandomChange(fandom: any): void {
    const index = this.selectedFandoms.indexOf(fandom);
    this.filterFigures(); 
  }

  filterFigures(): void {
    const selectedFilters = this.selectedFilters; 
    
    const filteredData = this.figures.filter(figure => {
      const matchesFilters = selectedFilters.length > 0 ? (
        (selectedFilters.includes('Chase') && figure.chase) ||
        (selectedFilters.includes('Glow in Dark') && figure.glowInDark) ||
        (selectedFilters.includes('Flocked') && figure.flocked) ||
        (selectedFilters.includes('Exclusive') && figure.exclusive) ||
        (selectedFilters.some(filter => 
          this.fandoms.some(fandom => fandom.name === filter && fandom.id === figure.fandomId)
        ))
      ) : true;
      return matchesFilters;
    });
  
    this.filteredFigures = filteredData; 
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

    const selectedFandom = this.fandoms.find(fandom => fandom.name === node.name);

    if (selectedFandom) {
      return this.figures.filter(figure => figure.fandomId === selectedFandom.id).length;
    }

    return 0; 
  }

  toggleListActive(figure: Figure, listName: string): void {
    if (!this.userId) return;
  
    if (figure.id !== null) {
      this.figureListService.toggleFigurine(this.userId, figure.id, listName).subscribe(response => {
        listName = "is" + listName;
        if (figure.hasOwnProperty(listName)) {
          figure[listName] = !figure[listName];
        }
      });
    }
  }
  
  // toggleListActive(figure: Figure, listName: string): void {
  //   if (!this.userId) return;
  
  //   if (figure.id !== null) {
  //     this.figureListService.toggleFigurine(this.userId, figure.id, listName).subscribe(response => {
  //       // Dynamiczne przypisanie na podstawie listName
  //       if (figure.hasOwnProperty(listName)) {
  //         figure[listName] = !figure[listName];
  //       }
  //     });
  //   }
  // }
  

  loadFiguresProperty(property: string, listKey: string): void {
    if (!this.userId) return;
  
    this.figureListService.getUserFigurineLists(this.userId).subscribe(lists => {
      if (lists[listKey]) {
        const figureIds = lists[listKey].map(figurine => figurine.id).filter(id => id !== null) as number[];
  
        this.figures.forEach(figure => {
          if (figure.id !== null) {
            figure[property] = figureIds.includes(figure.id);
          }
        });
      }
    });
  }

  /* Mouse over on figure picture */
  onMouseOver(figure: Figure, event: Event): void {
    const element = event.target as HTMLImageElement;
    this.hoverTimeouts[figure.name] = setTimeout(() => {
      element.style.transition = 'opacity 0.5s ease-in-out';
      element.style.opacity = '0';
      setTimeout(() => {
        element.src = this.apiUrl + figure.hoverImageUrl;
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
      element.src = this.apiUrl + figure.imageUrl;
      element.style.opacity = '1';
    }, 250);
  }
 
  onCheckboxChange(node: any): void {
    node.checked = !node.checked;
  
    if (node.checked) {
      this.selectedFilters.push(node.name);
    } else {
      const index = this.selectedFilters.indexOf(node.name);
      if (index !== -1) {
        this.selectedFilters.splice(index, 1);
      }
    }
  
    this.currentPage = 0;
    this.filterFigures();
  }
}