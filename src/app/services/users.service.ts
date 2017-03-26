import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UsersService {

  constructor(private http: Http) {
    console.log('Users service initialize');
  }

  login(user) {
      console.log("login");
  }

  logout(user) {
      console.log('logout');
  }
}
