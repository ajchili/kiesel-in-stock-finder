export interface Instrument {
  id: string;
  title: string;
  tags: string[];
  productType: string;
  variants: Array<{
    node: {
      id: string;
      title: string;
      price: { amount: string };
      sku: string;
      availableForSale: boolean;
      compareAtPrice: { amount: string };
    };
  }>;
  images: Array<{ node: { url: string; altText: string | null } }>;
  specs: Record<string, any>;
  handle: string;
  createdAt: string;
  updatedAt: string;
}

export type Specs = Record<string, string[]>;
