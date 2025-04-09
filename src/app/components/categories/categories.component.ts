import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'] // 
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  editMode = false;
  currentCategoryId: number | null = null; // 

  constructor(private fb: FormBuilder, private categoryService: CategoryService) {
    this.categoryForm = this.fb.group({
      Name: ['', Validators.required], // 
      IsActive: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data.map(category => ({
        ...category,
        IsActive: category.IsActive === true || category.IsActive === 'true' // 
      }));
    });
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) return;

    const categoryData: Category = {
      ...this.categoryForm.value,
      IsActive: !!this.categoryForm.value.IsActive // 
    };

    if (this.editMode && this.currentCategoryId !== null) {
      this.categoryService.updateCategory(this.currentCategoryId, categoryData).subscribe(() => {
        this.resetForm();
        this.loadCategories();
        Swal.fire('Success', 'Category updated successfully', 'success');
      });
    } else {
      this.categoryService.addCategory(categoryData).subscribe(() => {
        this.resetForm();
        this.loadCategories();
        Swal.fire('Success', 'Category added successfully', 'success');
      });
    }
  }

  editCategory(category: Category): void {
    this.editMode = true;
    this.currentCategoryId = category.CategoryId ?? null; // 
    this.categoryForm.patchValue(category);
  }

  deleteCategory(id?: number): void { 
    if (id === undefined) {
      console.error('Error: categoryId is undefined.');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(id).subscribe(() => {
          this.loadCategories();
          Swal.fire('Deleted!', 'Category has been deleted.', 'success');
        });
      }
    });
  }

  resetForm(): void {
    this.categoryForm.reset({ Name: '', IsActive: true });
    this.editMode = false;
    this.currentCategoryId = null;
  }
}

