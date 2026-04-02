import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent {
  activeTab = '0';
  // Track which tabs have been opened to enable lazy loading.
  // Tab 0 (AI chat) is active by default.
  activatedTabs = new Set<string>(['0']);

  onTabChange(value: string | number | undefined) {
    if (value != null) this.activatedTabs.add(String(value));
  }
}
