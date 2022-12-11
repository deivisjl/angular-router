import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';
import { catchError, retry, throwError, map, zip } from 'rxjs';

import { environment } from './../../environments/environment';
import { checkTime } from '../interceptors/time.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `https://young-sands-07814.herokuapp.com/api/products`;

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();

    if(limit && offset){
       params = params.set('limit',limit);
       params = params.set('offset',offset);
    }
    return this.http.get<Product[]>(this.apiUrl,{ params, context: checkTime() })
    .pipe(
      retry(3),
      map(products => products.map(item=>{
        return {
          ...item,
          taxes: .12 * item.price
        }
      }))
    );
  }

  getProduct(id: string){
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
    .pipe(
      catchError((error: HttpErrorResponse) =>{
        if(error.status === HttpStatusCode.Conflict){
          return throwError('El server falló');
        }
        if(error.status === HttpStatusCode.NotFound){
          return throwError('El producto no existe');
        }
        if(error.status === HttpStatusCode.Unauthorized){
          return throwError('No estas autorizado para este servicio');
        }
        return throwError('Algo salió mal');
      })
    );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO){
    return zip(
      this.getProduct(id),
      this.update(id, dto)
    ) //trasladar al componente
    .subscribe(response =>{
      const read = response[0];
      const update = response[1];
    })
  }
  getProductByPage(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.apiUrl}`,{
      params: {limit, offset}
    });
  }

  create(data: CreateProductDTO){
    return this.http.post<Product>(this.apiUrl,data);
  }

  update(id: string, dto: UpdateProductDTO){
    return this.http.put<Product>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: string){
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
