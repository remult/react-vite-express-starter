import React, { useEffect, useState } from "react";
import { remult } from "remult";
import { Task } from "./shared/Task";
import { TasksController } from "./shared/TasksController";
import { observer } from "mobx-react-lite";
import { action, makeAutoObservable, observable, runInAction } from 'mobx';




class Store {
  taskRepo = remult.repo(Task);
  readonly tasks = observable<Task>([]);
  hideCompleted = false;
  constructor() {
    makeAutoObservable(this);
  }
  replaceTasks(t: Task[]) {
    this.tasks.replace(t.map(t => makeAutoObservable({ ...t })));
  }
  async loadTasks() {
    this.replaceTasks(await
      this.taskRepo.find({
        limit: 20,
        orderBy: { completed: "asc" },
        where: { completed: this.hideCompleted ? false : undefined }
      }));
  }
  addTask() {
    this.tasks.push(makeAutoObservable(new Task()))
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
    runInAction(() => store.tasks.remove(task));
  }
  async setAll(completed: boolean) {
    await TasksController.setAll(completed);
    this.loadTasks();
  }
}
const store = new Store();

function App() {
  return <Todo store={store} />

}
const Todo = observer(({ store }: { store: Store }) => {
  useEffect(() => {
    store.loadTasks()
  }, [store.hideCompleted]);
  return (
    <div>
      <input
        type="checkbox"
        checked={store.hideCompleted}
        onChange={action(e => store.hideCompleted = e.target.checked)} /> Hide Completed
      <main>
        {store.tasks.map(task => {
          return (
            <div key={task.id}>
              <input type="checkbox"
                checked={task.completed}
                onChange={action(e => {
                  const prev = task.completed;
                  task.completed = e.target.checked;
                })} />
              <input
                value={task.title}
                onChange={action(e => task.title = e.target.value)} />
              <button onClick={() => store.saveTask(task)}>Save</button>
              <button onClick={() => store.deleteTask(task)}>Delete</button>
            </div>
          );
        })}

      </main>
      <button onClick={() => store.addTask()}>Add Task</button>
      <div>
        <button onClick={() => store.setAll(true)}>Set all as completed</button>
        <button onClick={() => store.setAll(false)}>Set all as uncompleted</button>
      </div>

    </div>
  );
});


export default App;
