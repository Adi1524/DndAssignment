import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import PlusIcon from "../icons/PlusIcon";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
const KanbanBoard = () => {
  const [columns, setColumns] = useState([]);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  console.log("taskssss", tasks);

  const createNewColumn = () => {
    setColumns([
      ...columns,
      { id: generateId(), title: `Column ${columns.length + 1}` },
    ]);
  };

  console.log("activeColumn", activeColumn);
  const generateId = () => {
    return Math.floor(Math.random() * 10001);
  };

  const deleteColumn = (id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const onDragStart = (e) => {
    console.log("Draasdflaskdfj", e);
    if (e.active.data?.current?.type === "column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }

    if (e.active.data?.current?.type === "tasks") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  };
  console.log("activeTask", activeTask);
  const updateColumn = (id, title) => {
    console.log("onchange", id, title);
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  };

  const onDragEnd = (e) => {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = e;

    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (overColumnId === activeColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const deleteTask = (taskId) => {
    const updatedTask = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTask);
  };

  const createTask = (columnId) => {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, string) => {
    // const newTasks = tasks.map((task) => {
    //   if (task.id !== id) return { ...task, string };
    // });
    // setTasks(newTasks);

    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, content: string };
      }
      return task;
    });
    console.log("updateintask", id, newTasks);
    setTasks(newTasks);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  );

  const onDragOver = (e) => {
    const { active, over } = e;

    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (active.id === overId) return;

    const isActiveTask = active.data.current.type === "tasks";
    const isOverTask = over.data.current.type === "tasks";
    if (!isActiveTask) return;

    // im dropping the task over antother task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);

        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data?.current.type === "column";

    if (activeTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIndex] = {
          ...tasks[activeIndex],
          columnId: overId,
        };
        return [...tasks];
      });
    }
  };
  return (
    <div
      className="
    m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]"
    >
      <DndContext
        onDragOver={onDragOver}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="m-auto flex gap-4  ">
          <div className="flex gap-4 ">
            <SortableContext items={columnsId}>
              {columns.map((col) => {
                return (
                  <div key={col.id}>
                    <ColumnContainer
                      updateTask={updateTask}
                      setTasks={setTasks}
                      tasks={tasks.filter((task) => task.columnId === col.id)}
                      updateColumn={updateColumn}
                      deleteColumn={deleteColumn}
                      createTask={createTask}
                      column={col}
                      deleteTask={deleteTask}
                    />
                  </div>
                );
              })}
            </SortableContext>
          </div>

          <button
            onClick={createNewColumn}
            className="h-[60px] flex gap-4  items-center p-4 ring-rose-500 hover:ring-2 w-[350px] min-w-[350px] cursor-pointer rounded-lg border-2 border-[#161C22] bg-[#0D1117] "
          >
            <PlusIcon /> Add column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                updateTask={updateTask}
                setTasks={setTasks}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                updateColumn={updateColumn}
                deleteColumn={deleteColumn}
                createTask={createTask}
                deleteTask={deleteTask}
              />
            )}

            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
