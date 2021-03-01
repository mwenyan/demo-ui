import { Injectable } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  // apiUrl = 'http://localhost:4200';
  // blcApiUrl = 'http://localhost:4200';
  blcApiUrl = 'http://40.65.112.23:7979';
  apiUrl = 'http://40.65.112.23:7980';
  headers = new HttpHeaders();

  constructor(private http: HttpClient) {
   }

  // create package
  createPackage(data: any): Observable<any> {
    console.log('invoke create package....');
    const API_URL = `${this.apiUrl}/packages/create`;
    return this.http.put(API_URL, data, {headers: this.headers})
      .pipe(
        catchError(this.error)
      );
  }

  // pickup the package and invoke the simulator: tracking id
  pickup(trackingId: string): Observable<any> {
    const API_URL = `${this.apiUrl}/packages/pickup?uid=${trackingId}`;
    const sheaders = new HttpHeaders().set('accept', '*/*');
    return this.http.put(API_URL, {}, {headers: sheaders, responseType: 'text'})
      .pipe(
        catchError(this.error)
      );
  }

  // get internal tracking information: shiper and tracking id
  getTimeline(trackingId: string): Observable<any> {
    const API_URL = `${this.apiUrl}/packages/timeline?uid=${trackingId}`;
    return this.http.get(API_URL, {headers: this.headers})
      .pipe(
        catchError(this.error)
      );
  }


  // get blockchain txn for pickup/delivery/transfer/etc
  getBlockchainTxn(trackingId: string, txn: string): Observable<any> {
    const API_URL = `${this.blcApiUrl}/shipping/verifytransaction`;

    const data = {
      uid: trackingId,
      transactionType: txn
    };

    const authHeaders = new HttpHeaders().append('Authorization', 'Basic ' + btoa('User1:'));
    return this.http.post(API_URL, data, {headers: authHeaders})
      .pipe(
        catchError(this.error)
      );
  }

    // get temperatures
    getBlockchainViolation(trackingId: string, periods: string[]): Observable<any[]> {
      const API_URL = `${this.blcApiUrl}/shipping/verifytemperature`;
      const responses: Observable<any>[] = [];

      for (const p of periods){
        const data = {
          uid: trackingId,
          periodStart: p
        };

        const authHeaders = new HttpHeaders().append('Authorization', 'Basic ' + btoa('User1:'));
        responses.push(this.http.post(API_URL, data, {headers: authHeaders, withCredentials: true})
                                .pipe(
                                    catchError(this.error)
                                )
                  );
      }
      return forkJoin(responses);
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
