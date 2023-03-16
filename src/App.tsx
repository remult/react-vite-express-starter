import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { action } from 'mobx';
import { Store } from "./Store";

export const store = new Store();

const App = observer(() => {
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
                onChange={action(e => task.completed = e.target.checked)} />
              <input
                value={task.title}
                onChange={action(e => task.title = e.target.value)} />
              <button type="button" onClick={() => store.saveTask(task)}>Save</button>
              <button type="button" onClick={() => store.deleteTask(task)}>Delete</button>
            </div>
          );
        })}
      </main>
      <button type="button" onClick={() => store.addTask()}>Add Task</button>
      <div>
        <button type="button" onClick={() => store.setAll(true)}>Set all as completed</button>
        <button type="button" onClick={() => store.setAll(false)}>Set all as uncompleted</button>
      </div>
    </div>
  );
});

export default App;
