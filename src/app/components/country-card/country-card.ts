import { Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Country, CountryLinks } from '../../models/country';

interface CardLink {
  id: keyof CountryLinks;
  title: string;
  url: string;
}

interface CardDetail {
  label: string;
  value: string;
}

@Component({
  imports: [DecimalPipe],
  selector: 'app-country-card',
  styleUrl: './country-card.scss',
  templateUrl: './country-card.html',
})
export class CountryCard {
  readonly country = input.required<Country>();
  readonly opened = output<void>();

  // Строки с пустым значением не попадают в карточку
  protected readonly details = computed<CardDetail[]>(() => {
    const country = this.country();
    const codes = [country.codes.alpha_2, country.codes.alpha_3].filter(Boolean);

    const details: CardDetail[] = [
      { label: 'Capital', value: country.capitals.map((capital) => capital.name).filter(Boolean).join(', ') },
      { label: 'Languages', value: country.languages.map((language) => language.name).join(', ') },
      { label: 'Calling code', value: country.calling_codes.filter(Boolean).map((code) => `+${code}`).join(', ') },
      { label: 'Code', value: codes.join(' / ') },
    ];
    return details.filter((detail) => detail.value);
  });

  // Порядок кнопок внизу карточки. Пустой url — ссылки у страны нет, кнопка неактивна
  protected readonly links = computed<CardLink[]>(() => {
    const links = this.country().links;
    return [
      { id: 'google_maps', title: 'Google Maps', url: links.google_maps },
      { id: 'official', title: 'Official website', url: links.official },
      { id: 'open_street_maps', title: 'OpenStreetMap', url: links.open_street_maps },
      { id: 'wikipedia', title: 'Wikipedia', url: links.wikipedia },
    ];
  });
}
