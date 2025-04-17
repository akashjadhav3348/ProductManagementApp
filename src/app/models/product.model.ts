

export interface Product {
  price: number;
  imageBase64: any;
  CategoryId: null;
  ProductId: number;
  Name: string;
  Price: number;
  Description: string;
  categoryId: number | null;  // ✅ Allow null
  Category: string;
  Stock: number;
  createdAt: string;
  imageData?: string;
  imageUrl?: string;
  ImageBase64: string;
  IsActive: boolean;
}
interface ProductResponse {
  totalCount: number;
  productsDto: Product[];
}
