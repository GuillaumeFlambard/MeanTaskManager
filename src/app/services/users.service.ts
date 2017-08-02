import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {

  constructor(private http: Http) {
    console.log('Users service initialize');
  }

  isAuthenticate() {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.get('/users/is/authenticate', {headers: headers})
          .map(
              res => res.json()
          )
      ;
  }

  login(user) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post('/users/login', JSON.stringify(user), {headers: headers})
          .map(
              res => res.json()
          )
      ;
  }

  registration(user) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post('/users/registration', JSON.stringify(user), {headers: headers})
          .map(
              res => res.json()
          )
      ;
  }

  logout() {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.get('/users/logout', {headers: headers})
          .map(
              res => res.json()
          )
      ;
  }
}
