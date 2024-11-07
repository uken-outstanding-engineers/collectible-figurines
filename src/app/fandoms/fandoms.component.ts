import { Component } from '@angular/core';
import { FandomService } from './fandom.service';
import { Fandom } from './fandom.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fandoms',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fandoms.component.html',
  styleUrl: './fandoms.component.scss'
})
export class FandomsComponent {
  fandoms: Fandom[] = [];
  filteredFandoms: Fandom[] = [];

  constructor(private fandomService: FandomService) {}

  ngOnInit(): void {
    this.fandomService.getFandoms().subscribe(data => {
      this.fandoms = data;
      this.filteredFandoms = data;
    });
  }
}
