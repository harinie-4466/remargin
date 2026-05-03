import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { Camera, Loader2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { cn, formatCurrency } from '../utils';

export const Upload = () => {
  const navigate = useNavigate();
  const { factory, machines, shiftLogs, addShiftLog } = useAppData();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [shift, setShift] = useState<'Morning' | 'Afternoon' | 'Night'>('Morning');
  const [machineId, setMachineId] = useState(machines[0]?.id || '');
  
  const [startReading, setStartReading] = useState('');
  const [endReading, setEndReading] = useState('');
  const [partsProduced, setPartsProduced] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Calculations
  const start = parseFloat(startReading) || 0;
  const end = parseFloat(endReading) || 0;
  const parts = parseInt(partsProduced) || 0;
  
  const energyUsed = end > start ? end - start : 0;
  const cost = energyUsed * (factory?.tariff_per_kwh || 7.5);
  const kwhPerPart = parts > 0 ? energyUsed / parts : 0;
  
  const benchmark = factory?.benchmark_kwh_per_part || 2.6;
  const idealEnergy = parts * benchmark;
  const excessEnergy = energyUsed > idealEnergy ? energyUsed - idealEnergy : 0;
  const moneyLost = excessEnergy * (factory?.tariff_per_kwh || 7.5);

  const isHighLoss = kwhPerPart > benchmark * 1.1; // 10% tolerance

  const simulateOCR = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      // Simulate reading a realistic end value based on start
      const mockEnd = start > 0 ? start + 184 : 1847;
      setEndReading(mockEnd.toString());
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (energyUsed <= 0 || parts <= 0 || !machineId) return;

    addShiftLog({
      id: `sl_${Date.now()}`,
      factory_id: factory?.id || '',
      machine_id: machineId,
      date,
      shift_type: shift,
      start_reading: start,
      end_reading: end,
      parts_produced: parts,
      energy_kwh: energyUsed,
      cost_inr: cost,
      loss_inr: moneyLost,
      notes: ''
    });

    setToastMsg(`Shift logged. ${moneyLost > 0 ? `₹${moneyLost.toFixed(0)} in losses flagged.` : 'Excellent efficiency!'}`);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-in slide-in-from-top-10 fade-in duration-300">
          <CheckCircle2 size={20} className="text-[var(--color-brand-emerald)]" />
          <span className="font-medium text-sm">{toastMsg}</span>
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          Energy Tracker
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Entry Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Log Shift Data</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Controls */}
          <div className="space-y-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['Morning', 'Afternoon', 'Night'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setShift(s as any)}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                    shift === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Machine</label>
                <select 
                  value={machineId} 
                  onChange={e => setMachineId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm"
                >
                  {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Upload Zone */}
          <div>
            <button 
              type="button"
              onClick={simulateOCR}
              disabled={isUploading}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-bg)] transition-colors"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin mb-3" size={32} />
                  <span className="font-medium">Reading your meter...</span>
                </>
              ) : (
                <>
                  <Camera className="mb-3" size={32} />
                  <span className="font-medium text-center">Take a photo of the electric meter</span>
                  <span className="text-xs mt-1 opacity-70">Auto-fills the end reading</span>
                </>
              )}
            </button>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Reading (kWh)</label>
                <input 
                  type="number" 
                  value={startReading} 
                  onChange={e => setStartReading(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-lg font-mono" 
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Reading (kWh)</label>
                <input 
                  type="number" 
                  value={endReading} 
                  onChange={e => setEndReading(e.target.value)}
                  placeholder="e.g. 1184"
                  className={cn(
                    "w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-lg font-mono transition-colors",
                    isUploading && "bg-gray-100 text-gray-400"
                  )} 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Parts Produced</label>
              <input 
                type="number" 
                value={partsProduced} 
                onChange={e => setPartsProduced(e.target.value)}
                placeholder="e.g. 100"
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-lg font-mono" 
              />
            </div>
          </div>

          {/* Preview Card */}
          {energyUsed > 0 && parts > 0 && (
            <div className={cn(
              "p-4 rounded-lg border animate-in slide-in-from-bottom-4 fade-in",
              isHighLoss ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"
            )}>
              <div className="grid grid-cols-2 gap-y-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Energy Used</div>
                  <div className="text-xl font-bold text-gray-900">{energyUsed.toFixed(1)} <span className="text-sm font-normal text-gray-500">kWh</span></div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Cost</div>
                  <div className="text-xl font-bold text-gray-900">{formatCurrency(cost)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Per Part</div>
                  <div className="text-xl font-bold text-gray-900">{kwhPerPart.toFixed(1)} <span className="text-sm font-normal text-gray-500">kWh</span></div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">vs Benchmark</div>
                  <div className={cn(
                    "text-sm font-bold flex items-center h-full",
                    isHighLoss ? "text-[var(--color-brand-red)]" : "text-[var(--color-brand-emerald)]"
                  )}>
                    {isHighLoss ? <AlertTriangle size={16} className="mr-1" /> : <CheckCircle2 size={16} className="mr-1" />}
                    {isHighLoss ? `${(((kwhPerPart - benchmark)/benchmark)*100).toFixed(0)}% above ideal` : 'Within limits'}
                  </div>
                </div>
              </div>
              
              {moneyLost > 0 && (
                <div className="mt-3 pt-3 border-t border-red-200/50 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">Est. money lost to inefficiency:</span>
                  <span className="text-lg font-bold text-[var(--color-brand-red)]">{formatCurrency(moneyLost)}</span>
                </div>
              )}
            </div>
          )}

          <button 
            type="submit" 
            disabled={energyUsed <= 0 || parts <= 0 || !machineId || isUploading}
            className="w-full btn-primary text-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            Submit Shift Data <ArrowRight size={20} />
          </button>
        </form>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Energy Logs</h3>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Date</th>
                  <th className="px-4 py-3">Machine</th>
                  <th className="px-4 py-3">Shift</th>
                  <th className="px-4 py-3 text-right">Parts</th>
                  <th className="px-4 py-3 text-right">Energy (kWh)</th>
                  <th className="px-4 py-3 text-right">₹ Cost</th>
                  <th className="px-4 py-3 text-right rounded-tr-md">₹ Loss</th>
                </tr>
              </thead>
              <tbody>
                {shiftLogs.slice(0, 10).map(log => {
                  const m = machines.find(machine => machine.id === log.machine_id);
                  return (
                    <tr key={log.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{new Date(log.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short'})}</td>
                      <td className="px-4 py-3 text-gray-900">{m?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-gray-500">{log.shift_type}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{log.parts_produced}</td>
                      <td className="px-4 py-3 text-right font-medium">{log.energy_kwh.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(log.cost_inr)}</td>
                      <td className={cn(
                        "px-4 py-3 text-right font-medium",
                        log.loss_inr > 0 ? "text-[var(--color-brand-red)]" : "text-[var(--color-brand-emerald)]"
                      )}>
                        {log.loss_inr > 0 ? formatCurrency(log.loss_inr) : '₹0'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
