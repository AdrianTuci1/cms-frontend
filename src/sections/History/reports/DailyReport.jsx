import React from 'react';
import { MdBarChart, MdCreditCard, MdPayments, MdInventory } from 'react-icons/md';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
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

export default function DailyReport() {
  const { sales } = DASHBOARD_DATA.DENTAL_CLINIC.reports.daily;

  return (
    <>
      <div className={styles.bentoCard} style={{ gridColumn: '1 / span 2', gridRow: '1 / 2', width: '100%' }}>
        <div className={styles.bentoCardTitle}><MdBarChart size={32} color="#3b82f6" /></div>
        <div style={{ height: 350, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="day" 
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
              <Bar 
                dataKey="card" 
                name="Card"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="cash" 
                name="Numerar"
                fill="#f59e0b"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="stock" 
                name="Produse"
                fill="#8b5cf6"
                radius={[8, 8, 0, 0]}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                name="Total"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, fill: "#3b82f6" }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.bentoOverview} style={{ gridColumn: '3 / 4', gridRow: '1 / 2' }}>
        <div className={styles.bentoOverviewRow}>
          <span className={styles.iconBlue}>💙</span>
          <span>Total Card</span>
          <span className={styles.value}>
            {sales.reduce((sum, day) => sum + day.card, 0).toLocaleString()} RON
          </span>
        </div>
        <div className={styles.bentoOverviewRow}>
          <span className={styles.iconGreen}>💚</span>
          <span>Total Numerar</span>
          <span className={styles.value}>
            {sales.reduce((sum, day) => sum + day.cash, 0).toLocaleString()} RON
          </span>
        </div>
        <div className={styles.bentoOverviewRow}>
          <span className={styles.iconChart}>📦</span>
          <span>Total Produse</span>
          <span className={styles.value}>
            {sales.reduce((sum, day) => sum + day.stock, 0).toLocaleString()} RON
          </span>
        </div>
        <div className={styles.bentoOverviewRow}>
          <span className={styles.iconChart}>💰</span>
          <span>Total Venit</span>
          <span className={styles.value}>
            {sales.reduce((sum, day) => sum + day.total, 0).toLocaleString()} RON
          </span>
        </div>
      </div>

      <div className={styles.bentoCard} style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
        <div className={styles.bentoCardTitle}><MdCreditCard size={32} color="#3b82f6" /></div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Medie Card/Zi</span>
            <span className={styles.statValue}>
              {(sales.reduce((sum, day) => sum + day.card, 0) / sales.length).toLocaleString()} RON
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Ziua Maximă Card</span>
            <span className={styles.statValue}>
              {sales.reduce((max, day) => Math.max(max, day.card), 0).toLocaleString()} RON
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Ziua Minimă Card</span>
            <span className={styles.statValue}>
              {sales.reduce((min, day) => Math.min(min, day.card), Infinity).toLocaleString()} RON
            </span>
          </div>
        </div>
      </div>

      <div className={styles.bentoCard} style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
        <div className={styles.bentoCardTitle}><MdPayments size={32} color="#3b82f6" /></div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Medie Numerar/Zi</span>
            <span className={styles.statValue}>
              {(sales.reduce((sum, day) => sum + day.cash, 0) / sales.length).toLocaleString()} RON
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Ziua Maximă Numerar</span>
            <span className={styles.statValue}>
              {sales.reduce((max, day) => Math.max(max, day.cash), 0).toLocaleString()} RON
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Ziua Minimă Numerar</span>
            <span className={styles.statValue}>
              {sales.reduce((min, day) => Math.min(min, day.cash), Infinity).toLocaleString()} RON
            </span>
          </div>
        </div>
      </div>

      <div className={styles.bentoCard} style={{ gridColumn: '3 / 4', gridRow: '2 / 3' }}>
        <div className={styles.bentoCardTitle}><MdInventory size={32} color="#3b82f6" /></div>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Medie Produse/Zi</span>
            <span className={styles.statValue}>
              {(sales.reduce((sum, day) => sum + day.stock, 0) / sales.length).toLocaleString()} RON
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Ziua Maximă Produse</span>
            <span className={styles.statValue}>
              {sales.reduce((max, day) => Math.max(max, day.stock), 0).toLocaleString()} RON
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Ziua Minimă Produse</span>
            <span className={styles.statValue}>
              {sales.reduce((min, day) => Math.min(min, day.stock), Infinity).toLocaleString()} RON
            </span>
          </div>
        </div>
      </div>
    </>
  );
} 