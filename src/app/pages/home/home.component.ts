import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  limit = 10;
  offset = 0;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.productsService.getProductByPage(10,0)
    .subscribe(data => {
      this.products = data;
      this.offset += this.limit;
    });
  }

}
