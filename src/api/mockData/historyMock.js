/**
 * History Mock Data - Date mock pentru istoric
 */

// Mock data pentru history
export const historyMock = {
  id: 'history-001',
  events: [
    {
      id: 'hist-001',
      type: 'appointment',
      action: 'created',
      timestamp: '2024-01-15T10:00:00Z',
      details: 'Appointment created for Maria Popescu'
    },
    {
      id: 'hist-002',
      type: 'sale',
      action: 'completed',
      timestamp: '2024-01-15T09:30:00Z',
      details: 'Sale completed for Ion Ionescu'
    }
  ]
};

/**
 * Funcție pentru obținerea datelor istoric
 */
export function getHistoryMock(businessType = null) {
  return historyMock;
}

export default {
  historyMock,
  getHistoryMock
}; 