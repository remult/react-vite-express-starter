import { Remult, remult } from "remult";
import { Task } from "./shared/Task";
import { TasksController } from "./shared/TasksController";
import { action, createAtom, makeAutoObservable, runInAction } from 'mobx';
import { store } from "./App";

// Make all remult entities observable mobx items
Remult.entityRefInit = (ref, row) => ref.subscribe(createAtom("entity"));

export class Store {
  taskRepo = remult.repo(Task);
  tasks: Task[] = [];
  hideCompleted = false;
  constructor() {
    makeAutoObservable(this);
    this.taskRepo.addEventListener({
      deleted: action(task => this.tasks = this.tasks.filter(t => t != task))
    });
  }
  replaceTasks(tasks: Task[]) {
    this.tasks = tasks;
  }
  async loadTasks() {
    this.replaceTasks(await this.taskRepo.find({
      limit: 20,
      orderBy: { completed: "asc" },
      where: { completed: this.hideCompleted ? false : undefined }
    }));
  }
  addTask() {
    this.tasks.push(this.taskRepo.create());
  }
  async saveTask(task: Task) {
    try {
      await task.save();
    } catch (error: any) {
      alert(error.message);
    }
  }
  async setAll(completed: boolean) {
    await TasksController.setAll(completed);
    this.loadTasks();
  }
}
