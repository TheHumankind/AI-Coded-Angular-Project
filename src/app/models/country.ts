// Полная модель страны из REST Countries API v5.
// Структура выведена по всем 254 записям API: поля присутствуют у всех стран.

/** Название в паре «короткое / официальное» */
export interface CountryNameVariant {
  common: string;
  official: string;
}

export interface CountryNames {
  common: string;
  official: string;
  alternates: string[];
  /** Ключ — код языка (ISO 639-3), например "sqi" */
  native: Record<string, CountryNameVariant>;
  /** Ключ — код языка (ISO 639-3), например "rus" */
  translations: Record<string, CountryNameVariant>;
}

export interface CountryCodes {
  alpha_2: string;
  alpha_3: string;
  ccn3: string;
  cioc: string;
  fifa: string;
  fips: string;
  gec: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CountryCapital {
  name: string;
  coordinates: Coordinates;
  attributes: {
    administrative: boolean;
    constitutional: boolean;
    executive: boolean;
    judicial: boolean;
    legislative: boolean;
    primary: boolean;
  };
}

export interface CountryFlag {
  emoji: string;
  html_entity: string;
  unicode: string;
  url_png: string;
  url_svg: string;
  description: string;
  colors: {
    dominant: string;
    prominent: string;
    palette: { hex: string; proportion: number }[];
    swatches: {
      dark_muted: string | null;
      dark_vibrant: string | null;
      light_muted: string | null;
      light_vibrant: string | null;
      muted: string | null;
      vibrant: string | null;
    };
  };
}

export interface CountryArea {
  kilometers: number;
  miles: number;
}

export interface CountryCars {
  driving_side: 'left' | 'right';
  signs: string[];
}

export interface CountryClassification {
  dependency: boolean;
  /** Пустая строка, если территория не зависимая */
  dependency_type: string;
  disputed: boolean;
  iso_status: string;
  sovereign: boolean;
  un_member: boolean;
  un_observer: boolean;
}

export interface CountryCurrency {
  code: string;
  name: string;
  symbol: string;
}

export interface DayOfYear {
  day: number;
  month: number;
}

export interface CountryDate {
  academic_year_start: DayOfYear;
  fiscal_year_start: {
    corporate: DayOfYear & { basis: string };
    government: DayOfYear;
    personal: DayOfYear;
  };
  start_of_week: string;
}

export interface CountryDemonym {
  f: string;
  m: string;
}

export interface CountryDescriptions {
  short: string;
  long: string;
}

export interface CountryEconomy {
  /** Ключ — год, например "2020" */
  gini_coefficient: Record<string, number>;
}

export interface CountryLanguage {
  name: string;
  native_name: string;
  bcp47: string;
  iso639_1: string;
  iso639_2b: string;
  iso639_2t: string;
  iso639_3: string;
}

/** На бесплатном тарифе вместо данных приходит сообщение о платном доступе */
export interface CountryLeader {
  message: string;
  sample: string;
}

export interface CountryLinks {
  google_maps: string;
  official: string;
  open_street_maps: string;
  wikipedia: string;
}

export interface CountryMemberships {
  african_union: boolean;
  arab_league: boolean;
  asean: boolean;
  brics: boolean;
  commonwealth: boolean;
  eu: boolean;
  eurozone: boolean;
  g20: boolean;
  g7: boolean;
  nato: boolean;
  oecd: boolean;
  opec: boolean;
  schengen: boolean;
  un: boolean;
}

export interface CountryNumberFormat {
  decimal_separator: string;
  thousands_separator: string;
}

/** Пустые строки, если у территории нет «родительской» страны */
export interface CountryParent {
  alpha_2: string;
  alpha_3: string;
}

export interface CountryPostalCode {
  format: string;
  regex: string;
}

export interface CountryUnits {
  measurement_system: string;
  temperature_scale: string;
}

export interface Country {
  uuid: string;
  names: CountryNames;
  codes: CountryCodes;
  flag: CountryFlag;
  capitals: CountryCapital[];
  region: string;
  subregion: string;
  continents: string[];
  coordinates: Coordinates;
  area: CountryArea;
  population: number;
  landlocked: boolean;
  borders: string[];
  languages: CountryLanguage[];
  currencies: CountryCurrency[];
  /** Ключ — код языка, например "eng" */
  demonyms: Record<string, CountryDemonym>;
  descriptions: CountryDescriptions;
  government_type: string;
  classification: CountryClassification;
  memberships: CountryMemberships;
  parent: CountryParent;
  economy: CountryEconomy;
  leaders: CountryLeader[];
  calling_codes: string[];
  timezones: string[];
  tlds: string[];
  cars: CountryCars;
  date: CountryDate;
  number_format: CountryNumberFormat;
  postal_code: CountryPostalCode;
  units: CountryUnits;
  links: CountryLinks;
  /** Всегда пустой массив в текущих данных API */
  assets: unknown[];
}

export interface CountriesResponse {
  data: {
    objects: Country[];
    meta: {
      total: number;
      count: number;
      limit: number;
      offset: number;
      more: boolean;
    };
  };
}
