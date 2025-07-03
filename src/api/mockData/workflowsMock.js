/**
 * Workflows Mock Data - Date mock pentru workflow-uri
 */

// Mock data pentru workflows
export const workflowsMock = {
  id: 'workflows-001',
  workflows: [
    {
      id: 'wf-001',
      name: 'Workflow 1',
      status: 'active',
      steps: ['Step 1', 'Step 2', 'Step 3']
    },
    {
      id: 'wf-002',
      name: 'Workflow 2',
      status: 'inactive',
      steps: ['Step 1', 'Step 2']
    }
  ]
};

/**
 * Funcție pentru obținerea datelor workflow-uri
 */
export function getWorkflowsMock(businessType = null) {
  return workflowsMock;
}

export default {
  workflowsMock,
  getWorkflowsMock
}; 