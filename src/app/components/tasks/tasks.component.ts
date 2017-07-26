import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { Task } from '../../../models/Task';
import { Paginator } from '../../../models/Paginator';
import { Filters } from '../../../models/Filters';
import { Socket } from 'ng2-socket-io';

@Component({
  selector: 'app-tasks',
  templateUrl: 'tasks.component.html',
  styleUrls: ['tasks.component.css']
})
export class TasksComponent implements OnInit {
  // instantiate tasks to an empty object
  tasks: Task[];
  title: string;
  countPerPage: number;
  totalEntries: number;
  currentPage: number;
  numberPages: number;
  intervalEntriesMin: number;
  intervalEntriesMax: number;
  paginator: Paginator[] = [];
  filters: Filters;

  constructor(private tasksService: TasksService, private socket: Socket) {

  }

  ngOnInit() {
    // Retrieve tasks from the API
    this.filters = {
      title: '',
      isDone: ''
    };
    this.goToPage(1);
  }

  filtersAction(event) {
    event.preventDefault();
    console.log('Filters', this.filters);
    this.goToPage(1);
  }

  goToPage(number) {
    this.countPerPage = 10;
    this.currentPage = number;

    this.tasksService.getTasks(this.currentPage, this.countPerPage, this.filters).subscribe(tasks => {
      this.tasks = tasks;
    });

    this.tasksService.countAllTasks(this.filters).subscribe(totalEntries => {
      this.totalEntries = totalEntries;
      this.numberPages = totalEntries / this.countPerPage;
      this.intervalEntriesMax = this.currentPage * this.countPerPage;
      if (this.intervalEntriesMax > this.totalEntries)
      {
        this.intervalEntriesMax = this.totalEntries;
      }
      this.intervalEntriesMin = this.intervalEntriesMax - this.countPerPage + 1;
      if (this.intervalEntriesMin < 1)
      {
        this.intervalEntriesMin = 0;
      }
      this.createPagesNumber(this.numberPages);
    });
  }

  createPagesNumber(number) {
    number = Math.ceil(number);
    let tmpPaginator = [];
    for(let i = 1; i <= number; i++){
      tmpPaginator.push({ number:i });
    }

    this.paginator = tmpPaginator;
  }

  addTask(event) {
    event.preventDefault();
    this.socket.emit("hello_world", 'test');
    let newTask = {
      title: this.title,
      isDone: false
    };

    this.tasksService.addTask(newTask).subscribe(task => {
      if (this.currentPage == 1) {
        this.tasks.unshift(task);
      } else {
        this.intervalEntriesMin--;
      }
      this.totalEntries++;
      this.intervalEntriesMax++;

      this.title = "";
      this.createPagesNumber(this.numberPages);
    });
  }

  updateStatus(task) {
    let _task = {
      _id: task._id,
      title: task.title,
      isDone: !task.isDone
    };

    this.tasksService.updateStatus(_task).subscribe(task => {
      task.isDone = !task.isDone;
    });
  }

  deleteTask(taskId) {
    // event.preventDefault();

    let tasks = this.tasks;
    this.tasksService.deleteTask(taskId).subscribe(data => {
      if (data.n == 1)
      {
        for (let i = 0;i < tasks.length;i++) {
            if (tasks[i]._id == taskId)
            {
              tasks.splice(i, 1);
              this.intervalEntriesMax--;
            }
          }
      }
      this.totalEntries--;
      this.createPagesNumber(this.numberPages);
    });
  }
}
