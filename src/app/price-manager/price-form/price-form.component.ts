import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CheckModel } from '../models/check-model';
import { CheckAnswer } from '../models/check-answer';
import { PriceService } from '../services/price.service';
import { SnackbarService } from 'src/app/common/services/snackbar/snackbar.service';
import { MatInput } from '@angular/material/input';

interface Store {
  id: string,
  type: string,
  name: string,
}
const ELEMENT_DATA: Store[] = [
  { id: '8', type: '3', name: 'Долгиновский'},
  { id: '11', type: '4', name: 'Брест'},
  { id: '18', type: '6', name: 'Партизанский'},
  { id: '21', type: '7', name: 'Тимирязева'},
  { id: '22', type: '8', name: 'Каменогорская'},
  { id: '23', type: '9', name: 'Никифорово'},
  { id: '24', type: '10', name: 'Независимости'},
  { id: '25', type: '11', name: 'Молодечно'},
  { id: '27', type: '13', name: 'ДанаМолл'},
  { id: '28', type: '14', name: 'Боровая'},
  { id: '30', type: '16', name: 'Галерея'},
  { id: '31', type: '17', name: 'Щомыслицы'},
  { id: '32', type: '18', name: 'Жуково'},
];

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
  product: CheckAnswer = new CheckAnswer('', '', '', '', '', '', false, '', '');

  selectedStore: string;
  stores: Array<Store> = ELEMENT_DATA;
  isBtSearchActive = false;

  @ViewChild("inputSearch") inputSearch: MatInput;

  messageNoConnect = 'Нет соединения, попробуйте позже.';
  action = 'Ok';
  styleNoConnect = 'red-snackbar';

  constructor(
    private priceService: PriceService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.selectedStore = localStorage.getItem('selectedStore');
  }

  ngAfterViewInit() {
    this.inputSearch.focus();
  }

  onInputSearchData($event: string) {
    this.searchString = $event;
    if($event.length >= 6) this.isBtSearchActive = true;
    else this.isBtSearchActive = false;
  }

  onChange(event) {
    localStorage.setItem('selectedStore', this.selectedStore);
  }
  
  onSearchOrder() {
    if(this.selectedStore) {
      if(this.searchString.length >= 6) {    
        if(this.searchString.length > 7)
          this.barcode = this.searchString;
        if(this.searchString.length === 6 || this.searchString.length === 7)
          this.article = this.searchString; 
        this.priceService.getProduct(new CheckModel(this.token, this.article, this.barcode, this.selectedStore)).subscribe(response => {
          if(response.status === 'not action')
            this.snackbarService.openSnackBar('Данного артикула или штрихкода нет.', this.action, this.styleNoConnect); 
          else if(response.status === 'not found')
              this.snackbarService.openSnackBar('На данный товар акции нет.', this.action, this.styleNoConnect); 
            else this.product = response;
        }, 
        error => { 
          console.log(error);
          this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
        }); 
      } 
    } else {
      this.snackbarService.openSnackBar('Выберите магазин', this.action);
    }
  }
}
