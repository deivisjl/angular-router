import { Component } from '@angular/core';

import { Product } from './models/product.model';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  imgParent = '';
  showImg = true;
  token = '';
  imgRta = '';

  constructor(
    private AuthService: AuthService,
    private UsersService: UsersService,
    private fileService: FilesService
  ){}
  onLoaded(img: string) {
    console.log('log padre', img);
  }

  toggleImg() {
    this.showImg = !this.showImg;
  }

  createUser(){
    this.UsersService.create({
      name: 'Sebas',
      email: 'sebas2@gmail.com',
      password:'12345'
    })
    .subscribe(rta =>{
      console.log(rta)
    });
  }

  login(){
    this.AuthService.login('sebas2@gmail.com','12345')
    .subscribe(rta =>{
      this.token = rta.access_token;
      console.log(rta)
    });
  }

  getProfile(){
    console.log(this.token)
    this.AuthService.profile()
    .subscribe(profile =>{
      console.log(profile)
    });
  }
  downloadPDF()
  {
    this.fileService.getFile("my.pdf",'https://www.demo_app/pdf','application/pdf')
      .subscribe()
  }

  onUpload(event: Event){
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);
    if(file) {
      this.fileService.uploadFile(file)
        .subscribe(rta =>{
          this.imgRta = rta.location;
        })
    }
  }
}
