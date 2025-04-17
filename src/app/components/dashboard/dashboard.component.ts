import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  isLoading = false;
  totalCount: number = 0;
  itemsPerPage: number = 5; // or any number you want per page
  currentPage: number = 1;

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;

    this.productService.getAllProducts().subscribe({
      next: (data: { productsDto: any[] }) => {
        console.log('Raw API Response:', data);

        if (data && Array.isArray(data.productsDto)) {
          this.products = data.productsDto.map(product => ({
            ...product,
            categoryId: product.CategoryId ?? null,
            Category: product.Category ?? 'Unknown',
            price: product.Price ?? 0,
            imageUrl: product.ImageBase64
              ? `data:image/jpeg;base64,${product.ImageBase64}`
              : 'assets/no-image.png'
          }));

          this.filteredProducts = [...this.products];
          this.totalCount = this.products.length;

          console.log('Processed Products:', this.filteredProducts);
        } else {
          console.error('Unexpected API response format:', data);
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
        this.isLoading = false;
      }
    });
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
