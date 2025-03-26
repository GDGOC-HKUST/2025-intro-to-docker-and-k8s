interface TodoCounterProps {
  count: number;
}

export default function TodoCounter({ count }: TodoCounterProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="flex flex-col items-center">
        <div className="text-3xl font-bold text-gray-800">{count}</div>
        <div className="text-sm text-gray-500">Total Tasks</div>
      </div>
    </div>
  );
}
