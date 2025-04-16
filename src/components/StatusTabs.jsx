// src/components/StatusTabs.jsx
import React from 'react';

const StatusTabs = ({ activeTab, setActiveTab, stats }) => {
  return (
    <div className="bg-gray-800 px-4 border-b border-gray-700">
      <nav className="flex space-x-4">
        <button
          className={`py-4 px-1 text-sm font-medium border-b-2 ${
            activeTab === 'todos' 
              ? 'border-red-500 text-white' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('todos')}
        >
          Todas ({stats.total})
        </button>
        <button
          className={`py-4 px-1 text-sm font-medium border-b-2 ${
            activeTab === 'pendiente' 
              ? 'border-red-500 text-white' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('pendiente')}
        >
          Pendientes ({stats.pendientes})
        </button>
        <button
          className={`py-4 px-1 text-sm font-medium border-b-2 ${
            activeTab === 'revision' 
              ? 'border-red-500 text-white' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('revision')}
        >
          En revisión ({stats.enRevision})
        </button>
        <button
          className={`py-4 px-1 text-sm font-medium border-b-2 ${
            activeTab === 'aprobado' 
              ? 'border-red-500 text-white' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('aprobado')}
        >
          Aprobados ({stats.aprobados})
        </button>
        <button
          className={`py-4 px-1 text-sm font-medium border-b-2 ${
            activeTab === 'rechazado' 
              ? 'border-red-500 text-white' 
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('rechazado')}
        >
          Rechazados ({stats.rechazados})
        </button>
      </nav>
    </div>
  );
};

export default StatusTabs;