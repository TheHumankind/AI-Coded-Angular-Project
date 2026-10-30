import { Component, input, output } from '@angular/core';
import { Button } from '../button/button';

/**
 * Состояние запроса: «Loading…», ошибка с кнопкой «Try again» или, если всё хорошо,
 * переданное содержимое.
 */
@Component({
  imports: [Button],
  selector: 'app-request-status',
  styleUrl: './request-status.scss',
  templateUrl: './request-status.html',
})
export class RequestStatus {
  readonly loading = input.required<boolean>();
  readonly error = input.required<boolean>();
  readonly errorMessage = input.required<string>();
  readonly retry = output<void>();
}
