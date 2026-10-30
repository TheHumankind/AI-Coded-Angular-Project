import { afterNextRender, Component, computed, ElementRef, inject, Injector } from '@angular/core';
import { CountryStore } from '../../services/country-store';
import { Button } from '../button/button';

@Component({
  imports: [Button],
  selector: 'app-country-pagination',
  styleUrl: './country-pagination.scss',
  templateUrl: './country-pagination.html',
})
export class CountryPagination {
  protected readonly store = inject(CountryStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  protected readonly pages = computed(() =>
    Array.from({ length: this.store.totalPages() }, (_, i) => i + 1),
  );

  /**
   * Переключает страницу и держит пагинацию на том же месте экрана: высота списка
   * меняется (например, на последней странице карточек меньше), и без компенсации
   * кнопки уехали бы из-под курсора.
   */
  protected goTo(page: number): void {
    const top = this.host.nativeElement.getBoundingClientRect().top;
    this.store.setPage(page);
    afterNextRender(
      () => {
        window.scrollBy(0, this.host.nativeElement.getBoundingClientRect().top - top);
      },
      { injector: this.injector },
    );
  }
}
