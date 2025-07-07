import React, { useState } from 'react';

interface PracticeMode {
  mode: 'full' | 'time' | 'length';
  value?: number;
}

interface PracticeModeSelectorProps {
  onConfirm: (mode: PracticeMode) => void;
  onBack: () => void;
  defaultMode?: PracticeMode;
}

const PracticeModeSelector: React.FC<PracticeModeSelectorProps> = ({ onConfirm, onBack, defaultMode }) => {
  const [mode, setMode] = useState<PracticeMode['mode']>(defaultMode?.mode || 'full');
  const [value, setValue] = useState<number>(defaultMode?.value || 60);

  const handleConfirm = () => {
    if (mode === 'time' || mode === 'length') {
      onConfirm({ mode, value });
    } else {
      onConfirm({ mode });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Chọn chế độ luyện tập</h2>
      <div className="mb-6">
        <label className="block font-medium mb-2">Chế độ:</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={mode}
          onChange={e => setMode(e.target.value as PracticeMode['mode'])}
          data-cy="practice-mode-select"
        >
          <option value="full">Toàn bộ nội dung</option>
          <option value="time">Theo thời gian</option>
          <option value="length">Theo độ dài</option>
        </select>
        {mode === 'time' && (
          <input
            type="number"
            min={10}
            max={600}
            step={10}
            value={value}
            onChange={e => setValue(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Giây (ví dụ: 60)"
          />
        )}
        {mode === 'length' && (
          <input
            type="number"
            min={10}
            max={1000}
            step={10}
            value={value}
            onChange={e => setValue(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="Ký tự (ví dụ: 100)"
          />
        )}
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Quay lại
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Xác nhận & Bắt đầu
        </button>
      </div>
    </div>
  );
};

export default PracticeModeSelector; 