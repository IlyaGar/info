import { Component, OnInit } from '@angular/core';
import { CheckModel } from '../models/check-model';
import { CheckAnswer } from '../models/check-answer';
import { PriceService } from '../services/price.service';
import { SnackbarService } from 'src/app/common/services/snackbar/snackbar.service';

@Component({
  selector: 'app-price-form',
  templateUrl: './price-form.component.html',
  styleUrls: ['./price-form.component.scss']
})
export class PriceFormComponent implements OnInit {

  token = 'kaktus';
  searchString: string = '';
  article: string = '';
  barcode: string = '';
  searchData: CheckModel = new CheckModel('', '', '', '');
  product: CheckAnswer = new CheckAnswer('', '', '', '', '', '', '', '');

  messageNoConnect = 'Нет соединения, попробуйте позже.';
  action = 'Ok';
  styleNoConnect = 'red-snackbar';

  constructor(
    private priceService: PriceService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
  }

  onInputSearchData($event) {
    this.searchString = $event;
  }

  onSearchOrder() {
    if(this.searchString.length === 13)
      this.barcode = this.searchString;
    if(this.searchString.length === 7)
      this.article = this.searchString; 
    this.priceService.getProduct(new CheckModel(this.token, this.article, this.barcode, '')).subscribe(response => {
      this.product = response;
    }, 
    error => { 
      console.log(error);
      this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
    });
  }

  onClearNumOrder() {
  }
}
