import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: number | '' = '';
  uniqueCategories: { categoryId: number; name: string }[] = [];
  isLoading: boolean = false;
  selectedProduct: any = {}; // Store product to edit
  selectedImageFile: File | null = null;

  constructor(private productService: ProductService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    console.log(this.filteredProducts);
    
  }


  // ✅ Load Categories (Fixed Mapping)
// ✅ Load Only Active Categories
loadCategories(): void {
  this.categoryService.getActiveCategories().subscribe({
    next: (data) => {
      console.log('✅ API Response:', data); // Debugging

      if (Array.isArray(data)) {
        this.uniqueCategories = data
          .filter(category => category.IsActive) // ✅ FIXED: Use `IsActive` (uppercase I)
          .map(category => ({
            categoryId: category.CategoryId, // ✅ Correct case
            name: category.Name              // ✅ Correct case
          }));

        console.log('✅ Parsed Categories:', this.uniqueCategories); // Debugging
      } else {
        console.error('❌ Unexpected API response format:', data);
        this.uniqueCategories = [];
      }
    },
    error: (error) => {
      console.error('❌ Error fetching active categories:', error);
      this.uniqueCategories = [];
    }
  });
}

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.products = data.map(product => ({
            ...product,
            categoryId: product.CategoryId ?? null, // ✅ Ensure categoryId is mapped properly
            Category: product.Category ?? 'Unknown', // ✅ Set default category name if null
            price: product.Price ?? 0,
            imageUrl: product.ImageBase64
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




  // ✅ Filter Products
  filterProducts(): void {
    const selectedCategoryId = this.selectedCategory ? Number(this.selectedCategory) : null;

    console.log("Selected Category ID:", selectedCategoryId); // 🔍 Debugging

    if (selectedCategoryId) {
      this.filteredProducts = this.products.filter(product => {
        console.log("Product Category ID:", product.categoryId); // 🔍 Debugging
        return product.categoryId === selectedCategoryId;
      });
    } else {
      this.filteredProducts = [...this.products]; // ✅ Show all products when no category is selected
    }
  }



  // ✅ Fix Category Name Lookup
  getCategoryName(categoryId: number | null): string {
    if (!categoryId) return 'Unknown';
    const category = this.uniqueCategories.find(cat => cat.categoryId === categoryId);
    return category ? category.name : 'Unknown';
  }



  // ✅ Replace Broken Image
  replaceWithFallback(event: any): void {
    event.target.src = 'assets/no-image.png';
  }

  openEditModal(product: any): void {
    this.selectedProduct = { ...product }; // Clone product object
    const modalElement = new (window as any).bootstrap.Modal(document.getElementById('editProductModal'));
    modalElement.show();
  }
  
  // ♻️ Update Product
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

  
  // ✅ Delete Product with Confirmation
  deleteProduct(id: any): void {
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id.ProductId).subscribe({
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
