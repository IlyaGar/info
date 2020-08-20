import { Component, OnInit, Input } from '@angular/core';
import { ProductPropAnswer } from '../../models/product-prop-answer';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() data: ProductPropAnswer;
  splitElement = '; ';
  productPropAnswer: ProductPropAnswer = new ProductPropAnswer('', '', '', '', '', '', '', '');
  listPlaces: Array<string> = [];
  listDelivers: Array<string> = [];

  displayedColumnsPlaces = ['place', 'bt'];
  displayedColumnsDelivers = ['delivers'];

  constructor() { }

  ngOnInit(): void {
    this.productPropAnswer = this.data;
  }

  openPlaceForm(element) {

  }

  openStoragePlacesDialog(element) {

  }
}
