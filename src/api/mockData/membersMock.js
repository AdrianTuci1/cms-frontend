/**
 * Members Mock Data - Date mock pentru membrii staff
 */

// Dental Clinic Staff
export const dentalMembersMock = {
  id: 'dental-members-001',
  businessType: 'dental',
  items: [
    { 
      id: 1, 
      name: 'Dr. Elena Ionescu', 
      email: 'elena.ionescu@dental.com', 
      phone: '0712 345 678',
      role: 'Dentist', 
      workDays: [0, 1, 2, 3, 4], // Monday to Friday
      photoUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
      specialization: 'General Dentistry',
      type: 'dentist'
    },
    { 
      id: 2, 
      name: 'Dr. Alexandru Popescu', 
      email: 'alexandru.popescu@dental.com', 
      phone: '0723 456 789',
      role: 'Dentist', 
      workDays: [1, 2, 3, 4, 5], // Tuesday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/men/44.jpg',
      specialization: 'Orthodontics',
      type: 'dentist'
    },
    { 
      id: 3, 
      name: 'Dr. Maria Dumitrescu', 
      email: 'maria.dumitrescu@dental.com', 
      phone: '0734 567 890',
      role: 'Dentist', 
      workDays: [0, 2, 4, 6], // Monday, Wednesday, Friday, Sunday
      photoUrl: 'https://randomuser.me/api/portraits/women/55.jpg',
      specialization: 'Endodontics',
      type: 'dentist'
    },
    { 
      id: 4, 
      name: 'Ana Popa', 
      email: 'ana.popa@dental.com', 
      phone: '0745 678 901',
      role: 'Dental Assistant', 
      workDays: [1, 2, 3, 4, 5], // Tuesday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
      type: 'assistant'
    },
    { 
      id: 5, 
      name: 'Ion Vasilescu', 
      email: 'ion.vasilescu@dental.com', 
      phone: '0756 789 012',
      role: 'Receptionist', 
      workDays: [0, 1, 2, 3, 4, 5], // Monday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
      type: 'receptionist'
    }
  ]
};

// Gym Staff
export const gymMembersMock = {
  id: 'gym-members-001',
  businessType: 'gym',
  items: [
    { 
      id: 6, 
      name: 'Mihai Trainer', 
      email: 'mihai.trainer@gym.com', 
      phone: '0767 890 123',
      role: 'Personal Trainer', 
      workDays: [0, 1, 2, 3, 4, 5], // Monday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/men/78.jpg',
      specialization: 'Strength Training',
      type: 'trainer'
    },
    { 
      id: 7, 
      name: 'Elena Coach', 
      email: 'elena.coach@gym.com', 
      phone: '0778 901 234',
      role: 'Fitness Trainer', 
      workDays: [1, 2, 3, 4, 5, 6], // Tuesday to Sunday
      photoUrl: 'https://randomuser.me/api/portraits/women/89.jpg',
      specialization: 'Cardio & HIIT',
      type: 'trainer'
    },
    { 
      id: 8, 
      name: 'Andrei Instructor', 
      email: 'andrei.instructor@gym.com', 
      phone: '0789 012 345',
      role: 'Yoga Trainer', 
      workDays: [0, 2, 4, 6], // Monday, Wednesday, Friday, Sunday
      photoUrl: 'https://randomuser.me/api/portraits/men/90.jpg',
      specialization: 'Yoga & Pilates',
      type: 'trainer'
    },
    { 
      id: 9, 
      name: 'Maria Receptionist', 
      email: 'maria.receptionist@gym.com', 
      phone: '0790 123 456',
      role: 'Receptionist', 
      workDays: [0, 1, 2, 3, 4, 5], // Monday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/women/91.jpg',
      type: 'receptionist'
    }
  ]
};

// Hotel Staff
export const hotelMembersMock = {
  id: 'hotel-members-001',
  businessType: 'hotel',
  items: [
    { 
      id: 10, 
      name: 'Maria Manager', 
      email: 'maria.manager@hotel.com', 
      phone: '0791 234 567',
      role: 'Hotel Manager', 
      workDays: [0, 1, 2, 3, 4, 5, 6], // Every day
      photoUrl: 'https://randomuser.me/api/portraits/women/92.jpg',
      type: 'manager'
    },
    { 
      id: 11, 
      name: 'Ion Receptionist', 
      email: 'ion.receptionist@hotel.com', 
      phone: '0792 345 678',
      role: 'Receptionist', 
      workDays: [0, 1, 2, 3, 4, 5, 6], // Every day
      photoUrl: 'https://randomuser.me/api/portraits/men/93.jpg',
      type: 'receptionist'
    },
    { 
      id: 12, 
      name: 'Elena Housekeeper', 
      email: 'elena.housekeeper@hotel.com', 
      phone: '0793 456 789',
      role: 'Housekeeper', 
      workDays: [1, 2, 3, 4, 5], // Tuesday to Saturday
      photoUrl: 'https://randomuser.me/api/portraits/women/94.jpg',
      type: 'housekeeper'
    },
    { 
      id: 13, 
      name: 'Andrei Concierge', 
      email: 'andrei.concierge@hotel.com', 
      phone: '0794 567 890',
      role: 'Concierge', 
      workDays: [0, 1, 2, 3, 4, 5, 6], // Every day
      photoUrl: 'https://randomuser.me/api/portraits/men/95.jpg',
      type: 'concierge'
    }
  ]
};

/**
 * Funcție pentru obținerea datelor members în funcție de tipul de business
 */
export function getMembersMock(businessType = 'dental') {
  switch (businessType) {
    case 'dental':
      return dentalMembersMock;
    case 'gym':
      return gymMembersMock;
    case 'hotel':
      return hotelMembersMock;
    default:
      return dentalMembersMock; // default
  }
}

// Legacy export for backward compatibility
export const membersMock = dentalMembersMock;

export default {
  membersMock,
  dentalMembersMock,
  gymMembersMock,
  hotelMembersMock,
  getMembersMock
}; 