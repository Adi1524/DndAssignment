import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import TaskCard from "./TaskCard";

const ColumnContainer = ({
  column,
  deleteColumn,
  updateColumn,
  tasks,
  createTask,
  updateTask,
  setTasks,
  deleteTask,
}) => {
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "column", column },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  return (
    <div>
      {isDragging ? (
        <div
          ref={setNodeRef}
          style={style}
          className={` bg-[#0D1117] opacity-40 border-2 border-rose-500  w-[350px] h-[500px] max-h-[500px] rounded-xl flex flex-col p-2`}
        ></div>
      ) : (
        <div
          ref={setNodeRef}
          style={style}
          className=" bg-[#161C22]   w-[350px] h-[500px] max-h-[500px] rounded-xl flex flex-col p-2 "
        >
          <div
            onClick={() => setEditMode(true)}
            {...attributes}
            {...listeners}
            className={`${isDragging ? "cursor-grabbing" : "cursor-grab"}
      bg-[#0D1117]  text-md h-[60px]  rounded-xl rounded-b-none p-3 font-bold  `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex justify-between items-center rounded-md bg-[#161C22]  px-2 py-1 text-sm">
                  0
                </div>
                {editMode ? (
                  <input
                    className="bg-black focus:border-rose-500 border rounded-md outline-none px-2"
                    value={column.title}
                    autoFocus
                    onChange={(e) => updateColumn(column.id, e.target.value)}
                    onBlur={() => setEditMode(false)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      setEditMode(false);
                    }}
                  />
                ) : (
                  column.title
                )}
              </div>
              <button
                onClick={() => deleteColumn(column.id)}
                className="stroke-gray-500 hover:stroke-white hover:bg-gray-800 cursor-pointer rounded-md px-1 py-2"
              >
                {" "}
                <TrashIcon />
              </button>
            </div>
          </div>

          <div className="h-full flex flex-col flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto ">
            <SortableContext items={tasksId}>
              {tasks &&
                tasks.map((task, i) => (
                  <TaskCard
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                    number={i}
                    key={task.id}
                    task={task}
                  />
                ))}
            </SortableContext>
          </div>
          <div className="flex w-full   flex-end">
            <button
              onClick={() => createTask(column.id)}
              className="flex items-center gap-2 w-full border-[#161C22]  rounded-md  hover:bg-black py-2 px-2 hover:text-rose-500 cursor-pointer"
            >
              <PlusIcon />
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnContainer;
