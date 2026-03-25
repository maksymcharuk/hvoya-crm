import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent {
  // Track which tabs have been opened to enable lazy loading.
  // Tab 0 (AI chat) is active by default.
  activatedTabs = new Set<number>([0]);

  onTabChange(event: { index: number }) {
    this.activatedTabs.add(event.index);
  }
}
