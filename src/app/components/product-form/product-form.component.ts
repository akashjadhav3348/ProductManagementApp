import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: { categoryId: number; name: string }[] = [];
  imageByteArray: number[] = [];
  isLoadingCategories: boolean = true;
  uniqueCategories: { categoryId: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(1)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      categoryId: [{ value: '', disabled: true }, Validators.required],
      isActive: [true],
      imageData: [[]] // Store image as byte array
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  

  loadCategories(): void {
    this.categoryService.getActiveCategories().subscribe({
      next: (data) => {
        console.log('✅ API Response:', data);
  
        if (Array.isArray(data)) {
          this.uniqueCategories = data
            .filter(category => category.IsActive)
            .map(category => ({
              categoryId: category.CategoryId, // Ensure correct casing
              name: category.Name
            }));
  
          console.log('✅ Parsed Categories:', this.uniqueCategories);
  
          // ✅ Enable dropdown when categories are loaded
          this.productForm.get('categoryId')?.enable();  
        } else {
          console.error('❌ Unexpected API response format:', data);
          this.uniqueCategories = [];
        }
      },
      error: (error) => {
        console.error('❌ Error fetching categories:', error);
        this.uniqueCategories = [];
      }
    });
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);
        this.imageByteArray = Array.from(byteArray);
        console.log('✅ Image converted to byte array:', this.imageByteArray.length, 'bytes');
      };
    }
  }

   // ✅ Fix Category Name Lookup
   getCategoryName(categoryId: number | null): string {
    if (!categoryId) return 'Unknown';
    const category = this.uniqueCategories.find(cat => cat.categoryId === categoryId);
    return category ? category.name : 'Unknown';
  }

  onSubmit() {
    if (this.productForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields', 'error');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', this.productForm.value.price);
    formData.append('stock', this.productForm.value.stock);
    formData.append('categoryId', this.productForm.value.categoryId);
    formData.append('isActive', this.productForm.value.isActive);
  
    if (this.imageByteArray.length > 0) {
      const blob = new Blob([new Uint8Array(this.imageByteArray)], { type: 'image/jpeg' });
      formData.append('image', blob, 'product.jpg'); // ✅ Attach image as a file
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(`${environment.apiUrl}/api/Products`, formData).subscribe(
          () => {
            Swal.fire('Success', 'Product added successfully!', 'success');
            this.productForm.reset();
          },
          (error) => {
            console.error('❌ Product Add Error:', error);
            Swal.fire('Error', 'Failed to add product', 'error');
          }
        );
      }
    });
  }
  
  
}
