import { remult } from "remult";
import { Task } from "./shared/Task";
import { TasksController } from "./shared/TasksController";
import { makeAutoObservable, runInAction } from 'mobx';
import { store } from "./App";

export class Store {
  taskRepo = remult.repo(Task);
  tasks: Task[] = [];
  hideCompleted = false;
  constructor() {
    makeAutoObservable(this);
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
    this.tasks.push(new Task());
  }
  async saveTask(task: Task) {
    try {
      const savedTask = await this.taskRepo.save(task);
      runInAction(() => store.tasks[store.tasks.indexOf(task)] = savedTask);
    } catch (error: any) {
      alert(error.message);
    }
  }
  async deleteTask(task: Task) {
    await this.taskRepo.delete(task);
    runInAction(() => this.tasks = this.tasks.filter(t => t !== task));
  }
  async setAll(completed: boolean) {
    await TasksController.setAll(completed);
    this.loadTasks();
  }
}
