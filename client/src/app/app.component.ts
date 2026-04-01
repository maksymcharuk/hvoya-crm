import { PrimeNG } from 'primeng/config';

import { Component, OnInit } from '@angular/core';

import * as uk from '../assets/translations/uk.json';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private config: PrimeNG) {}

  ngOnInit() {
    const { primeng } = uk;

    this.config.setTranslation(primeng);
  }
}
