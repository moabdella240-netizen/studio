"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Set up project structure", completed: true },
    { id: 2, text: "Design the main dashboard", completed: true },
    { id: 3, text: "Implement chat feature", completed: false },
    { id: 4, text: "Connect image generation API", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: newTask.trim(), completed: false },
    ]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Manager</CardTitle>
        <CardDescription>Organize your daily tasks and activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Task</span>
          </Button>
        </form>

        <ScrollArea className="h-[45vh] border rounded-md p-2">
          <div className="space-y-2">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    aria-label={task.text}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`flex-grow cursor-pointer text-sm ${
                      task.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Task</span>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground p-8">No tasks yet. Add one to get started!</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
