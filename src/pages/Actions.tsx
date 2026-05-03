import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { Wrench, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { cn, formatCurrency } from '../utils';

export const Actions = () => {
  const { machines, alerts, fixLogs, resolveAlert } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [machineId, setMachineId] = useState(machines[0]?.id || '');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [technician, setTechnician] = useState('');

  useEffect(() => {
    const alertId = searchParams.get('alertId');
    if (alertId) {
      const alert = alerts.find(a => a.id === alertId);
      if (alert) {
        setSelectedAlertId(alert.id);
        setMachineId(alert.machine_id);
      }
    }
    
    const mId = searchParams.get('machineId');
    if (mId) {
      setMachineId(mId);
    }
    
    if (alertId || mId) {
      setSearchParams({});
    }
  }, [searchParams, alerts, setSearchParams]);

  const handleLogFix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machineId || !description || !actionTaken) return;

    const newFix = {
      id: `fix_${Date.now()}`,
      alert_id: selectedAlertId || '',
      machine_id: machineId,
      description,
      action_taken: actionTaken,
      parts_replaced: '',
      technician,
      date: new Date().toISOString().split('T')[0],
      verified: false,
    };

    if (selectedAlertId) {
      resolveAlert(selectedAlertId, newFix);
    }

    // Reset form but keep selected machine
    setSelectedAlertId(null);
    setDescription('');
    setActionTaken('');
    setTechnician('');
  };

  // Generate unified feed from Fixes and Alerts
  const feedItems = [
    ...fixLogs.map(f => ({
      id: f.id,
      date: new Date(f.date),
      type: 'fix',
      machine: machines.find(m => m.id === f.machine_id)?.name || '',
      content: f.action_taken,
      verified: f.verified,
      resolved: undefined,
      loss: undefined,
      alertId: undefined,
      mId: undefined
    })),
    ...alerts.map(a => ({
      id: a.id,
      date: new Date(a.created_at),
      type: 'alert',
      machine: machines.find(m => m.id === a.machine_id)?.name || '',
      content: a.message,
      resolved: !!a.resolved_at,
      loss: a.loss_inr,
      alertId: a.id,
      mId: a.machine_id,
      verified: undefined
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="text-[var(--color-brand-primary)]" />
          Fix Tracker
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Entry Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Log a Fix / Action</h3>
          
          <form onSubmit={handleLogFix} className="space-y-4">
            {selectedAlertId && (
              <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-sm mb-4 border border-amber-200">
                You are logging a fix for an active alert. This will mark the alert as resolved.
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Machine</label>
              <select 
                value={machineId} 
                onChange={e => {
                  setMachineId(e.target.value);
                  setSelectedAlertId(null);
                }} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm"
              >
                {machines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
              <input required type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Worn cutting tool causing excess friction" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Taken</label>
              <textarea required value={actionTaken} onChange={e => setActionTaken(e.target.value)} placeholder="e.g. Replaced tool bit and calibrated Z-axis" rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm resize-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technician Name</label>
              <input required type="text" value={technician} onChange={e => setTechnician(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none text-sm" />
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full btn-primary py-2 text-sm">Submit Fix</button>
            </div>
          </form>
        </div>

        {/* Timeline Feed */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Fix History</h3>
          
          <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 flex-1 overflow-y-auto pr-2 max-h-[600px]">
            {feedItems.map(item => (
              <div key={item.id} className="relative pl-6">
                <div className={cn(
                  "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center",
                  item.type === 'fix' && item.verified ? "bg-[var(--color-brand-emerald)]" : 
                  item.type === 'fix' ? "bg-blue-500" :
                  item.resolved ? "bg-gray-300" : "bg-[var(--color-brand-red)]"
                )}>
                  {item.type === 'fix' && item.verified && <CheckCircle2 size={10} className="text-white" />}
                  {item.type === 'fix' && !item.verified && <Clock size={10} className="text-white" />}
                </div>
                
                <div className="mb-1 text-xs text-gray-500">
                  {item.date.toLocaleDateString('en-IN', {month:'short', day:'numeric'})} · {item.machine}
                </div>
                
                {item.type === 'fix' ? (
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-sm text-gray-900 font-medium">{item.content}</p>
                    <p className="text-xs mt-1 text-gray-500">
                      {item.verified ? "Verified: Efficiency restored" : "Awaiting next shift data to verify"}
                    </p>
                  </div>
                ) : (
                  <div className={cn(
                    "rounded-lg p-3 border",
                    item.resolved ? "bg-gray-50 border-gray-100 opacity-60" : "bg-red-50 border-red-100"
                  )}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={14} className={item.resolved ? "text-gray-400" : "text-[var(--color-brand-red)]"} />
                      <div>
                        <p className="text-sm text-gray-900 font-medium">{item.content}</p>
                        {!item.resolved && (
                          <button 
                            onClick={() => {
                              setSelectedAlertId(item.alertId || null);
                              setMachineId(item.mId || '');
                            }}
                            className="mt-2 text-xs font-medium text-[var(--color-brand-primary)] bg-white px-2 py-1 rounded shadow-sm hover:shadow"
                          >
                            Log Fix
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
