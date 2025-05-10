export const demoRooms = [
  {
    id: 1,
    number: 101,
    type: "Single",
    basePrice: 200,
    floor: 1,
    status: "available"
  },
  {
    id: 2,
    number: 102,
    type: "Double",
    basePrice: 300,
    floor: 1,
    status: "available"
  },
  {
    id: 3,
    number: 201,
    type: "Suite",
    basePrice: 500,
    floor: 2,
    status: "available"
  },
  {
    id: 4,
    number: 202,
    type: "Family",
    basePrice: 400,
    floor: 2,
    status: "available"
  },
  {
    id: 5,
    number: 103,
    type: "Single",
    basePrice: 200,
    floor: 1,
    status: "available"
  },
  {
    id: 6,
    number: 104,
    type: "Double",
    basePrice: 300,
    floor: 1,
    status: "available"
  },
  {
    id: 7,
    number: 203,
    type: "Suite",
    basePrice: 500,
    floor: 2,
    status: "available"
  },
  {
    id: 8,
    number: 204,
    type: "Family",
    basePrice: 400,
    floor: 2,
    status: "available"
  },
  {
    id: 9,
    number: 301,
    type: "Deluxe Suite",
    basePrice: 700,
    floor: 3,
    status: "available"
  },
  {
    id: 10,
    number: 302,
    type: "Presidential Suite",
    basePrice: 1000,
    floor: 3,
    status: "available"
  }
];

export const demoReservations = [
  {
    id: 1,
    fullName: "John Doe",
    phone: "+40755123456",
    rooms: [
      {
        roomNumber: 101,
        startDate: "2025-05-08T00:00:00.000Z",
        endDate: "2025-05-13T00:00:00.000Z",
        price: 200,
        type: "Single",
        status: "confirmed"
      }
    ]
  },
  {
    id: 2,
    fullName: "Jane Smith",
    phone: "+40755987654",
    rooms: [
      {
        roomNumber: 201,
        startDate: "2025-05-10T00:00:00.000Z",
        endDate: "2025-05-16T00:00:00.000Z",
        price: 500,
        type: "Suite",
        status: "pending"
      }
    ]
  },
  {
    id: 3,
    fullName: "Maria Popescu",
    phone: "+40755111222",
    rooms: [
      {
        roomNumber: 102,
        startDate: "2025-05-13T00:00:00.000Z",
        endDate: "2025-05-18T00:00:00.000Z",
        price: 300,
        type: "Double",
        status: "confirmed"
      }
    ]
  },
  {
    id: 4,
    fullName: "Ion Ionescu",
    phone: "+40755333444",
    rooms: [
      {
        roomNumber: 301,
        startDate: "2025-05-16T00:00:00.000Z",
        endDate: "2025-05-20T00:00:00.000Z",
        price: 700,
        type: "Deluxe Suite",
        status: "confirmed"
      }
    ]
  },
  {
    id: 5,
    fullName: "Ana Dumitrescu",
    phone: "+40755555666",
    rooms: [
      {
        roomNumber: 202,
        startDate: "2025-05-18T00:00:00.000Z",
        endDate: "2025-05-23T00:00:00.000Z",
        price: 400,
        type: "Family",
        status: "pending"
      }
    ]
  },
  {
    id: 6,
    fullName: "George Popa",
    phone: "+40755777888",
    rooms: [
      {
        roomNumber: 103,
        startDate: "2025-05-20T00:00:00.000Z",
        endDate: "2025-05-25T00:00:00.000Z",
        price: 200,
        type: "Single",
        status: "confirmed"
      }
    ]
  },
  {
    id: 7,
    fullName: "Elena Marin",
    phone: "+40755999000",
    rooms: [
      {
        roomNumber: 302,
        startDate: "2025-05-23T00:00:00.000Z",
        endDate: "2025-05-28T00:00:00.000Z",
        price: 1000,
        type: "Presidential Suite",
        status: "confirmed"
      }
    ]
  },
  {
    id: 8,
    fullName: "Mihai Radu",
    phone: "+40755111233",
    rooms: [
      {
        roomNumber: 104,
        startDate: "2025-05-25T00:00:00.000Z",
        endDate: "2025-05-30T00:00:00.000Z",
        price: 300,
        type: "Double",
        status: "pending"
      }
    ]
  }
]; 