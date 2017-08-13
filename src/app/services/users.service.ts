import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {User} from "../../models/User";

@Injectable()
export class UsersService {
    private subject: Subject<User> = new Subject<User>();
    static user: User;

  constructor(private http: Http) {
    console.log('Users service initialize');
    this.isAuthenticate().subscribe(user => {
        if (Object.keys(user).length != 0)
        {
            console.log('Set user', user.user);
            this.setUser(user.user);
            // this.usersService.setUser(user.user);
            // this.router.navigate(['tasks']);
        }
    });
  }

    setUser(user: User): void {
        UsersService.user = user;
        this.subject.next(user);
    }

    getUser(): Observable<User> {
        return this.subject.asObservable();
    }

    getCurrentUserValue() {
      console.log('Call success', UsersService.user);
      return UsersService.user;
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
