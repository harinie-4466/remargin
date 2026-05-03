import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  TrendingUp, Camera, ClipboardList,
  FileCheck, Sun, AlertTriangle, ArrowRight, CheckCircle2, Wrench
} from 'lucide-react';
import { cn, formatCurrency } from '../utils';

export const Dashboard = () => {
  const { factory, shiftLogs, scrapLogs, alerts, fixLogs, machines } = useAppData();
  const navigate = useNavigate();

  const activeAlerts = alerts.filter(a => !a.resolved_at);

  // Calculate metrics
  const {
    moneyLostYesterday,
    energyIntensity,
    scrapRateToday,
    esgScore,
    chartData,
    monthlyTotalLoss,
    potentialSavings,
    actionsCompleted,
    topMachineName,
    topMachineLoss
  } = useMemo(() => {
    if (!shiftLogs.length) return {
      moneyLostYesterday: 0,
      energyIntensity: 0,
      scrapRateToday: 0,
      esgScore: 68,
      chartData: [],
      monthlyTotalLoss: 0,
      potentialSavings: 0,
      actionsCompleted: 0,
      topMachineName: '',
      topMachineLoss: 0
    };

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    // Money lost yesterday
    const yesterdayLogs = shiftLogs.filter(l => l.date === yesterdayStr);
    const lostYesterday = yesterdayLogs.reduce((sum, l) => sum + l.loss_inr, 0);

    // Find worst performing machine yesterday
    const machineLosses: Record<string, number> = {};
    yesterdayLogs.forEach(l => {
      machineLosses[l.machine_id] = (machineLosses[l.machine_id] || 0) + l.loss_inr;
    });

    let topMId = '';
    let topMLoss = 0;
    Object.entries(machineLosses).forEach(([mId, loss]) => {
      if (loss > topMLoss) {
        topMLoss = loss;
        topMId = mId;
      }
    });

    // Fallback to active alerts if no shift loss yesterday
    if (topMLoss === 0 && activeAlerts.length > 0) {
      const topAlert = [...activeAlerts].sort((a, b) => b.loss_inr - a.loss_inr)[0];
      topMId = topAlert.machine_id;
      topMLoss = topAlert.loss_inr;
    }

    const topMachineName = machines.find(m => m.id === topMId)?.name || 'Unknown Machine';

    // Energy intensity (avg over last 7 days)
    const recentLogs = shiftLogs.slice(0, 100); // simplify
    const totalEnergy = recentLogs.reduce((sum, l) => sum + l.energy_kwh, 0);
    const totalParts = recentLogs.reduce((sum, l) => sum + l.parts_produced, 0);
    const intensity = totalParts > 0 ? totalEnergy / totalParts : 0;

    // Scrap rate today/yesterday
    const todayScrapLogs = scrapLogs.filter(l => l.date === todayStr || l.date === yesterdayStr);
    const totalInput = todayScrapLogs.reduce((sum, l) => sum + l.input_kg, 0);
    const totalScrap = todayScrapLogs.reduce((sum, l) => sum + l.scrap_kg, 0);
    const sRate = totalInput > 0 ? (totalScrap / totalInput) * 100 : 0;

    // Chart Data (Last 7 days energy)
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dLogs = shiftLogs.filter(l => l.date === dStr);
      const energy = dLogs.reduce((sum, l) => sum + l.energy_kwh, 0);
      const ideal = dLogs.reduce((sum, l) => sum + (l.parts_produced * (factory?.benchmark_kwh_per_part || 2.6)), 0);

      days.push({
        date: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        energy,
        ideal,
        isExcess: energy > ideal
      });
    }

    // Monthly Impact Calculations
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Monthly loss (shift + scrap)
    const monthlyShiftLoss = shiftLogs
      .filter(l => new Date(l.date).getMonth() === currentMonth && new Date(l.date).getFullYear() === currentYear)
      .reduce((sum, l) => sum + l.loss_inr, 0);
    const monthlyScrapLoss = scrapLogs
      .filter(l => new Date(l.date).getMonth() === currentMonth && new Date(l.date).getFullYear() === currentYear)
      .reduce((sum, l) => sum + l.loss_inr, 0);

    const monthlyTotalLoss = monthlyShiftLoss + monthlyScrapLoss;

    // Actions completed
    const actionsCompleted = fixLogs.filter(f => new Date(f.date).getMonth() === currentMonth && new Date(f.date).getFullYear() === currentYear).length;

    // Potential savings
    const alertLosses = activeAlerts.reduce((sum, a) => sum + a.loss_inr, 0);
    const potentialSavings = alertLosses * 30 + (monthlyTotalLoss * 0.15); // Rough estimate for "business value"

    return {
      moneyLostYesterday: lostYesterday,
      energyIntensity: intensity,
      scrapRateToday: sRate,
      esgScore: 68,
      chartData: days,
      monthlyTotalLoss,
      potentialSavings,
      actionsCompleted,
      topMachineName,
      topMachineLoss: topMLoss
    };
  }, [shiftLogs, scrapLogs, fixLogs, activeAlerts, factory, machines]);


  return (
    <div className="space-y-6">
      {/* Primary Insight Banner */}
      <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-none p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              You are losing <span className="text-[var(--color-brand-red)]">{formatCurrency(moneyLostYesterday)}/day</span>.
            </h2>
            <p className="text-gray-700 text-lg mt-1">
              Most of it is from <span className="font-semibold">{topMachineName}</span>.
              Fixing it can save <span className="font-semibold text-[var(--color-brand-emerald)]">{formatCurrency(topMachineLoss)}/day</span>.
            </p>
          </div>
          <button
            onClick={() => navigate('/actions')}
            className="w-full lg:w-auto bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
          >
            Go to Fix Tracker <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Stats Row */ }
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Card 1: Money lost */}
    <div className="bg-white p-6 rounded-none border border-gray-200 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-red)] opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">Money lost yesterday</h3>
      <div className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(moneyLostYesterday)}</div>
      <div className="flex items-center text-sm">
        <span className="flex items-center text-[var(--color-brand-red)] font-medium">
          <TrendingUp size={16} className="mr-1" /> ↑ ₹1,100
        </span>
        <span className="text-gray-400 ml-2">vs. last week</span>
      </div>
    </div>

    {/* Card 2: Energy Intensity */}
    <div className="bg-white p-6 rounded-none border border-gray-200 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-amber)] opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">Energy intensity</h3>
      <div className="text-3xl font-bold text-gray-900 mb-2">{energyIntensity.toFixed(1)} <span className="text-lg text-gray-500 font-normal">kWh/part</span></div>
      <div className="flex items-center text-sm">
        <span className="text-gray-500">Target: {factory?.benchmark_kwh_per_part} · </span>
        <span className="text-[var(--color-brand-amber)] font-medium ml-1">↑ High</span>
      </div>
    </div>

    {/* Card 3: Scrap Rate */}
    <div className="bg-white p-6 rounded-none border border-gray-200 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-red)] opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">Scrap rate today</h3>
      <div className="text-3xl font-bold text-gray-900 mb-2">{scrapRateToday.toFixed(1)}%</div>
      <div className="flex items-center text-sm">
        <span className="text-gray-500">Target: {factory?.benchmark_scrap_pct}% · </span>
        <span className="text-[var(--color-brand-red)] font-medium ml-1">↑ High</span>
      </div>
    </div>

    {/* Card 4: ESG Readiness */}
    <div className="bg-white p-6 rounded-none border border-gray-200 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-emerald)] opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">ESG readiness score</h3>
      <div className="flex items-baseline mb-2">
        <span className="text-3xl font-bold text-gray-900">{esgScore}</span>
        <span className="text-gray-500 ml-1">/100</span>
      </div>
      <div className="flex items-center text-sm">
        <span className="flex items-center text-[var(--color-brand-emerald)] font-medium">
          <TrendingUp size={16} className="mr-1" /> +4 pts
        </span>
        <span className="text-gray-400 ml-2">this month</span>
      </div>
    </div>
  </div>

  {/* Charts & Alerts Grid */ }
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Chart */}
    <div className="lg:col-span-2 bg-white rounded-none border border-gray-200 shadow-sm p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Energy use (kWh)</h3>
          <p className="text-sm text-gray-500">Last 7 days vs Target</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-brand-emerald)]"></div>
            <span>Ideal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--color-brand-red)]"></div>
            <span>Excess</span>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full flex items-center justify-center pt-8 pb-4 min-h-[360px]">
        <ResponsiveContainer width="95%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} />
            <Tooltip
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="ideal" fill="#10B981" radius={[4, 4, 0, 0]} name="Ideal" maxBarSize={50} />
            <Bar dataKey="energy" radius={[4, 4, 0, 0]} name="Actual" maxBarSize={50}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isExcess ? '#EF4444' : '#34D399'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Right Panel: Impact & Alerts */}
    <div className="flex flex-col gap-6">
      {/* Monthly Impact Card */}
      <div className="bg-[#112A20] text-white rounded-none shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-bl-[100px]"></div>
        <h3 className="text-xs font-bold text-[#34D399] mb-4 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp size={14} />
          This Month So Far
        </h3>

        <div className="space-y-4">
          <div>
            <div className="text-gray-400 text-sm mb-1">Total loss</div>
            <div className="text-2xl font-bold text-white">{formatCurrency(monthlyTotalLoss)}</div>
          </div>
          <div className="w-full h-px bg-white/10"></div>
          <div>
            <div className="text-gray-400 text-sm mb-1">Potential savings</div>
            <div className="text-xl font-bold text-[#34D399]">{formatCurrency(potentialSavings)}</div>
          </div>
          <div className="w-full h-px bg-white/10"></div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-gray-400 text-sm mb-1">Actions completed</div>
              <div className="text-xl font-bold text-white">{actionsCompleted}</div>
            </div>
            <button onClick={() => navigate('/reports')} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors">
              View Report
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="bg-white rounded-none border border-gray-200 shadow-sm p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Active Alerts</h3>
        <div className="flex-1 overflow-y-auto space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2 pb-10">
              <CheckCircle2 size={40} className="text-gray-300" />
              <p>No active alerts</p>
            </div>
          ) : (
            activeAlerts.map(alert => (
              <div key={alert.id} className="border border-gray-100 rounded-none p-4 bg-gray-50 relative overflow-hidden flex flex-col gap-3">
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1",
                  alert.type === 'Energy' ? 'bg-[var(--color-brand-red)]' :
                    alert.type === 'Maintenance' ? 'bg-[var(--color-brand-amber)]' : 'bg-blue-500'
                )} />
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-full mt-0.5",
                    alert.type === 'Energy' ? 'bg-red-100 text-[var(--color-brand-red)]' :
                      'bg-amber-100 text-[var(--color-brand-amber)]'
                  )}>
                    {alert.type === 'Energy' ? <AlertTriangle size={16} /> : <Wrench size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 leading-snug">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">Costing you ₹{alert.loss_inr}{alert.type === 'Maintenance' ? '/week' : ''}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/actions?alertId=${alert.id}`)}
                  className="self-end text-sm font-medium text-[var(--color-brand-primary)] flex items-center gap-1 hover:underline"
                >
                  Take Action <ArrowRight size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
    </div >
  );
};
