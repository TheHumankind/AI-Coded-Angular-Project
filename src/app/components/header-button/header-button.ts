import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-header-button',
  styleUrl: './header-button.scss',
  templateUrl: './header-button.html',
})
export class HeaderButton {
  readonly label = input.required<string>();
  readonly pressed = output<void>();
}
