import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";

const TaskCard = ({ task, deleteTask, number, updateTask }) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "tasks", task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (editMode) {
    return (
      <div className="relative bg-[#0D1117] p-2.5 h-[100px] h-min-[100px]  flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab">
        <textarea
          value={task.content}
          className="h-[90%] w-full resize-none border-none rounded-md bg-transparent focus:outline-none"
          placeholder="Task content here...."
          onBlur={toggleEditMode}
          onChange={(e) => updateTask(task.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
        />
      </div>
    );
  }
  return (
    <div>
      {isDragging ? (
        <div
          ref={setNodeRef}
          style={style}
          className="bg-[#0D1117] p-2.5 h-[100px] h-min-[100px]  flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 opacity-50 border border-rose-500 "
        ></div>
      ) : (
        <div
          {...attributes}
          {...listeners}
          ref={setNodeRef}
          style={style}
          onClick={toggleEditMode}
          onMouseEnter={() => setMouseIsOver(true)}
          onMouseLeave={() => setMouseIsOver(false)}
          className="relative bg-[#0D1117] p-2.5 h-[100px] h-min-[100px]  flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
        >
          <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-auto task whitespace-pre-wrap">{`${task.content} `}</p>
          {mouseIsOver && (
            <button
              onClick={() => deleteTask(task.id)}
              className="stroke-white absolute cursor-pointer opacity-60 hover:opacity-100 right-4 top-1/2 -translate-y-1/2 bg-[#161C22] p-2 rounded-md"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
