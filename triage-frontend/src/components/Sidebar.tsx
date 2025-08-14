import React from 'react';
import { Activity, Users, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navItems = [
    { href: '/', icon: Activity, label: 'Dashboard' },
    { href: '/queue', icon: Users, label: 'Patient Queue' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];
  return (
    <div className="w-64 bg-slate-900 text-white h-screen flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-700"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center"><Activity className="w-6 h-6 text-white" /></div><div><h1 className="text-xl font-bold">TriageAI</h1><p className="text-xs text-slate-400">Smart Healthcare</p></div></div></div>
      <nav className="flex-1 p-4"><ul className="space-y-2">{navItems.map((item) => { const isActive = location.pathname === item.href; return (<li key={item.label}><Link to={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800'}`}><item.icon className="w-5 h-5" />{item.label}</Link></li>);})}</ul></nav>
    </div>
  );
};
export default Sidebar;