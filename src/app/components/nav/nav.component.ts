import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/services/categories.service';

import { StoreService } from '../../services/store.service'

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  activeMenu = false;
  counter = 0;
  categories: Category[] = [];

  constructor(
    private storeService: StoreService,
    private categoriesService: CategoryService
  ) { }

  ngOnInit(): void {
    this.storeService.myCart$.subscribe(products => {
      this.counter = products.length;
    });
    this.getAllCategories();
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  getAllCategories(){
    this.categoriesService.getAll()
    .subscribe(data=>{
      this.categories = data;
    });
  }
}
