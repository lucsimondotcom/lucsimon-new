import { getTaskCheckProgress } from "@/lib/scrollZones";

function TaskCheck({ progress }: { progress: number }) {
  return (
    <span
      className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center text-accent"
      style={{
        opacity: progress,
        transform: `scale(${0.55 + progress * 0.45})`,
      }}
      aria-hidden
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
        <path
          d="M2.5 6l2.5 2.5 4.5-4.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

interface StepTasksProps {
  tasks: string[];
  zoneLocalProgress: number;
  allChecked?: boolean;
}

export function StepTasks({ tasks, zoneLocalProgress, allChecked }: StepTasksProps) {
  return (
    <ul className="space-y-4">
      {tasks.map((task, index) => {
        const checkProgress = allChecked
          ? 1
          : getTaskCheckProgress(index, tasks.length, zoneLocalProgress);

        return (
          <li
            key={task}
            className="flex items-center gap-3 text-[11px] font-normal tracking-[0.16em] text-muted uppercase"
          >
            <TaskCheck progress={checkProgress} />
            <span
              style={{
                opacity: 0.45 + checkProgress * 0.55,
              }}
            >
              {task}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
