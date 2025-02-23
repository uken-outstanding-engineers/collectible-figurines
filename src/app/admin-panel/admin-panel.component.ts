import { ChangeDetectionStrategy, Component, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

import { TranslateModule, TranslateService} from '@ngx-translate/core';
import { TranslationService } from '../services/translation.service';

interface InterfaceNode {
  name: string;
  children?: InterfaceNode[];
  icon?: string;
  route?: string;
}

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  icon?: string;
  route?: string;
}

// const TREE_DATA: InterfaceNode[] = [
//   {
//     name: 'Collectible Figurines',
//     children: [
//       { name: 'Figurines list', route: '/admin/figurines' }, 
//       { name: 'Fandoms list', route: '/admin/fandoms' }, 
//     ],
//     icon: 'smart_toy',
//   },
//   {
//     name: 'Users',
//     children: [
//       { name: 'Users list', route: '/admin/users' }, 
//     ],
//     icon: 'groups',
//   },
// ];

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatTreeModule,
    MatButtonModule,
    TranslateModule
],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent {
  translatedTexts: { [key: string]: string } = {};
  TREE_DATA: InterfaceNode[] = [];

  isSidenavOpened: boolean = true;
  screenWidth!: number;
  
  private _transformer = (node: InterfaceNode, level: number): ExampleFlatNode => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
      icon: node.icon,
      route: node.route,
    };
  };
  
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private translate: TranslateService
  ) {

    
    //this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
    this.loadTreeData()

    this.translate.onLangChange.subscribe(() => {
      this.translate.getTranslation(this.translate.currentLang).subscribe(translations => {
        this.loadTreeData();
      });
    });

    this.screenWidth = window.innerWidth;
    this.checkScreenSize();
  }

  loadTreeData(): void {
    this.translate.get('admin_panel.admin_menu').subscribe(translations => {
      const treeData: InterfaceNode[] = [
        {
          name: translations['collectibleFigurines'],
          children: [
            { name: translations['figurinesList'], route: '/admin/figurines' }, 
            { name: translations['fandomsList'], route: '/admin/fandoms' }, 
          ],
          icon: 'smart_toy',
        },
        {
          name: translations['users'],
          children: [
            { name: translations['usersList'], route: '/admin/users' }, 
          ],
          icon: 'groups',
        },
      ];

      // Przypisanie danych do dataSource
      this.dataSource.data = treeData;
    });
  }

  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }

    this.translationService.translations$.subscribe(translations => {
      this.translatedTexts = translations['admin_panel'] || {};
    });
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  /* Hide and open menu */
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {  
    this.screenWidth = (event.target as Window).innerWidth;  
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (this.screenWidth <= 1056) {
      this.isSidenavOpened = false; 
    } else {
      this.isSidenavOpened = true; 
    }
  }

  toggleSidenav(): void {
    this.isSidenavOpened = !this.isSidenavOpened;
  }
}
