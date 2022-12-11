import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';
import { switchMap, zip } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChoosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id: '',
      name: '',
    },
    description: ''
  };

  limit = 10;
  offset = 0;

  statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getProductByPage(10,0)
    .subscribe(data => {
      this.products = data;
      this.offset += this.limit;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }
  onShowDetail(id: string){
    this.statusDetail = 'loading'
    this.productsService.getProduct(id)
    .subscribe(data=>{
      this.toggleProductDetail();
      this.productChoosen = data;
      this.statusDetail = 'success';
    },errMsg=>{
      window.alert(errMsg);
      this.statusDetail = 'error';
    })
  }
  readAndUpdate(id: string)
  {
    //Ejecucion secuencial
    this.productsService.getProduct(id)
    .pipe(
      switchMap((product)=>{
        return this.productsService.update(product.id, {title: 'change'})
      })
    )
    .subscribe(data=>{
      console.log(data)
    })
    //Ejecutar en paralelo
    zip(
      this.productsService.getProduct(id),
      this.productsService.update(id, {title:'nuevo'})
    )
    .subscribe(response =>{
      const read = response[0];
      const update = response[1];
    })
  }
  createNewProduct(){
    const product: CreateProductDTO = {
      title:'Nuevo producto',
      description: 'Desc de nuevo producto',
      images: ['https://placeimg.com/640/480/any'],
      price: 1000,
      categoryId: 2,

    };
    this.productsService.create(product)
      .subscribe(data =>{
        this.products.unshift(data);
      });
  }

  updateProduct(){
    const changes: UpdateProductDTO = {
      title:'new title'
    }
    const id = this.productChoosen.id;
    this.productsService.update(id, changes)
    .subscribe(data=>{
      const productIndex = this.products.findIndex(item => item.id === this.productChoosen.id);
      this.products[productIndex] = data;
    });
  }

  deleteProduct(){
    const id = this.productChoosen.id;
    this.productsService.delete(id)
    .subscribe(()=>{
      const productIndex = this.products.findIndex(item => item.id === this.productChoosen.id);
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });
  }

  loadMore(){
    this.productsService.getProductByPage(this.limit, this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
      this.offset += this.limit;
    })
  }
}
