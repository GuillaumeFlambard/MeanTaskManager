import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {

  constructor(private http: Http) {
    console.log('Users service initialize');
  }

  login(user) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post('/users/login', JSON.stringify(user), {headers: headers})
          .map(res => res.json());
  }
}
