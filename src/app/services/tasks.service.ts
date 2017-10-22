import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TasksService {

  constructor(private http: Http) {
    console.log('Tasks service initialize');

      // var socket = io.connect('http://localhost:4200');
      // socket.on('connect', function(data) {
      //     socket.emit('join', 'Hello World from client');
      // });
  }

  updateStatus(task) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.put('/api/tasks/' + task._id, JSON.stringify(task), {headers: headers})
          .map(res => res.json());
  }

  deleteTask(taskId) {
      return this.http.delete('/api/tasks/' + taskId)
          .map(res => res.json());
  }

  addTask(task) {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
        return this.http.post('/api/tasks/create', JSON.stringify(task), {headers: headers})
          .map(res => res.json());
  }

  getTasks(page, pagecount, filters) {
    let body = {
        'page': page,
        'pagecount': pagecount,
        'filters': filters
    };

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/api/tasks/filter', JSON.stringify(body), {headers: headers})
      .map(res => res.json());
  }

  countAllTasks(filters) {
      let body = {
          'filters': filters
      };

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.post('/api/tasks/count/filter', JSON.stringify(body), {headers: headers})
          .map(res => res.json());
  }
}
