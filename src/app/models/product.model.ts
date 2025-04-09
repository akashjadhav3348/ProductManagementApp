

export interface Product {
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
