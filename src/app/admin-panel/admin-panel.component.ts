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

import { TranslateModule} from '@ngx-translate/core';

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

const TREE_DATA: InterfaceNode[] = [
  {
    name: 'Collectible Figurines',
    children: [
      { name: 'Figurines list', route: '/admin/figurines' }, 
      { name: 'Variants list', route: '/admin/variants' }, 
    ],
    icon: 'smart_toy',
  },
  {
    name: 'Users',
    children: [
      { name: 'Users list', route: '/admin/users' }, 
    ],
    icon: 'groups',
  },
];

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
  //@ViewChild('sidenav') sidenav!: MatSidenav;
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

  constructor(private router: Router) {
    this.dataSource.data = TREE_DATA;
    //this.translatedText = this.translate.instant('collectible_figures');
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.checkScreenSize();
  }

  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
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
