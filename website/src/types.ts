export interface Instrument {
  id: string;
  title: string;
  tags: string[];
  productType: string;
  variants: unknown;
  images: Array<{ node: { url: string; altText: string | null } }>;
  specs: Record<string, any>;
  handle: string;
  createdAt: string;
  updatedAt: string;
}

export type Specs = Record<string, string[]>;
