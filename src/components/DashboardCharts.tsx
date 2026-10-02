"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export function SpendingPieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No expense data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
             <Cell key={`cell-${index}`} fill={entry.color} className="stroke-background hover:opacity-80 transition-opacity outline-none" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
          formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SpendingBarChart({ data }: { data: { name: string; spent: number }[] }) {
  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No transaction data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.2} />
        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`} />
        <Tooltip 
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333', borderRadius: '8px' }}
          formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Spent']}
        />
        <Bar dataKey="spent" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
