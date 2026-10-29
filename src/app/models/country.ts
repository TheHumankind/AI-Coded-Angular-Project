export interface Country {
  names: {
    common: string;
  };
  codes: {
    alpha_2: string;
  };
  region: string;
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
