/**
 * History Mock Data - Date mock pentru istoric
 */

/**
 * As avea cateva modificari de adus aici. Trebuie sa:
 * 1. afisam date despre user-ul care a facut o anumita actiune (nume, rol, avatar)
 * 2. sa afisam un status pentru actiunea respectiva: finalizat, in curs, anulat
 * 3. detaliile vor fi sub forma: "{type} {action} on {serviceName}"
 * 4. filtrare dupa tip de actiune
 * 5. vom tine doar evenimentele din ziua curenta
 * 6. anumite actiuni sunt reversibile, deci vom avea o actiune de undo
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