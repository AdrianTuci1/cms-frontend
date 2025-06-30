import React from 'react';
import { MdShowChart, MdTrendingUp, MdAnalytics } from 'react-icons/md';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import styles from '../ReportsView.module.css';
import { DASHBOARD_DATA } from '../../../data/dashboardData';

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

export default function TrendsReport() {
  const { data: trends } = DASHBOARD_DATA.DENTAL_CLINIC.reports.trends;

  return (
    <>
      <div className={styles.bentoCard} style={{ gridColumn: '1 / span 2', gridRow: '1 / 2', width: '100%' }}>
        <div className={styles.bentoCardTitle}><MdShowChart size={32} color="#3b82f6" /></div>
        <div style={{ height: 350, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
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
              <Area 
                type="monotone" 
                dataKey="value" 
                name="Venit"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.bentoOverview} style={{ gridColumn: '3 / 4', gridRow: '1 / 2' }}>
        <div className={styles.bentoOverviewRow}>
          <span className={styles.iconBlue}>💙</span>
          <span>Venit Total</span>
          <span className={styles.value}>
            {trends.reduce((sum, month) => sum + month.value, 0).toLocaleString()} RON
          </span>
        </div>
        <div className={styles.bentoOverviewRow}>
          <span className={styles.iconGreen}>💚</span>
          <span>Medie Lunară</span>
          <span className={styles.value}>
            {(trends.reduce((sum, month) => sum + month.value, 0) / trends.length).toLocaleString()} RON
          </span>
        </div>
        <div className={styles.bentoOverviewRow}>
          <span className={styles.iconChart}>📈</span>
          <span>Crestere Totală</span>
          <span className={styles.value}>
            {((trends[trends.length - 1].value - trends[0].value) / trends[0].value * 100).toFixed(1)}%
          </span>
        </div>
        <div className={styles.bentoOverviewRow}>
          <span className={styles.iconChart}>🎯</span>
          <span>Luna Maximă</span>
          <span className={styles.value}>
            {trends.reduce((max, month) => Math.max(max, month.value), 0).toLocaleString()} RON
          </span>
        </div>
      </div>

      <div className={styles.bentoCard} style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
        <div className={styles.bentoCardTitle}><MdTrendingUp size={32} color="#3b82f6" /></div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
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
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Venit"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.bentoCard} style={{ gridColumn: '2 / span 2', gridRow: '2 / 3' }}>
        <div className={styles.bentoCardTitle}><MdAnalytics size={32} color="#3b82f6" /></div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Crestere Lunară Medie</span>
            <span className={styles.statValue}>
              {((trends[trends.length - 1].value - trends[0].value) / trends[0].value * 100 / trends.length).toFixed(1)}%
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Luna Maximă</span>
            <span className={styles.statValue}>
              {trends.reduce((max, month) => Math.max(max, month.value), 0).toLocaleString()} RON
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Luna Minimă</span>
            <span className={styles.statValue}>
              {trends.reduce((min, month) => Math.min(min, month.value), Infinity).toLocaleString()} RON
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Tendință</span>
            <span className={styles.statValue}>
              {trends[trends.length - 1].value > trends[trends.length - 2].value ? 'Ascendentă' : 'Descendentă'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
} 