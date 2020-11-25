import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CheckModel } from '../models/check-model';
import { CheckAnswer } from '../models/check-answer';

@Injectable({
  providedIn: 'root'
})
export class PriceService {ы

  private urlPice = environment.apiUrlPayment + "check/price/";
  
  constructor(private http: HttpClient) { }

  getProduct(data: CheckModel): Observable<any> { // CheckAnswer
    return this.http.post<any>(`${this.urlPice}`, data);
  }
}
