import { Component } from '@angular/core';
import { PoliciesService } from '@shared/services/policies.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private policiesService: PoliciesService) { }

  ngOnInit() {
    this.policiesService.updateAbility();
  }
}
