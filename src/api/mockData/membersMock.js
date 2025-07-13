/**
 * Members Mock Data - Date mock pentru membrii staff
 */

// Mock data pentru members
export const membersMock = {
  id: 'members-001',
  items: [
    // Dental Clinic Staff
    { 
      id: 1, 
      name: 'Dr. Elena Ionescu', 
      email: 'elena.ionescu@dental.com', 
      phone: '0712 345 678',
      role: 'Dentist', 
      workDays: [0, 1, 2, 3, 4], // Monday to Friday
      photoUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
      specialization: 'General Dentistry'
    },
    { 
      id: 2, 
      name: 'Dr. Alexandru Popescu', 
      email: 'alexandru.popescu@dental.com', 
      phone: '0723 456 789',
      role: 'Dentist', 
      workDays: [1, 2, 3, 4, 5], // Tuesday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/men/44.jpg',
      specialization: 'Orthodontics'
    },
    { 
      id: 3, 
      name: 'Dr. Maria Dumitrescu', 
      email: 'maria.dumitrescu@dental.com', 
      phone: '0734 567 890',
      role: 'Dentist', 
      workDays: [0, 2, 4, 6], // Monday, Wednesday, Friday, Sunday
      photoUrl: 'https://randomuser.me/api/portraits/women/55.jpg',
      specialization: 'Endodontics'
    },
    { 
      id: 4, 
      name: 'Ana Popa', 
      email: 'ana.popa@dental.com', 
      phone: '0745 678 901',
      role: 'Dental Assistant', 
      workDays: [1, 2, 3, 4, 5], // Tuesday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
    { 
      id: 5, 
      name: 'Ion Vasilescu', 
      email: 'ion.vasilescu@dental.com', 
      phone: '0756 789 012',
      role: 'Receptionist', 
      workDays: [0, 1, 2, 3, 4, 5], // Monday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
    },
    // Gym Staff
    { 
      id: 6, 
      name: 'Mihai Trainer', 
      email: 'mihai.trainer@gym.com', 
      phone: '0767 890 123',
      role: 'Personal Trainer', 
      workDays: [0, 1, 2, 3, 4, 5], // Monday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/men/78.jpg',
      specialization: 'Strength Training'
    },
    { 
      id: 7, 
      name: 'Elena Coach', 
      email: 'elena.coach@gym.com', 
      phone: '0778 901 234',
      role: 'Fitness Trainer', 
      workDays: [1, 2, 3, 4, 5, 6], // Tuesday to Sunday
      photoUrl: 'https://randomuser.me/api/portraits/women/89.jpg',
      specialization: 'Cardio & HIIT'
    },
    { 
      id: 8, 
      name: 'Andrei Instructor', 
      email: 'andrei.instructor@gym.com', 
      phone: '0789 012 345',
      role: 'Yoga Trainer', 
      workDays: [0, 2, 4, 6], // Monday, Wednesday, Friday, Sunday
      photoUrl: 'https://randomuser.me/api/portraits/men/90.jpg',
      specialization: 'Yoga & Pilates'
    },
    // Hotel Staff
    { 
      id: 9, 
      name: 'Maria Manager', 
      email: 'maria.manager@hotel.com', 
      phone: '0790 123 456',
      role: 'Hotel Manager', 
      workDays: [0, 1, 2, 3, 4, 5, 6], // Every day
      photoUrl: 'https://randomuser.me/api/portraits/women/91.jpg',
    },
    { 
      id: 10, 
      name: 'Ion Receptionist', 
      email: 'ion.receptionist@hotel.com', 
      phone: '0791 234 567',
      role: 'Receptionist', 
      workDays: [0, 1, 2, 3, 4, 5, 6], // Every day
      photoUrl: 'https://randomuser.me/api/portraits/men/92.jpg',
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