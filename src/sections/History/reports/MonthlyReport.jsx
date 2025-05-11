import React from 'react';
import { MdBarChart, MdPieChart, MdShowChart, MdTrendingUp } from 'react-icons/md';
import {
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
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

export default function MonthlyReport() {
  const { profit, preferredTreatments } = DASHBOARD_DATA.DENTAL_CLINIC.reports.monthly;
  
  // Demo data for occupancy chart
  const occupancyData = [
    { month: 'Ian', occupancy: 75, estimatedOccupancy: 70 },
    { month: 'Feb', occupancy: 82, estimatedOccupancy: 75 },
    { month: 'Mar', occupancy: 78, estimatedOccupancy: 80 },
    { month: 'Apr', occupancy: 85, estimatedOccupancy: 80 },
    { month: 'Mai', occupancy: 90, estimatedOccupancy: 85 },
    { month: 'Iun', occupancy: 88, estimatedOccupancy: 90 },
    { month: 'Iul', occupancy: 80, estimatedOccupancy: 85 },
    { month: 'Aug', occupancy: 70, estimatedOccupancy: 75 },
    { month: 'Sep', occupancy: 85, estimatedOccupancy: 80 },
    { month: 'Oct', occupancy: 87, estimatedOccupancy: 85 },
    { month: 'Nov', occupancy: 91, estimatedOccupancy: 85 },
    { month: 'Dec', occupancy: 95, estimatedOccupancy: 90 }
  ];

  return (
    <>
      <div className={styles.bentoCard} style={{ gridColumn: '1 / span 3', gridRow: '1 / 2', width: '100%' }}>
        <div className={styles.bentoCardTitle}><MdBarChart size={32} color="#3b82f6" /></div>
        <div style={{ display: 'flex', height: 350, width: '100%' }}>
          <div style={{ flex: '2', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={profit}>
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
                  domain={['dataMin', 'dataMax']}
                  ticks={[
                    Math.min(...profit.map(item => Math.min(item.profit, item.estimatedProfit))),
                    Math.max(...profit.map(item => Math.max(item.profit, item.estimatedProfit)))
                  ]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  name="Profit Realizat"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3b82f6" }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="estimatedProfit" 
                  name="Profit Estimat"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: "#94a3b8" }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={{ width: '1px', backgroundColor: '#e2e8f0', margin: '0 20px' }} />
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className={styles.bentoOverviewRow} style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Profit Realizat</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
                  {profit.reduce((sum, m) => sum + m.profit, 0).toLocaleString()} RON
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: profit[5].profit > profit[4].profit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                padding: '4px 8px', 
                borderRadius: '12px',
                alignSelf: 'center'
              }}>
                <span style={{ 
                  color: profit[5].profit > profit[4].profit ? '#10b981' : '#ef4444', 
                  fontSize: '14px', 
                  fontWeight: 'bold' 
                }}>
                  {profit[5].profit > profit[4].profit ? '+' : ''}{((profit[5].profit - profit[4].profit) / profit[4].profit * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className={styles.bentoOverviewRow} style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Profit Estimat</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
                  {profit.reduce((sum, m) => sum + m.estimatedProfit, 0).toLocaleString()} RON
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: profit[5].estimatedProfit > profit[4].estimatedProfit ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                padding: '4px 8px', 
                borderRadius: '12px',
                alignSelf: 'center'
              }}>
                <span style={{ 
                  color: profit[5].estimatedProfit > profit[4].estimatedProfit ? '#10b981' : '#ef4444', 
                  fontSize: '14px', 
                  fontWeight: 'bold' 
                }}>
                  {profit[5].estimatedProfit > profit[4].estimatedProfit ? '+' : ''}{((profit[5].estimatedProfit - profit[4].estimatedProfit) / profit[4].estimatedProfit * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className={styles.bentoOverviewRow} style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', color: '#64748b' }}>Profit Net</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
                  {(profit.reduce((sum, m) => sum + m.profit, 0) - profit.reduce((sum, m) => sum + m.estimatedProfit, 0)).toLocaleString()} RON
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: (profit[5].profit - profit[5].estimatedProfit) > (profit[4].profit - profit[4].estimatedProfit) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                padding: '4px 8px', 
                borderRadius: '12px',
                alignSelf: 'center'
              }}>
                <span style={{ 
                  color: (profit[5].profit - profit[5].estimatedProfit) > (profit[4].profit - profit[4].estimatedProfit) ? '#10b981' : '#ef4444', 
                  fontSize: '14px', 
                  fontWeight: 'bold' 
                }}>
                  {(profit[5].profit - profit[5].estimatedProfit) > (profit[4].profit - profit[4].estimatedProfit) ? '+' : ''}{(((profit[5].profit - profit[5].estimatedProfit) - (profit[4].profit - profit[4].estimatedProfit)) / Math.abs(profit[4].profit - profit[4].estimatedProfit) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bentoCard} style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }}>
        <div className={styles.bentoCardTitle}><MdShowChart size={32} color="#3b82f6" /></div>
        <div style={{ height: 260 }}>
          <div style={{ textAlign: 'left', marginBottom: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#64748b' }}>
              {profit.reduce((sum, m) => sum + m.profit, 0).toLocaleString()} RON
            </div>
            <div style={{ fontSize: 14, color: '#64748b' }}>Profit Total</div>
          </div>
          
          {/* Custom progress bar */}
          <div style={{ marginBottom: 20 }}>
            {(() => {
              const lastMonth = profit[profit.length - 1];
              const total = lastMonth.card + lastMonth.cash + lastMonth.products;
              const cardPercent = (lastMonth.card / total) * 100;
              const cashPercent = (lastMonth.cash / total) * 100;
              const productsPercent = (lastMonth.products / total) * 100;
              
              return (
                <div style={{ width: '100%', height: '24px', borderRadius: '12px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${cardPercent}%`, height: '100%', backgroundColor: '#10b981' }} />
                  <div style={{ width: `${cashPercent}%`, height: '100%', backgroundColor: '#f59e0b' }} />
                  <div style={{ width: `${productsPercent}%`, height: '100%', backgroundColor: '#8b5cf6' }} />
                </div>
              );
            })()}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10b981', marginRight: 8 }} />
                <span>Card</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: '#64748b' }}>
                {profit[5].card.toLocaleString()} RON
              </div>
              <div style={{ fontSize: 14, color: profit[5].card > profit[4].card ? '#10b981' : '#ef4444' }}>
                {((profit[5].card - profit[4].card) / profit[4].card * 100).toFixed(1)}%
              </div>
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#f59e0b', marginRight: 8 }} />
                <span>Numerar</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: '#64748b' }}>
                {profit[5].cash.toLocaleString()} RON
              </div>
              <div style={{ fontSize: 14, color: profit[5].cash > profit[4].cash ? '#10b981' : '#ef4444' }}>
                {((profit[5].cash - profit[4].cash) / profit[4].cash * 100).toFixed(1)}%
              </div>
            </div>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#8b5cf6', marginRight: 8 }} />
                <span>Produse</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: '#64748b' }}>
                {profit[5].products.toLocaleString()} RON
              </div>
              <div style={{ fontSize: 14, color: profit[5].products > profit[4].products ? '#10b981' : '#ef4444' }}>
                {((profit[5].products - profit[4].products) / profit[4].products * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bentoCard} style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }}>
        <div className={styles.bentoCardTitle}><MdPieChart size={32} color="#3b82f6" /></div>
        <div style={{ height: 260, display: 'flex' }}>
          <div style={{ width: '65%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={preferredTreatments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {preferredTreatments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value} pacienți`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 20, fontWeight: 'bold', color: '#64748b' }}>
                {preferredTreatments.reduce((sum, item) => sum + item.value, 0)}
              </div>
              <div style={{ fontSize: 14, color: '#94a3b8' }}>total</div>
            </div>
          </div>
          <div style={{ width: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {preferredTreatments.map((treatment, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: treatment.color, 
                  marginRight: 8,
                  marginTop: 3
                }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 14, fontWeight: 'medium', lineHeight: '1.2', color: '#000000' }}>{treatment.name}</span>
                  <span style={{ fontSize: 12, color: '#64748b', lineHeight: '1.2' }}>{treatment.value} pacienți</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bentoCard} style={{ gridColumn: '3 / 4', gridRow: '2 / 3' }}>
        <div className={styles.bentoCardTitle}><MdTrendingUp size={32} color="#3b82f6" /></div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={occupancyData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748b"
                tick={{ fontSize: 13 }}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                domain={[0, 100]}
                hide={true}
              />
              <Tooltip formatter={(value) => [`${value}%`, 'Grad ocupare']} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="occupancy" 
                name="Ocupare Reală"
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                activeDot={{ r: 6 }}
              />
              <Area 
                type="monotone" 
                dataKey="estimatedOccupancy" 
                name="Ocupare Estimată"
                stroke="#94a3b8" 
                fill="#94a3b8" 
                fillOpacity={0.3}
                strokeDasharray="5 5"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
} 