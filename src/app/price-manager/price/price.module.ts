import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceRoutingModule } from './price-routing.module';
import { PriceFormComponent } from '../price-form/price-form.component';
import { AngularMaterialModule } from 'src/app/common/models/material-module';
import { FormsModule } from '@angular/forms';
import { MathStrPipe } from 'src/app/pipes/math-str.pipe';
import { UrlImgPipe } from 'src/app/pipes/url-img.pipe';


@NgModule({
  declarations: [
    MathStrPipe,
    UrlImgPipe,
    PriceFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    PriceRoutingModule,
    AngularMaterialModule,
  ],
  exports: [AngularMaterialModule],
})
export class PriceModule { }
