export interface PromCategory {
  $: {
    id: string;
    parentId?: string;
  };
  _: string;
}

export interface PromOfferParam {
  $: {
    name: string;
    unit?: string;
  };
  _: string;
}

export interface PromOffer {
  $: {
    id: string;
    available: string;
  };
  url: string[]; // string
  price: string[]; // number
  currencyId: string[]; // string
  categoryId: string[]; // number
  picture: string[]; // string[]
  pickup: string[]; // boolean
  delivery: string[]; // boolean
  name: string[]; // string
  name_ua: string[]; // string
  vendor: string[]; // string
  vendorCode: string[]; // string (SKU)
  country_of_origin: string[]; // string
  description: string[]; // string
  description_ua: string[]; // string
  sales_notes: string[]; // string
  param: PromOfferParam[];
}

export interface PromProducts {
  yml_catalog: {
    $: {
      date: string;
    };
    shop: Array<{
      name: string[];
      company: string[];
      url: string[];
      currencies: Array<{
        currency: Array<{
          $: {
            id: string;
            rate: string;
          };
        }>;
      }>;
      categories: Array<{
        category: PromCategory[];
      }>;
      offers: Array<{
        offer: PromOffer[];
      }>;
    }>;
  };
}
