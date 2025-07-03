/**
 * Invoices Mock Data - Date mock pentru facturi
 */

// Mock data pentru invoices
export const invoicesMock = {
  id: 'invoices-001',
  invoices: [
    {
      id: 'inv-001',
      number: 'INV-2024-001',
      clientId: 'client-001',
      clientName: 'Maria Popescu',
      customer: 'Maria Popescu',
      amount: 150,
      totalAmount: 150,
      status: 'paid',
      date: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z',
      dueDate: '2024-01-30',
      businessType: 'dental'
    },
    {
      id: 'inv-002',
      number: 'INV-2024-002',
      clientId: 'client-002',
      clientName: 'Ion Ionescu',
      customer: 'Ion Ionescu',
      amount: 200,
      totalAmount: 200,
      status: 'pending',
      date: '2024-01-14',
      createdAt: '2024-01-14T14:30:00Z',
      dueDate: '2024-01-29',
      businessType: 'dental'
    },
    {
      id: 'inv-003',
      number: 'INV-2024-003',
      clientId: 'client-003',
      clientName: 'Ana Dumitrescu',
      customer: 'Ana Dumitrescu',
      amount: 350,
      totalAmount: 350,
      status: 'paid',
      date: '2024-01-13',
      createdAt: '2024-01-13T09:15:00Z',
      dueDate: '2024-01-28',
      businessType: 'dental'
    },
    {
      id: 'inv-004',
      number: 'INV-2024-004',
      clientId: 'client-004',
      clientName: 'Vasile Popa',
      customer: 'Vasile Popa',
      amount: 125,
      totalAmount: 125,
      status: 'pending',
      date: '2024-01-12',
      createdAt: '2024-01-12T16:45:00Z',
      dueDate: '2024-01-27',
      businessType: 'dental'
    }
  ],
  suggestions: [
    {
      id: 'sug-001',
      customer: 'Elena Marinescu',
      customerName: 'Elena Marinescu',
      lastVisit: '2024-01-10',
      lastVisitDate: '2024-01-10',
      suggestedAmount: 180,
      businessType: 'dental'
    },
    {
      id: 'sug-002',
      customer: 'Mihai Ionescu',
      customerName: 'Mihai Ionescu',
      lastVisit: '2024-01-08',
      lastVisitDate: '2024-01-08',
      suggestedAmount: 220,
      businessType: 'dental'
    },
    {
      id: 'sug-003',
      customer: 'Diana Popescu',
      customerName: 'Diana Popescu',
      lastVisit: '2024-01-05',
      lastVisitDate: '2024-01-05',
      suggestedAmount: 95,
      businessType: 'dental'
    }
  ]
};

/**
 * Funcție pentru obținerea datelor facturi
 */
export function getInvoicesMock(businessType = null) {
  return invoicesMock;
}

export default {
  invoicesMock,
  getInvoicesMock
}; 