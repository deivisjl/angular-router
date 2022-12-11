import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `https://young-sands-07814.herokuapp.com/api/categories`;

  constructor(
    private http: HttpClient
  ) { }

  getAll(limit?:number, offset?:number){
    let params = new HttpParams();
    if(limit && offset != null){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Category[]>(`${this.apiUrl}`,{ params })
  }


}
