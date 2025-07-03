/**
 * Agent Mock Data - Date mock pentru agenți
 */

// Mock data pentru agent
export const agentMock = {
  id: 'agent-001',
  name: 'Agent Mock',
  email: 'agent@mockbusiness.ro',
  role: 'admin',
  permissions: ['read', 'write', 'delete'],
  stats: {
    appointments: 25,
    sales: 1500,
    clients: 50
  }
};

/**
 * Funcție pentru obținerea datelor agent
 */
export function getAgentMock(businessType = null) {
  return agentMock;
}

export default {
  agentMock,
  getAgentMock
}; 