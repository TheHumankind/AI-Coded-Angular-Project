import { Component, computed, inject } from '@angular/core';
import { Country, CountryMemberships } from '../../models/country';
import { CountryStore } from '../../services/country-store';
import { Button } from '../button/button';
import { RequestStatus } from '../request-status/request-status';

/** value === null — данных нет, в шаблоне показываем «Invalid» */
interface InfoRow {
  label: string;
  value: string | null;
}

interface MembershipRow {
  label: string;
  member: boolean;
}

const MEMBERSHIPS: { key: keyof CountryMemberships; label: string }[] = [
  { key: 'un', label: 'United Nations' },
  { key: 'eu', label: 'European Union' },
  { key: 'eurozone', label: 'Eurozone' },
  { key: 'schengen', label: 'Schengen Area' },
  { key: 'nato', label: 'NATO' },
  { key: 'oecd', label: 'OECD' },
  { key: 'opec', label: 'OPEC' },
  { key: 'g7', label: 'G7' },
  { key: 'g20', label: 'G20' },
  { key: 'brics', label: 'BRICS' },
  { key: 'asean', label: 'ASEAN' },
  { key: 'african_union', label: 'African Union' },
  { key: 'arab_league', label: 'Arab League' },
  { key: 'commonwealth', label: 'Commonwealth' },
];

const numberFormat = new Intl.NumberFormat('en-US');

// Пустая строка / пустой список → null
function text(value: string | null | undefined): string | null {
  return value?.trim() || null;
}

function list(items: (string | null | undefined)[]): string | null {
  return text(items.filter(Boolean).join(', '));
}

function number(value: number | null | undefined, unit = ''): string | null {
  return typeof value === 'number' && Number.isFinite(value)
    ? numberFormat.format(value) + unit
    : null;
}

// Экономика в данных — только коэффициент Джини по годам; берём последний год
function economy(country: Country): string | null {
  const [latest] = Object.entries(country.economy.gini_coefficient).sort(
    ([a], [b]) => Number(b) - Number(a),
  );
  return latest ? `Gini coefficient ${latest[1]} (${latest[0]})` : null;
}

@Component({
  imports: [Button, RequestStatus],
  selector: 'app-country-overview',
  styleUrl: './country-overview.scss',
  templateUrl: './country-overview.html',
})
export class CountryOverview {
  protected readonly store = inject(CountryStore);

  // Флаг берём из карточки, на которую нажали: он есть сразу, до загрузки полных данных
  protected readonly flagUrl = computed(() => text(this.store.openedCountry()?.flag.url_svg));

  protected readonly description = computed(() => text(this.store.details()?.descriptions.long));

  protected readonly info = computed<InfoRow[]>(() => {
    const country = this.store.details();
    if (!country) {
      return [];
    }
    return [
      { label: 'Population', value: number(country.population) },
      { label: 'Area', value: number(country.area.kilometers, ' km²') },
      { label: 'Capital', value: list(country.capitals.map((capital) => capital.name)) },
      { label: 'Time zones', value: list(country.timezones) },
      {
        label: 'Currency',
        value: list(
          country.currencies.map(
            (currency) =>
              `${currency.name} (${[currency.code, currency.symbol].filter(Boolean).join(', ')})`,
          ),
        ),
      },
      {
        label: 'Calling code',
        value: list(country.calling_codes.filter(Boolean).map((code) => `+${code}`)),
      },
      { label: 'Continent', value: list(country.continents) },
      { label: 'Subregion', value: text(country.subregion) },
      { label: 'Economy', value: economy(country) },
    ];
  });

  protected readonly memberships = computed<MembershipRow[]>(() => {
    const country = this.store.details();
    if (!country) {
      return [];
    }
    return MEMBERSHIPS.map(({ key, label }) => ({ label, member: country.memberships[key] }));
  });
}
