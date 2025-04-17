import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-product',
  templateUrl: './all-product.component.html',
  styleUrls: ['./all-product.component.css']
})
export class AllProductComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: number | '' = '';
  uniqueCategories: { categoryId: number; name: string }[] = [];
  isLoading: boolean = false;
  selectedProduct: any = {};
  selectedImageFile: File | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }
  
  get startItemNumber(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }
  
  get endItemNumber(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.totalItems ? this.totalItems : end;
  }
  
  get totalItems(): number {
    return this.filteredProducts.length;
  }

  loadCategories(): void {
    this.categoryService.getActiveCategories().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.uniqueCategories = data
            .filter(category => category.IsActive)
            .map(category => ({
              categoryId: category.CategoryId,
              name: category.Name
            }));
        } else {
          this.uniqueCategories = [];
        }
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        this.uniqueCategories = [];
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        if (data && Array.isArray(data.productsDto)) {
          this.products = data.productsDto.map(product => ({
            ...product,
            categoryId: product.CategoryId ?? null,
            Category: product.Category ?? 'Unknown',
            price: product.Price ?? 0,
            imageUrl: product.ImageBase64  // 🟢 FIXED CASE HERE
              ? `data:image/jpeg;base64,${product.ImageBase64}`
              : 'assets/no-image.png'
          }));
          
          this.filteredProducts = [...this.products];
          console.log(this.filteredProducts);
        } else {
          console.error('Unexpected API response format:', data);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    });

  }

  filterProducts(): void {
    const selectedCategoryId = this.selectedCategory ? Number(this.selectedCategory) : null;
    if (selectedCategoryId) {
      this.filteredProducts = this.products.filter(product => product.categoryId === selectedCategoryId);
    } else {
      this.filteredProducts = [...this.products];
    }
    this.currentPage = 1; // Reset page to first on filter change
  }

  replaceWithFallback(event: any): void {
    event.target.src = 'assets/no-image.png';
  }

  openEditModal(product: any): void {
    this.selectedProduct = { ...product };
    const modalElement = new (window as any).bootstrap.Modal(document.getElementById('editProductModal'));
    modalElement.show();
  }

  updateProduct(): void {
    const formData = new FormData();
    formData.append('ProductId', this.selectedProduct.ProductId.toString());
    formData.append('Name', this.selectedProduct.Name);
    formData.append('Price', this.selectedProduct.Price.toString());
    formData.append('Description', this.selectedProduct.Description);
    formData.append('Stock', this.selectedProduct.Stock.toString());
    formData.append('CategoryId', this.selectedProduct.CategoryId.toString());
    if (this.selectedImageFile) {
      formData.append('ImageFile', this.selectedImageFile);
    }

    this.productService.updateProduct(this.selectedProduct.ProductId, formData).subscribe({
      next: () => {
        this.loadProducts();
        Swal.fire('Updated!', 'Product updated successfully!', 'success');
        const modalElement = document.getElementById('editProductModal');
        if (modalElement) (window as any).bootstrap.Modal.getInstance(modalElement)?.hide();
      },
      error: (err) => {
        console.error('Error updating product:', err);
        Swal.fire('Error!', 'Failed to update product.', 'error');
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedImageFile = event.target.files[0];
  }

  deleteProduct(product: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(product.ProductId).subscribe({
          next: () => {
            this.loadProducts();
            Swal.fire('Deleted!', 'The product has been deleted.', 'success');
          },
          error: (error) => {
            console.error('Error deleting product:', error);
          }
        });
      }
    });
  }
}
