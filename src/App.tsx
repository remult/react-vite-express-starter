import { useEffect, useState } from 'react';
import { remult } from 'remult';
import { Task } from './shared/Task';

const taskRepo = remult.repo(Task);

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    taskRepo.find()
      .then(data => {
        console.log("✅ Fetched tasks from API:", data);  // ✅ Debugging
        setTasks([...data]);  // ✅ Ensures React updates state properly
      })
      .catch(error => {
        console.error("❌ Error fetching tasks:", error);  // ✅ Debugging
      });
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <main>
        {tasks.length === 0 && <p>No tasks found.</p>} {/* ✅ Show a message if no tasks */}
        {tasks.map((task) => (
          <div key={task.id}>
            <input type="checkbox" checked={task.completed} readOnly />
            {task.title}
          </div>
        ))}
      </main>
    </div>
  );
}