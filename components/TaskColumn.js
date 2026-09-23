import TaskCard from "@/components/TaskCard";

// One board column (Pending, In Progress or Completed) with its tasks
export default function TaskColumn({ title, dotColor, tasks, onEdit, onMove, onDelete }) {
  return (
    <div className="bg-gray-100 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className={"w-2.5 h-2.5 rounded-full " + dotColor}></span>
        <h2 className="font-semibold text-gray-700">{title}</h2>
        <span className="ml-auto text-sm text-gray-500 bg-white rounded-full px-2.5 py-0.5">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-8">No tasks here</p>
      )}

      <div className="space-y-3">
        {tasks.map(function (task) {
          return (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onMove={onMove}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </div>
  );
}
