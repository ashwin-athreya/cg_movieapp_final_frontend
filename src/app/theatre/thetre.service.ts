import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { Theatre } from './theatre';
import { catchError } from 'rxjs/operators';
import { Show } from '../show/show';
@Injectable({
  providedIn: 'root',
})
export class ThetreService {
  private url = 'http://localhost:8000';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private httpClient: HttpClient) {}

  getAllTheatres(): Observable<Theatre[]> {
    return this.httpClient.get<Theatre[]>(this.url + '/user/theatre' + '/all');
    pipe(catchError(this.handleError));
  }

  deleteTheatre(TheatreId: number): Observable<Theatre> {
    return this.httpClient
      .delete<Theatre>(this.url + '/admin/theatre/delete/' + TheatreId)
      .pipe(catchError(this.handleError));
  }

  addTheatre(theatre: any): Observable<any> {
    return this.httpClient
      .post<Theatre>(
        this.url + '/admin/theatre/insert',
        JSON.stringify(theatre),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  updateTheatre(theatre: any): Observable<any> {
    console.log(theatre);
    return this.httpClient
      .put<Theatre>(
        this.url + '/admin/theatre/update',
        JSON.stringify(theatre),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }


  getShowsForScreen(screenId: number): Observable<Show[]> {
    return this.httpClient
      .get<Show[]>(`${this.url}/user/screens/shows/${screenId}`)
      .pipe(catchError(this.handleError));
  }


  findTheatre(id: any): Observable<Theatre> {
    return this.httpClient
      .get<Theatre>(this.url + '/user/theatre/find/' + id)
      .pipe(catchError(this.handleError));
  }

  findTheatresbyMovie(movieId: any): Observable<Theatre[]> {
    return this.httpClient
      .get<Theatre[]>(this.url + '/user/theatre/findbyMovie/' + movieId)
      .pipe(catchError(this.handleError));
  }

  handleError(eResponse: HttpErrorResponse) {
    if (eResponse.error instanceof ErrorEvent) {
      console.log('Client Side Error =' + eResponse.error.message);
      console.log('Status Code=' + eResponse.status);
    } else {
      console.log('Server Side Error =' + eResponse.error.message);
      console.log('Status Code=' + eResponse.status);
    }
    return throwError(eResponse.error.message);
  }
}
