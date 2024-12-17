import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { TokenService } from './core/services/identity/services/token.service';

@NgModule({
  imports: [
    BrowserModule
  ],
  providers: [
    TokenService
  ]
})
export class AppModule { }