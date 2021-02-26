import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  apiUrl = 'http://localhost';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {
    this.headers.set('accept', 'application/json');
   }

  // create package
  createPackage(data: any): Observable<any> {
    console.log('invoke create package....');
    const API_URL = `${this.apiUrl}/packages/create`;
    return this.http.post(API_URL, data, {headers: this.headers})
      .pipe(
        catchError(this.error)
      );
  }

  // pickup the package and invoke the simulator: tracking id
  pickup(trackingId: string): Observable<any> {
    const API_URL = `${this.apiUrl}/packages/pickup?uid=${trackingId}`;
    return this.http.put(API_URL, {}, {headers: this.headers})
      .pipe(
        catchError(this.error)
      );
  }

  // get internal tracking information: shiper and tracking id
  getInternalTrackingInfo(trackingId: string, company: string): Observable<any> {
    const API_URL = `${this.apiUrl}/tracking/internal/${company}/${trackingId}`;
    return this.http.get(API_URL, {headers: this.headers})
      .pipe(
        catchError(this.error)
      );
  }


  // get internal tracking information: shiper and tracking id
  getTransferTxnDetail(trackingId: string, txnId: string): Observable<any> {
    const API_URL = `${this.apiUrl}/tracking/${trackingId}/${txnId}`;

    return this.http.get(API_URL, {headers: this.headers})
      .pipe(
        catchError(this.error)
      );
  }

  // Handle Errors 
  error(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
