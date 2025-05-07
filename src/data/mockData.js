export const mockMembers = [
  {
    id: 1,
    name: 'Ion Popescu',
    checkIn: '08:30',
    checkOut: '10:15',
    status: 'active',
    avatar: 'IP',
    subscription: {
      type: 'gold',
      expiresAt: '2024-12-31'
    }
  },
  {
    id: 2,
    name: 'Maria Ionescu',
    checkIn: '09:15',
    checkOut: '11:30',
    status: 'active',
    avatar: 'MI',
    subscription: {
      type: 'silver',
      expiresAt: '2024-06-30'
    }
  },
  {
    id: 3,
    name: 'Alexandru Dumitrescu',
    checkIn: '10:00',
    checkOut: '12:45',
    status: 'active',
    avatar: 'AD',
    subscription: {
      type: 'black',
      expiresAt: '2025-01-15'
    }
  },
  {
    id: 4,
    name: 'Elena Stoica',
    checkIn: '11:30',
    checkOut: '13:15',
    status: 'active',
    avatar: 'ES',
    subscription: {
      type: 'service',
      expiresAt: '2024-05-20'
    }
  },
  {
    id: 5,
    name: 'Mihai Ionescu',
    checkIn: '13:00',
    checkOut: '15:30',
    status: 'active',
    avatar: 'MI',
    subscription: {
      type: 'none',
      expiresAt: '2024-04-15'
    }
  },
  {
    id: 6,
    name: 'Ana Popescu',
    checkIn: '14:15',
    checkOut: '16:45',
    status: 'active',
    avatar: 'AP',
    subscription: {
      type: 'gold',
      expiresAt: '2024-08-31'
    }
  },
  {
    id: 7,
    name: 'George Dumitru',
    checkIn: '15:30',
    checkOut: '17:15',
    status: 'active',
    avatar: 'GD',
    subscription: {
      type: 'silver',
      expiresAt: '2024-07-15'
    }
  },
  {
    id: 8,
    name: 'Laura Ionescu',
    checkIn: '16:00',
    checkOut: '18:30',
    status: 'active',
    avatar: 'LI',
    subscription: {
      type: 'black',
      expiresAt: '2024-09-30'
    }
  },
  // Date noi adăugate
  {
    id: 9,
    name: 'Andrei Popa',
    checkIn: '07:00',
    checkOut: '09:30',
    status: 'active',
    avatar: 'AP',
    subscription: {
      type: 'service',
      expiresAt: '2024-05-10'
    }
  },
  {
    id: 10,
    name: 'Cristina Marin',
    checkIn: '17:30',
    checkOut: '19:45',
    status: 'active',
    avatar: 'CM',
    subscription: {
      type: 'none',
      expiresAt: '2024-04-20'
    }
  },
  {
    id: 11,
    name: 'Radu Stanescu',
    checkIn: '06:15',
    checkOut: '08:45',
    status: 'active',
    avatar: 'RS',
    subscription: {
      type: 'gold',
      expiresAt: '2024-11-30'
    }
  },
  {
    id: 12,
    name: 'Diana Popescu',
    checkIn: '19:00',
    checkOut: '21:30',
    status: 'active',
    avatar: 'DP',
    subscription: {
      type: 'silver',
      expiresAt: '2024-06-15'
    }
  }
];

export const mockCourses = {
  ongoing: [
    {
      id: 1,
      title: 'Yoga',
      instructor: 'Ana Popescu',
      time: '10:00 - 11:00',
      participants: 8,
      capacity: 12,
    },
    {
      id: 2,
      title: 'Pilates',
      instructor: 'Mihai Ionescu',
      time: '11:30 - 12:30',
      participants: 6,
      capacity: 10,
    },
  ],
  upcoming: [
    {
      id: 3,
      title: 'HIIT',
      instructor: 'Alex Dumitrescu',
      time: '13:00 - 14:00',
      participants: 5,
      capacity: 15,
    },
    {
      id: 4,
      title: 'Zumba',
      instructor: 'Elena Stoica',
      time: '14:30 - 15:30',
      participants: 3,
      capacity: 20,
    },
  ],
};

export const mockTrainers = [
  {
    id: 1,
    name: 'Ana Popescu',
    specialization: 'Yoga, Pilates',
    experience: '5 ani',
    rating: 4.8,
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Mihai Ionescu',
    specialization: 'Pilates, Fitness',
    experience: '7 ani',
    rating: 4.9,
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 3,
    name: 'Alex Dumitrescu',
    specialization: 'HIIT, CrossFit',
    experience: '4 ani',
    rating: 4.7,
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 4,
    name: 'Elena Stoica',
    specialization: 'Zumba, Dans',
    experience: '6 ani',
    rating: 4.9,
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
]; 