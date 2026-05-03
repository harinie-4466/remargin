import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Save, AlertTriangle, Download, Trash2, ShieldAlert } from 'lucide-react';
import { cn } from '../utils';

export const Settings = () => {
  const { user, factory, updateFactory, resetData, shiftLogs } = useAppData();
  const [activeTab, setActiveTab] = useState<'info' | 'machines' | 'benchmarks' | 'account'>('info');

  // Local state for edits
  const [fInfo, setFInfo] = useState({
    name: factory?.name || '',
    gstin: factory?.gstin || '',
    city: factory?.city || '',
    state: factory?.state || ''
  });

  const [mConfig, setMConfig] = useState({
    machines_count: factory?.machines_count || 1,
    shifts_per_day: factory?.shifts_per_day || 3,
    tariff_per_kwh: factory?.tariff_per_kwh || 7.5,
    rooftop_sqft: factory?.rooftop_sqft || 0
  });

  const [bMarks, setBMarks] = useState({
    benchmark_kwh_per_part: factory?.benchmark_kwh_per_part || 2.6,
    benchmark_scrap_pct: factory?.benchmark_scrap_pct || 8.0,
    maintenance_interval_days: factory?.maintenance_interval_days || 30
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'info') updateFactory(fInfo);
    if (activeTab === 'machines') updateFactory(mConfig);
    if (activeTab === 'benchmarks') updateFactory(bMarks);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportCSV = () => {
    // Generate simple CSV
    if (!shiftLogs.length) return;
    const header = Object.keys(shiftLogs[0]).join(',');
    const rows = shiftLogs.map(l => Object.values(l).join(','));
    const csv = [header, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'remargin_shift_data.csv';
    a.click();
  };

  const tabs = [
    { id: 'info', label: 'Factory Info' },
    { id: 'machines', label: 'Machine Config' },
    { id: 'benchmarks', label: 'Benchmarks' },
    { id: 'account', label: 'Account Data' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your factory profile and preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              activeTab === t.id 
                ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        
        {(activeTab === 'info' || activeTab === 'machines' || activeTab === 'benchmarks') && (
          <form onSubmit={handleSave} className="space-y-6">
            
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Factory Name</label>
                  <input type="text" value={fInfo.name} onChange={e => setFInfo({...fInfo, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN</label>
                  <input type="text" value={fInfo.gstin} onChange={e => setFInfo({...fInfo, gstin: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={fInfo.city} onChange={e => setFInfo({...fInfo, city: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" value={fInfo.state} onChange={e => setFInfo({...fInfo, state: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
              </div>
            )}

            {activeTab === 'machines' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of CNC Machines</label>
                  <input type="number" value={mConfig.machines_count} onChange={e => setMConfig({...mConfig, machines_count: +e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none bg-gray-50" disabled title="Contact support to change machine count" />
                  <p className="text-xs text-gray-400 mt-1">To add/remove machines, contact support.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shifts per Day</label>
                  <input type="number" value={mConfig.shifts_per_day} onChange={e => setMConfig({...mConfig, shifts_per_day: +e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Tariff (₹/kWh)</label>
                  <input type="number" step="0.1" value={mConfig.tariff_per_kwh} onChange={e => setMConfig({...mConfig, tariff_per_kwh: +e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rooftop Area (sq ft)</label>
                  <input type="number" value={mConfig.rooftop_sqft} onChange={e => setMConfig({...mConfig, rooftop_sqft: +e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                </div>
              </div>
            )}

            {activeTab === 'benchmarks' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm flex gap-3">
                  <AlertTriangle className="flex-shrink-0" size={20} />
                  <p>These benchmarks are used to calculate losses and efficiency scores. Default values are sourced from the BEE MSME Energy Study.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Energy (kWh/part)</label>
                    <input type="number" step="0.1" value={bMarks.benchmark_kwh_per_part} onChange={e => setBMarks({...bMarks, benchmark_kwh_per_part: +e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Scrap Rate (%)</label>
                    <input type="number" step="0.1" value={bMarks.benchmark_scrap_pct} onChange={e => setBMarks({...bMarks, benchmark_scrap_pct: +e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Interval (Days)</label>
                    <input type="number" value={bMarks.maintenance_interval_days} onChange={e => setBMarks({...bMarks, maintenance_interval_days: +e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--color-brand-primary)] outline-none" />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Save size={18} /> {isSaved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {activeTab === 'account' && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Account Info</h3>
              <p className="text-sm text-gray-500 mb-4">You are logged in as <span className="font-semibold">{user?.email}</span></p>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Data Export</h4>
                  <p className="text-sm text-gray-500 mt-1">Download all your raw data as CSV for your own records.</p>
                </div>
                <button onClick={handleExportCSV} className="btn-outline">
                  <Download size={18} /> Export CSV
                </button>
              </div>
            </div>

            <div className="border-t border-red-100 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-1 flex items-center gap-2">
                <ShieldAlert className="text-[var(--color-brand-red)]" /> Danger Zone
              </h3>
              <p className="text-sm text-gray-500 mb-4">Irreversible actions that will permanently affect your data.</p>
              
              <div className="border border-red-200 rounded-lg p-4 bg-red-50/50 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[var(--color-brand-red)]">Reset Application Data</h4>
                  <p className="text-sm text-red-700/80 mt-1">This will delete all local storage data, returning the app to its initial state.</p>
                </div>
                <button onClick={() => { if(window.confirm('Are you sure you want to delete all data and reset?')) resetData(); }} className="bg-white border border-[var(--color-brand-red)] text-[var(--color-brand-red)] font-medium py-2 px-4 rounded-md transition-colors hover:bg-red-50 flex items-center gap-2">
                  <Trash2 size={18} /> Reset Data
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
