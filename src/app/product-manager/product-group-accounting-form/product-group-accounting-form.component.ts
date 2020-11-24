import { Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { ProductService } from '../services/product.service';
import { DownList } from '../models/down-list';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { ProductQuery } from '../models/product-query';
import { ProductProp } from '../models/product-prop';
import { ProductPropAnswer } from '../models/product-prop-answer';
import { MatDialog } from '@angular/material/dialog';
import { PrintLableFormComponent } from '../dialog-windows/print-lable-form/print-lable-form.component';
import { StoragePlacesEditorComponent } from '../dialog-windows/storage-places-editor/storage-places-editor.component';
import { PlaceListFormComponent } from '../dialog-windows/place-list-form/place-list-form.component';
import { SnackbarService } from 'src/app/common/services/snackbar/snackbar.service';
import { AttentionFormComponent } from 'src/app/common/components/dialog-windows/attention-dialog/attention-form/attention-form.component';

interface PoductNode {
  id: string;
  name: string;
  children?: PoductNode[];
}

interface ExampleFlatNode {
  expandable: boolean;
  id: string;
  name: string;
  level: number;
}

@Component({
  selector: 'app-product-group-accounting-form',
  templateUrl: './product-group-accounting-form.component.html',
  styleUrls: ['./product-group-accounting-form.component.css']
})
export class ProductGroupAccountingFormComponent implements OnInit {

  group: string = '';
  selectedRowTree: string = '';
  selectedRow: Array<string> = [];
  searchValue: string = '';

  selectedSearchVar: string = 'article';
  selectedModeVar: string;

  hoveredIndex: any;
  valueModeVar: string;

  productPropAnswer: ProductPropAnswer = new ProductPropAnswer('', '', '', '', '', '', '', '');
  displayedColumnsProducts = ['article', 'name', 'status', 'barcode', 'balancestore', 'balancedefect', 'action'];
  displayedColumnsPlaces = ['place', 'bt'];
  displayedColumnsDelivers = ['delivers'];
  treeData: any;
  dataSourceProducts: Array<Array<string>> = [];
  tempDataSourceProducts: Array<Array<string>> = [];
  listPlaces: Array<string> = [];
  listDelivers: Array<string> = [];
  isEmptySearchValue = false;
  private nameCookie = environment.cookieName;
  countListProducts: number = 0;
  scrollPosition = 8000;
  curentPositionTable = 200;
  isLoading: any;
  
  messageNoConnect = 'Нет соединения, попробуйте позже.';
  action = 'Ok';
  styleNoConnect = 'red-snackbar';

  private _transformer = (node: PoductNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      id: node.id,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    public dialog: MatDialog,
    private cookieService: CookieService,
    private productService: ProductService,
    private snackbarService: SnackbarService,) { }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  
  ngOnInit() {
    this.productService.getList(new DownList(this.getToken(this.nameCookie))).subscribe(response => {
      this.checkResponseList(response); 
    }, 
    error => { 
      console.log(error);
      this.snackbarService.openSnackBar(this.messageNoConnect, this.action, this.styleNoConnect);
    });
  }

  checkResponseList(response) {
    if(response) {
      this.dataSource.data = response;
    }
  }

  onSelectNode(node) {
    this.clearProp();
    this.selectedRowTree = node.id;
    this.group = node.name.split(" ")[0];
    if(this.group) {
      this.dataSourceProducts = [];
      this.scrollPosition = 8000;
      this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), this.group, '', '', '', '', '', '')).subscribe(response => {
        this.checkResponseProduct(response); 
      }, 
      error => { 
        console.log(error);
      });
    }
  }

  checkResponseProduct(response) {
    if(response) {
      this.dataSourceProducts = this.dataSourceProducts.concat(response);
      this.countListProducts = this.dataSourceProducts.length;
    }
  }

  checkResponseProductSearch(response) {
    if(response) {
      this.dataSourceProducts = response;
      this.countListProducts = this.dataSourceProducts.length;

      let t = this.dataSourceProducts[0];
      this.onSelectRowClick(this.dataSourceProducts[0]);
    }
  }

  checkResponseProductProp(response: ProductPropAnswer) {
    if(response) {
      this.listPlaces = [];
      this.listDelivers = [];
      this.productPropAnswer = response;  
      if(this.productPropAnswer.places) {
        var splitPlace = this.productPropAnswer.places.split("; ");
        splitPlace.forEach(element => {
          this.listPlaces.push(element);
        }); 
      }
      if(this.productPropAnswer.delivers) {
        var splitDelivers = this.productPropAnswer.delivers.split("; ");
        splitDelivers.forEach(element => {
          this.listDelivers.push(element);
        });
      }
      if(this.listPlaces.length > 0)
        if(this.listPlaces[this.listPlaces.length - 1].length == 0)
          this.listPlaces.pop();
      if(this.listDelivers.length > 0)    
        if(this.listDelivers[this.listDelivers.length - 1].length == 0)
          this.listDelivers.pop();
    }
  }

  onSearch() {
    this.clearProp();
    if(this.searchValue) {
      this.scrollPosition = 8000;
      this.group = '';
      this.dataSourceProducts = [];
      console.log(this.searchValue);
      this.isEmptySearchValue = false;
      if(this.selectedSearchVar === 'article') {
        this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), '', this.searchValue, '', '', '', '', '')).subscribe(response => {
          this.checkResponseProductSearch(response); 
        }, 
        error => { 
          console.log(error);
        });
      }
      if(this.selectedSearchVar === 'name') {
        this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), '', '', this.searchValue, '', '', '', '')).subscribe(response => {
          this.checkResponseProductSearch(response); 
        }, 
        error => { 
          console.log(error);
        });
      }
      if(this.selectedSearchVar === 'barcode') {
        this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), '', '', '', this.searchValue, '', '', '')).subscribe(response => {
          this.checkResponseProductSearch(response); 
        }, 
        error => { 
          console.log(error);
        });
      }
      if(this.selectedSearchVar === 'storage') {
        this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), '', '', '', '', this.searchValue, '', '')).subscribe(response => {
          this.checkResponseProductSearch(response); 
        }, 
        error => { 
          console.log(error);
        });
      }
      if(this.selectedSearchVar === 'provider') {
        this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), '', '', '', '', '', this.searchValue, '')).subscribe(response => {
          this.checkResponseProductSearch(response); 
        }, 
        error => { 
          console.log(error);
        });
      }
    } else {
      this.isEmptySearchValue = true;
    }
  }

  onClear() {
    this.isEmptySearchValue = false;
    this.searchValue = '';
    this.selectedSearchVar = 'article';
  }

  onKeyuoSearchInput(event: KeyboardEvent) {
    if(event.keyCode == 13) {
      this.onSearch();
    } else {
      this.isEmptySearchValue = false;
    }
  }

  onSelectRowClick(row: Array<string>) {
    if(row[0]) {
      this.selectedRow = row;
      this.productService.getProductProp(new ProductProp(this.getToken(this.nameCookie), row[0])).subscribe(response => {
        this.checkResponseProductProp(response); 
      }, 
      error => { 
        console.log(error);
      });
    }
  }

  onAddInExcerpt(row: Array<string>) {
    row;
  }

  onScroll(event) {
    if(event.target.scrollTop > this.scrollPosition) {
      this.scrollPosition += 8000;
      var pos = this.countListProducts + 200;
      if(pos % 200 == 0) {
        if(this.group) {
          this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), this.group, '', '', '', '', '', pos.toString())).subscribe(response => {
            this.checkResponseProduct(response); 
          }, 
          error => { 
            console.log(error);
          });
        }
        if(this.selectedSearchVar === 'article') {
          this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), '', this.searchValue, '', '', '', '', pos.toString())).subscribe(response => {
            this.checkResponseProduct(response); 
          }, 
          error => { 
            console.log(error);
          });
        }
        if(this.selectedSearchVar === 'name') {
          this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), '', '', this.searchValue, '', '', '', pos.toString())).subscribe(response => {
            this.checkResponseProduct(response); 
          }, 
          error => { 
            console.log(error);
          });
        }
        if(this.selectedSearchVar === 'barcode') {
          this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), '', '', '', this.searchValue, '', '', pos.toString())).subscribe(response => {
            this.checkResponseProduct(response); 
          }, 
          error => { 
            console.log(error);
          });
        }
        if(this.selectedSearchVar === 'storage') {
          this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), '', '', '', '', this.searchValue, '', pos.toString())).subscribe(response => {
            this.checkResponseProduct(response); 
          }, 
          error => { 
            console.log(error);
          });
        }
        if(this.selectedSearchVar === 'provider') {
          this.productService.getProducts(new ProductQuery(this.getToken(this.nameCookie), '', '', '', '', '', this.searchValue, pos.toString())).subscribe(response => {
            this.checkResponseProduct(response); 
          }, 
          error => { 
            console.log(error);
          });
        }
      }
    }
  }

  openAttentionDialog(status: string) {
    const dialogRef = this.dialog.open(AttentionFormComponent, {
      data: { status: status },
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  openStoragePlacesDialog(element: string) {
    let str = element.split(' | ');
    let place = str[0];
    let count = str[1];
    const dialogRef = this.dialog.open(StoragePlacesEditorComponent, {
      width: "300px",
      data: { article: this.productPropAnswer.article, place: place, count: count, units: this.productPropAnswer.mesabbrev },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'true') {
        this.onSelectRowClick(this.dataSourceProducts[0]);
      }
    });
  }

  getToken(nameCookie: string) {
    if(this.cookieService.check(nameCookie)){
      let fullData = this.cookieService.get(nameCookie);
      let loginFromCookie = JSON.parse(fullData);
      if(loginFromCookie){
        return loginFromCookie.token
      }
    }
    else return false;
  }

  onPrintLable(element) {
    const dialogRef = this.dialog.open(PrintLableFormComponent, {
      // data: { user: element.login, },
      // width: "360px"
     });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
      }
    });
  }

  clearProp() {
    this.productPropAnswer = new ProductPropAnswer('', '', '', '', '', '', '', '');
    this.listPlaces = [];
    this.listDelivers = [];
  }

  openPlaceForm(listPlaces: Array<string>) {
    let list = [this.selectedRow];
    const dialogRef = this.dialog.open(PlaceListFormComponent, {
      data: { productList: list, placeList: listPlaces  },
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
      }
    });
  }

  onModeVar(value) {
    if(this.valueModeVar !== value)
      this.valueModeVar = value;
    else {
      this.selectedModeVar = '';
      this.valueModeVar = '';
    }
  }

  onScanF12(event: KeyboardEvent) {
    if(event.key === 'F2') {
      let t = 0;
    }
  }
}