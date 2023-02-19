import { PrimeNGConfig } from 'primeng/api';

import { Component, OnInit } from '@angular/core';

import { PoliciesService } from '@shared/services/policies.service';

import * as uk from '../assets/translations/uk.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private policiesService: PoliciesService,
    private config: PrimeNGConfig,
  ) {}

  ngOnInit() {
    this.policiesService.updateAbility();
    const { primeng } = uk;

    this.config.setTranslation(primeng);
  }
}
