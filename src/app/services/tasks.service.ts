import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TasksService {

  constructor(private http: Http) {
    console.log('Tasks service initialize');
  }

  updateStatus(task) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      return this.http.put('/api/task/' + task._id, JSON.stringify(task), {headers: headers})
          .map(res => res.json());
  }

  deleteTask(taskId) {
      return this.http.delete('/api/task/' + taskId)
          .map(res => res.json());
  }

  addTask(task) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
        return this.http.post('/api/task', JSON.stringify(task), {headers: headers})
          .map(res => res.json());
  }

  getTasks(page, pagecount) {
    return this.http.get('/api/tasks/' + page + '/' + pagecount)
      .map(res => res.json());
  }

  countAllTasks() {
    return this.http.get('/api/tasks/count/all')
      .map(res => res.json());
  }
}
