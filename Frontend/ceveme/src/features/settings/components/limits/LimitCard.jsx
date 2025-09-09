import React from 'react';

function LimitCard({ title, activeCount, totalCount, endpointName }) {
  const progress = totalCount > 0 ? (activeCount / totalCount) * 100 : 0;

  const progressBarclass =
    progress >= 100
      ? 'bg-gradient-to-r from-red-800 to-red-400'
      : 'bg-gradient-to-r from-green-800 to-green-300';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {progress >= 100 && (
          <button className="text-lg bg-kraft text-white font-bold p-3 rounded-2xl hover:bg-kraft/75">
            Zwiększ swój pakiet
          </button>
        )}
      </div>

      <div className="flex justify-between items-end mb-2">
        <p className="text-3xl font-bold text-gray-900">
          {activeCount}/{totalCount}{' '}
          <span className="text-xl text-gray-500">{endpointName}</span>
        </p>
      </div>

      <div className="w-full h-2.5 mb-4 relative overflow-hidden rounded-full">
        <div className={`absolute inset-0 ${progressBarclass}`} />
        <div
          className="absolute inset-y-0 right-0 bg-gray-200"
          style={{
            width: `${Math.max(0, Math.min(100, 100 - progress))}%`,
            transition: 'width 300ms ease',
          }}
        />
      </div>
    </div>
  );
}

export default LimitCard;
