import Board from '@/components/kanban/Board';

export default function Dashboard() {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-cyan-400">Your Board</h1>
        <p className="text-sm text-gray-500 mt-1">Drag tasks between columns to update their status</p>
      </div>
      <Board />
    </div>
  );
}
