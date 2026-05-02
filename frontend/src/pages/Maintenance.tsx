import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { Wrench, AlertTriangle } from 'lucide-react';
import { cn, formatCurrency } from '../utils';

export const Maintenance = () => {
  const { factory, machines, alerts } = useAppData();
  const navigate = useNavigate();

  const today = new Date();
  
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Wrench className="text-[var(--color-brand-primary)]" />
          Maintenance Hub
        </h2>
        <button onClick={() => navigate('/actions')} className="btn-primary py-2 px-4 text-sm">
          Log an Action
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Machine Health List */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-bold text-gray-900">Machine Health</h3>
          </div>
          <div className="divide-y divide-gray-100 flex-1 overflow-y-auto max-h-[600px]">
            {machines.map(m => {
              const lastMaint = new Date(m.last_maintenance_date);
              const diffTime = Math.abs(today.getTime() - lastMaint.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isOverdue = diffDays > (factory?.maintenance_interval_days || 30);
              
              // Find linked alert if any
              const linkedAlert = alerts.find(a => a.machine_id === m.id && !a.resolved_at && a.type === 'Energy');

              return (
                <div key={m.id} className={cn(
                  "p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:bg-gray-50",
                  isOverdue ? "bg-red-50/30" : ""
                )}>
                  <div>
                    <h4 className="font-bold text-gray-900">{m.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Last maintained: <span className={isOverdue ? "text-[var(--color-brand-red)] font-medium" : ""}>{diffDays} days ago</span>
                    </p>
                    {linkedAlert && (
                      <p className="text-xs font-medium text-[var(--color-brand-amber)] mt-1 flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Losing {formatCurrency(linkedAlert.loss_inr)}/day due to inefficiency
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium border",
                      isOverdue 
                        ? "bg-red-100 text-[var(--color-brand-red)] border-red-200" 
                        : "bg-emerald-100 text-[var(--color-brand-emerald)] border-emerald-200"
                    )}>
                      {isOverdue ? 'Overdue' : 'Healthy'}
                    </span>
                    <button 
                      onClick={() => navigate(`/actions?machineId=${m.id}`)}
                      className="text-sm font-medium text-[var(--color-brand-primary)] hover:underline ml-auto"
                    >
                      Log Maint.
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
