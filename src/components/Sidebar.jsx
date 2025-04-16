// src/components/Sidebar.jsx
import React from 'react';
import { Users, Calendar, BarChart, Settings, User, LogOut } from 'lucide-react';

const Sidebar = ({ stats }) => {
  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="text-red-600 font-bold text-2xl mr-1">TEDx</div>
          <div className="text-white font-bold text-lg">LasCondes</div>
        </div>
        <p className="text-xs text-gray-400 mt-1">Panel de Administración</p>
      </div>
      
      <nav className="mt-5">
        <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Principal
        </div>
        <a href="#dashboard" className="flex items-center px-4 py-3 text-white bg-gray-700 border-l-4 border-red-500">
          <Users className="h-5 w-5 mr-3" />
          Postulaciones
        </a>
        <a href="#calendar" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition">
          <Calendar className="h-5 w-5 mr-3" />
          Calendario
        </a>
        <a href="#stats" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition">
          <BarChart className="h-5 w-5 mr-3" />
          Estadísticas
        </a>
        
        <div className="px-4 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Configuración
        </div>
        <a href="#settings" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition">
          <Settings className="h-5 w-5 mr-3" />
          Ajustes
        </a>
        <a href="#account" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition">
          <User className="h-5 w-5 mr-3" />
          Mi cuenta
        </a>
        <a href="#logout" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition">
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar sesión
        </a>
      </nav>
      
      {/* Resumen de estadísticas en el sidebar */}
      <div className="mt-auto p-4 border-t border-gray-700">
        <div className="text-sm font-semibold mb-2">Resumen</div>
        <div className="text-xs text-gray-400 mb-1 flex justify-between">
          <span>Total postulaciones:</span>
          <span className="text-white">{stats.total}</span>
        </div>
        <div className="text-xs text-gray-400 mb-1 flex justify-between">
          <span>Pendientes:</span>
          <span className="text-yellow-500">{stats.pendientes}</span>
        </div>
        <div className="text-xs text-gray-400 mb-1 flex justify-between">
          <span>En revisión:</span>
          <span className="text-blue-500">{stats.enRevision}</span>
        </div>
        <div className="text-xs text-gray-400 mb-1 flex justify-between">
          <span>Aprobados:</span>
          <span className="text-green-500">{stats.aprobados}</span>
        </div>
        <div className="text-xs text-gray-400 flex justify-between">
          <span>Rechazados:</span>
          <span className="text-red-500">{stats.rechazados}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;