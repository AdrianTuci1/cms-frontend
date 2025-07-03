/**
 * Reports Mock Data - Date mock pentru rapoarte
 */

// Mock data pentru reports
export const reportsMock = {
  id: 'reports-001',
  reports: [
    {
      id: 'rep-001',
      type: 'daily',
      date: '2024-01-15',
      data: {
        appointments: 10,
        sales: 1500,
        clients: 5
      }
    },
    {
      id: 'rep-002',
      type: 'monthly',
      date: '2024-01',
      data: {
        appointments: 250,
        sales: 45000,
        clients: 120
      }
    }
  ]
};

/**
 * Funcție pentru obținerea datelor rapoarte
 */
export function getReportsMock(businessType = null) {
  return reportsMock;
}

export default {
  reportsMock,
  getReportsMock
}; 