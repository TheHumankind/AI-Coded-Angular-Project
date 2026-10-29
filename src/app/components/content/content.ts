import { Component, inject } from '@angular/core';
import { CountryStore } from '../../services/country-store';
import { CountryBoard } from '../country-board/country-board';

@Component({
  imports: [CountryBoard],
  selector: 'app-content',
  styleUrl: './content.scss',
  templateUrl: './content.html',
})
export class Content {
  protected readonly store = inject(CountryStore);
}
