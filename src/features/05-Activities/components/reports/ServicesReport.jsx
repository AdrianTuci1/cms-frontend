import React from 'react';
import { MdPieChart, MdShowChart, MdTrendingUp } from 'react-icons/md';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import styles from '../../views/02-Reports/ReportsView.module.css';
// import { DASHBOARD_DATA } from '../../../data/dashboardData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className={styles.tooltipValue} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()} RON
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ServicesReport() {
  // Mock data to replace DASHBOARD_DATA
  const categories = [
    { name: 'Dental Cleaning', value: 2500, color: '#3b82f6', icon: '🦷' },
    { name: 'Root Canal', value: 8000, color: '#ef4444', icon: '🔧' },
    { name: 'Crown', value: 12000, color: '#10b981', icon: '👑' },
    { name: 'Whitening', value: 3500, color: '#f59e0b', icon: '✨' }
  ];

  return (
    <>
      <div className={styles.bentoCard} style={{ gridColumn: '1 / 2', gridRow: '1 / 2' }}>
        <div className={styles.bentoCardTitle}><MdPieChart size={32} color="#3b82f6" /></div>
        <div style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value.toLocaleString()} RON`}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.bentoLegendRow}>
          {categories.map(service => (
            <span key={service.name} className={styles.bentoLegendItem} style={{ color: service.color }}>
              <span style={{ fontSize: 18, marginRight: 4 }}>{service.icon}</span> {service.name}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.bentoCard} style={{ gridColumn: '2 / span 2', gridRow: '1 / 2' }}>
        <div className={styles.bentoCardTitle}><MdShowChart size={32} color="#3b82f6" /></div>
        <div style={{ height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                stroke="#64748b"
                tick={{ fontSize: 13 }}
              />
              <YAxis 
                stroke="#64748b"
                tick={{ fontSize: 13 }}
                tickFormatter={(value) => `${value.toLocaleString()} RON`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {categories.map((service, index) => (
                <Line 
                  key={service.name}
                  type="monotone" 
                  dataKey="value" 
                  name={service.name}
                  stroke={service.color}
                  strokeWidth={2}
                  dot={{ r: 4, fill: service.color }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.bentoCard} style={{ gridColumn: '1 / span 3', gridRow: '2 / 3' }}>
        <div className={styles.bentoCardTitle}><MdTrendingUp size={32} color="#3b82f6" /></div>
        <div className={styles.statsGrid}>
          {categories.map(service => (
            <div key={service.name} className={styles.statItem}>
              <span className={styles.statLabel}>{service.name}</span>
              <span className={styles.statValue}>
                {service.value.toLocaleString()} RON
              </span>
              <span className={styles.statTrend} style={{ color: service.color }}>
                {((service.value / categories.reduce((sum, s) => sum + s.value, 0)) * 100).toFixed(1)}% din total
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 