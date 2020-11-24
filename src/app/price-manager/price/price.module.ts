import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PriceRoutingModule } from './price-routing.module';
import { PriceFormComponent } from '../price-form/price-form.component';
import { AngularMaterialModule } from 'src/app/common/models/material-module';


@NgModule({
  declarations: [
    PriceFormComponent,
  ],
  imports: [
    CommonModule,
    PriceRoutingModule,
    AngularMaterialModule,
  ],
  exports: [AngularMaterialModule],
})
export class PriceModule { }
