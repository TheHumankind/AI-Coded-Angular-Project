import { Component } from '@angular/core';
import { CountryBoard } from '../country-board/country-board';

@Component({
  imports: [CountryBoard],
  selector: 'app-content',
  styleUrl: './content.scss',
  templateUrl: './content.html',
})
export class Content {}
