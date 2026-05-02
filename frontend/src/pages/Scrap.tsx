import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Trash2, AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '../utils';

export const Scrap = () => {
  const { factory, scrapLogs, addScrapLog } = useAppData();
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState<'Morning' | 'Afternoon' | 'Night'>('Morning');
  const [material, setMaterial] = useState('Aluminium');
  const [inputKg, setInputKg] = useState('');
  const [outputKg, setOutputKg] = useState('');

  const input = parseFloat(inputKg) || 0;
  const output = parseFloat(outputKg) || 0;
  const scrap = input > output ? input - output : 0;
  const scrapPct = input > 0 ? (scrap / input) * 100 : 0;
  const yieldPct = input > 0 ? (output / input) * 100 : 0;

  // Assuming some static values for prototype
  const lossValue = scrap * (material === 'Aluminium' ? 120 : material === 'Brass' ? 300 : 60);
  const resaleValue = scrap * (material === 'Aluminium' ? 30 : material === 'Brass' ? 150 : 15);

  const benchmark = factory?.benchmark_scrap_pct || 8.0;
  const isHighScrap = scrapPct > benchmark;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input <= 0 || output <= 0 || input < output) return;

    addScrapLog({
      id: `scr_${Date.now()}`,
      factory_id: factory?.id || '',
      date,
      shift,
      material,
      input_kg: input,
      output_kg: output,
      scrap_kg: scrap,
      scrap_pct: scrapPct,
      loss_inr: lossValue,
      resale_inr: resaleValue
    });

    setInputKg('');
    setOutputKg('');
  };

  const { weekScrapKg, weekLoss, weekResale, equivalentMachineDays } = useMemo(() => {
    // Get this week's logs
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    const recentLogs = scrapLogs.filter(l => new Date(l.date) >= sevenDaysAgo);

    const kg = recentLogs.reduce((sum, l) => sum + l.scrap_kg, 0);
    const loss = recentLogs.reduce((sum, l) => sum + l.loss_inr, 0);
    const resale = recentLogs.reduce((sum, l) => sum + l.resale_inr, 0);

    // Rough humanized stat: ₹5000 lost ~ 1 machine day
    const mDays = Math.ceil(loss / 5000);

    return { weekScrapKg: kg, weekLoss: loss, weekResale: resale, equivalentMachineDays: mDays };
  }, [scrapLogs]);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      
      {/* Top Summary Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[var(--color-brand-amber)]">
            <Trash2 size={20} />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">This Week</h2>
            <div className="text-lg font-bold text-gray-900">{weekScrapKg.toFixed(1)} kg scrap</div>
          </div>
        </div>
        <div className="flex gap-6">
          <div>
            <div className="text-sm text-gray-500">Value Lost</div>
            <div className="text-lg font-bold text-[var(--color-brand-red)]">{formatCurrency(weekLoss)}</div>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div>
            <div className="text-sm text-gray-500">Resale Value</div>
            <div className="text-lg font-bold text-[var(--color-brand-emerald)]">{formatCurrency(weekResale)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Entry Form */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Log Scrap</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Shift</label>
                <select value={shift} onChange={e => setShift(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm">
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Night</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Material</label>
              <select value={material} onChange={e => setMaterial(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm">
                <option>Aluminium</option>
                <option>Steel</option>
                <option>Brass</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Input (kg)</label>
                <input type="number" step="0.1" value={inputKg} onChange={e => setInputKg(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Good Output (kg)</label>
                <input type="number" step="0.1" value={outputKg} onChange={e => setOutputKg(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm" />
              </div>
            </div>

            {input > 0 && output > 0 && (
              <div className={cn(
                "p-4 rounded-md border mt-2",
                isHighScrap ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Scrap Generated:</span>
                  <span className="font-bold">{scrap.toFixed(1)} kg ({scrapPct.toFixed(1)}%)</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Yield:</span>
                  <span className="font-bold">{yieldPct.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Est. ₹ Lost:</span>
                  <span className="font-bold text-[var(--color-brand-red)]">{formatCurrency(lossValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Resale Value:</span>
                  <span className="font-bold text-[var(--color-brand-emerald)]">{formatCurrency(resaleValue)}</span>
                </div>
                {isHighScrap && (
                  <div className="mt-2 text-xs text-[var(--color-brand-red)] flex items-center gap-1 font-medium">
                    <AlertCircle size={14} /> Exceeds {benchmark}% benchmark
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={input <= 0 || output <= 0 || input < output} className="w-full btn-primary disabled:opacity-50 mt-4">
              Log Scrap
            </button>
          </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Scrap Logs</h3>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Date</th>
                  <th className="px-4 py-3">Shift</th>
                  <th className="px-4 py-3">Material</th>
                  <th className="px-4 py-3 text-right">Scrap %</th>
                  <th className="px-4 py-3 text-right">₹ Loss</th>
                  <th className="px-4 py-3 text-right rounded-tr-md">₹ Resale</th>
                </tr>
              </thead>
              <tbody>
                {scrapLogs.slice(0, 10).map(log => (
                  <tr key={log.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{new Date(log.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}</td>
                    <td className="px-4 py-3 text-gray-500">{log.shift}</td>
                    <td className="px-4 py-3 text-gray-900">{log.material}</td>
                    <td className={cn(
                      "px-4 py-3 text-right font-medium",
                      log.scrap_pct > benchmark ? "text-[var(--color-brand-red)]" : "text-[var(--color-brand-emerald)]"
                    )}>
                      {log.scrap_pct.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(log.loss_inr)}</td>
                    <td className="px-4 py-3 text-right text-gray-500">{formatCurrency(log.resale_inr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 p-3 rounded-md flex items-start gap-3">
            <AlertCircle className="text-[var(--color-brand-amber)] flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-gray-700">
              Your scrap losses this week are equivalent to <strong className="text-gray-900">{equivalentMachineDays} CNC machine-days</strong> of wasted production.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
