import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Search, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { AccessLog } from '../../types';

interface HistoryViewProps {
  logs: AccessLog[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos los roles');
  const [selectedDate, setSelectedDate] = useState('2023-10-24');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.documentNumber.includes(searchTerm);

    const matchesRole = 
      selectedRole === 'Todos los roles' || 
      log.role.toLowerCase() === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // CSV Export handler
  const exportToCSV = () => {
    const headers = ['Tipo', 'Fecha_Hora', 'Documento', 'Nombre_Completo', 'Rol', 'Puerta', 'Celador', 'Forzado_Novedad'];
    const rows = filteredLogs.map(l => [
      l.type,
      `"${l.timestamp}"`,
      `"${l.documentNumber}"`,
      `"${l.fullName}"`,
      `"${l.role}"`,
      `"${l.gate}"`,
      `"${l.celadorName}"`,
      l.forced ? `"${l.forcedReason || 'Si'}"` : 'No'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SENA_Control_Acceso_Historial_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title & Action Buttons Header - Image 11 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Historial y Reportes
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Registro de movimientos en portería. Utilice los filtros para localizar eventos específicos o generar reportes tabulares.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-[#1C7C00] hover:bg-[#155e00] text-white text-xs font-bold rounded-xl shadow-md shadow-[#1C7C00]/20 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Row - Image 11 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6">
        {/* Entradas Registradas */}
        <div className="md:col-span-4 bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Entradas Registradas
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">842</span>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12%</span>
            </div>
          </div>
        </div>

        {/* Salidas Registradas */}
        <div className="md:col-span-4 bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Salidas Registradas
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">615</span>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>-4%</span>
            </div>
          </div>
        </div>

        {/* Actividad por Hora (Hoy) with SVG sparkline chart */}
        <div className="sm:col-span-2 md:col-span-4 bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Actividad por Hora (Hoy)
          </div>
          <div className="h-14 w-full">
            <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#39A900" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#39A900" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 45 Q 25 45 40 30 T 80 32 T 120 10 T 160 55 T 200 20"
                fill="none"
                stroke="#39A900"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 45 Q 25 45 40 30 T 80 32 T 120 10 T 160 55 T 200 20 L 200 60 L 0 60 Z"
                fill="url(#chartGradient)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Bar - Image 11 */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por documento o nombre..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden font-medium"
          />
        </div>

        {/* Date Picker */}
        <div className="relative w-full md:w-48">
          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden"
          />
        </div>

        {/* Role Selector */}
        <div className="w-full md:w-48">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:bg-white focus:ring-2 focus:ring-[#39A900] outline-hidden"
          >
            <option value="Todos los roles">Todos los roles</option>
            <option value="Aprendiz">Aprendiz</option>
            <option value="Instructor">Instructor</option>
            <option value="Visitante">Visitante</option>
            <option value="Contratista">Contratista</option>
          </select>
        </div>
      </div>

      {/* Main Data View: Mobile Cards & Desktop Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xs border border-slate-200/80 overflow-hidden">
        {/* Mobile View (< md): Card List */}
        <div className="md:hidden divide-y divide-slate-100">
          {paginatedLogs.map((log) => {
            const isEntry = log.type === 'ENTRADA';
            return (
              <div key={log.id} className="py-3.5 flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  isEntry ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {isEntry ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-xs truncate">
                      {log.fullName}
                    </h4>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      log.role.toLowerCase() === 'aprendiz'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.role.toLowerCase() === 'instructor'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {log.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span className="font-mono text-slate-400">CC {log.documentNumber}</span>
                    <span className="font-medium text-slate-600">{log.timestamp}</span>
                  </div>

                  {log.forced && (
                    <div className="mt-1">
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold inline-block">
                        Excepción Forzada
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View (>= md): Full Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3 font-semibold">Tipo</th>
                <th className="pb-3 px-3 font-semibold">Fecha / Hora</th>
                <th className="pb-3 px-3 font-semibold">Documento</th>
                <th className="pb-3 px-3 font-semibold">Nombre Completo</th>
                <th className="pb-3 px-3 font-semibold">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedLogs.map((log) => {
                const isEntry = log.type === 'ENTRADA';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Tipo Icon */}
                    <td className="py-4 px-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isEntry ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isEntry ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                    </td>

                    {/* Fecha / Hora */}
                    <td className="py-4 px-3">
                      <div className="font-bold text-slate-800">{log.timestamp}</div>
                      <div className="text-[11px] text-slate-400">{log.relativeTime}</div>
                    </td>

                    {/* Documento */}
                    <td className="py-4 px-3 font-mono font-medium text-slate-600">
                      {log.documentNumber}
                    </td>

                    {/* Nombre Completo */}
                    <td className="py-4 px-3 font-bold text-slate-900">
                      {log.fullName}
                      {log.forced && (
                        <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                          Excepción Forzada
                        </span>
                      )}
                    </td>

                    {/* Rol */}
                    <td className="py-4 px-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                        log.role.toLowerCase() === 'aprendiz'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.role.toLowerCase() === 'instructor'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.role}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination - Image 11 */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Mostrando 1-{paginatedLogs.length} de 1,457 registros
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800 px-2">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
