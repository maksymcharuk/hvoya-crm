import { PrimeNGConfig } from 'primeng/api';

import { Component, OnInit } from '@angular/core';

import * as uk from '../assets/translations/uk.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private config: PrimeNGConfig) {}

  ngOnInit() {
    const { primeng } = uk;

    this.config.setTranslation(primeng);
  }
}
