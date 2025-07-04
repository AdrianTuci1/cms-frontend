/**
 * Members Mock Data - Date mock pentru membrii staff
 */

// Mock data pentru members
export const membersMock = {
  id: 'members-001',
  items: [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com', 
      phone: '0712 345 678',
      role: 'Manager', 
      workDays: [0, 1, 2, 3, 4], // Monday to Friday
      photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      phone: '0723 456 789',
      role: 'Receptioner', 
      workDays: [1, 3, 5, 6], // Tuesday, Thursday, Saturday, Sunday
      photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      email: 'robert@example.com', 
      phone: '0734 567 890',
      role: 'Camerista', 
      workDays: [0, 2, 4, 6], // Monday, Wednesday, Friday, Sunday
      photoUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
    { 
      id: 4, 
      name: 'Maria Garcia', 
      email: 'maria@example.com', 
      phone: '0745 678 901',
      role: 'Chef', 
      workDays: [1, 2, 3, 4, 5], // Tuesday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
    { 
      id: 5, 
      name: 'David Wilson', 
      email: 'david@example.com', 
      phone: '0756 789 012',
      role: 'Waiter', 
      workDays: [3, 4, 5, 6], // Thursday to Sunday
      photoUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
    }
  ]
};

/**
 * Funcție pentru obținerea datelor members
 */
export function getMembersMock(businessType = null) {
  return membersMock;
}

export default {
  membersMock,
  getMembersMock
}; 