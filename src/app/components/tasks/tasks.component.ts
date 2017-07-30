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

    this.listenerTask()
  }

  // Consume: on gist saved
  listenerTask(){
    let that = this;
    this.socket.on('addTask', function(task: Task){
      that.pushNewTaskTolist(task, that);
    });
    this.socket.on('deleteTask', function(idTask){
      that.spliceTask(idTask, that);
    });
    this.socket.on('checkTask', function(idTask){
      that.checkTask(idTask, that);
    });
  }

  filtersAction(event) {
    event.preventDefault();
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
    let newTask = {
      title: this.title,
      isDone: false
    };

    this.tasksService.addTask(newTask).subscribe(task => {
      this.title = "";
    });
  }

  pushNewTaskTolist(task, that) {
    if (that.currentPage == 1) {
      that.tasks.unshift(task);
    } else {
      that.intervalEntriesMin--;
    }
    that.totalEntries++;
    that.intervalEntriesMax++;
    that.createPagesNumber(that.numberPages);
  }

  updateStatus(task) {
    let _task = {
      _id: task._id,
      title: task.title,
      isDone: !task.isDone
    };

    this.tasksService.updateStatus(_task).subscribe(task => {

    });
  }

  checkTask(taskId, that)
  {
    let tasks = that.tasks;

    for (let i = 0;i < tasks.length;i++) {
      if (tasks[i]._id == taskId)
      {
        tasks[i].isDone = !tasks[i].isDone;
      }
    }
  }

  deleteTask(taskId) {
    // event.preventDefault();
    this.tasksService.deleteTask(taskId).subscribe(data => {

    });
  }

  spliceTask(taskId, that)
  {
    let tasks = that.tasks;

    for (let i = 0;i < tasks.length;i++) {
      if (tasks[i]._id == taskId)
      {
        tasks.splice(i, 1);
        that.intervalEntriesMax--;
      }
    }

    that.totalEntries--;
    that.createPagesNumber(that.numberPages);
  }
}
