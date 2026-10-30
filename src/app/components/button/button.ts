import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button',
  styleUrl: './button.scss',
  templateUrl: './button.html',
})
export class Button {
  readonly label = input.required<string>();
  readonly active = input(false);
  readonly disabled = input(false);
  readonly pressed = output<void>();
}
