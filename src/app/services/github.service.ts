import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  // constructor(private http: HttpClient) { }

  // fetchIssues(sort: string = 'created', order: string = 'desc', page: number = 1) {
  //   const params = `q=repo:angular/components&sort=${sort}&order=${order}&page=${page}`;
  //   return this.http.get(`https://api.github.com/search/issues?${params}`);
  // }
   private baseUrl = 'https://api.github.com/search/issues';

  constructor(private http: HttpClient) {}

  fetchIssues(sort: string, order: string, page: number, itemsPerPage: number): Observable<any> {
    const params = {
      q: 'repo:angular/components',
      sort: sort,
      order: order,
      page: page,
      per_page: itemsPerPage,
    };
    return this.http.get(`${this.baseUrl}`, { params });
  }
}
