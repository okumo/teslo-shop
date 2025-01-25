export interface Product {
  id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  //TODO: type: ValidTypes;
  gender: "men" | "women" | "kid" | "unisex";
}

export interface CartProduct {
  id: string;
  title: string;
  quantity: number;
  slug: string;
  price: number;
  size: Size;
  image: string;
}

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";
export type ValidTypes = "shirts" | "pants" | "hoodies" | "hats";

export interface ProductImage {
  id: number;
  url: string;
}
