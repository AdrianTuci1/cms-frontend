// Mock data for patient appointments and notes
export const getMockAppointments = () => [
  { 
    id: 1, 
    date: '2024-01-15', 
    time: '10:00 AM', 
    type: 'Dental Cleaning', 
    status: 'Completed',
    doctor: 'Dr. Smith',
    notes: 'Regular cleaning, no issues found'
  },
  { 
    id: 2, 
    date: '2024-01-22', 
    time: '2:30 PM', 
    type: 'Cavity Filling', 
    status: 'Scheduled',
    doctor: 'Dr. Johnson',
    notes: 'Tooth #14 needs filling'
  },
  { 
    id: 3, 
    date: '2024-01-29', 
    time: '9:00 AM', 
    type: 'Consultation', 
    status: 'Confirmed',
    doctor: 'Dr. Smith',
    notes: 'Follow-up consultation'
  }
];

export const getMockDentalNotes = () => [
  {
    id: 1,
    date: '2024-01-15',
    doctor: 'Dr. Smith',
    category: 'Treatment Plan',
    content: 'Patient needs root canal treatment on tooth #14. Scheduled for next week.',
    attachments: ['xray_jan15.pdf']
  },
  {
    id: 2,
    date: '2024-01-10',
    doctor: 'Dr. Johnson',
    category: 'Diagnosis',
    content: 'Cavity detected on tooth #14. Patient reports sensitivity to cold.',
    attachments: []
  },
  {
    id: 3,
    date: '2024-01-05',
    doctor: 'Dr. Smith',
    category: 'Follow-up',
    content: 'Patient completed cleaning. No new issues found. Recommend 6-month follow-up.',
    attachments: ['cleaning_report.pdf']
  }
];