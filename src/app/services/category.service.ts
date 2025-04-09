import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://localhost:7103/api/Categories';

  constructor(private http: HttpClient) {}

  // ✅ Fetch All Categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ✅ Fetch Only Active Categories
  getActiveCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/active`);
  }

  addCategory(category: Category): Observable<any> {
    return this.http.post(this.apiUrl, category);
  }

  updateCategory(id: number, category: Category): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
