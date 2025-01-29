import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AdminPanelFigurinesListComponent } from "../admin-panel-figurines-list/admin-panel-figurines-list.component";
import { AdminPanelUsersComponent } from "../admin-panel-users/admin-panel-users.component";

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
],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
})
export class AdminPanelComponent {
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
  }

  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
