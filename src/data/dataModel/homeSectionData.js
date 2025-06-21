// mock data for the calendar section
// request made to /api/{tenantId}/{locationId}/calendar?startDate=2025-06-10&endDate=2025-06-16
//real time data comes from socket connection service

//request example:
//http://localhost:3001/api/1/1/calendar?startDate=2025-06-10&endDate=2025-06-16

// headers:
// Authorization: Bearer {token}
// Content-Type: application/json
// Accept: application/json


export const homeSectionClinic = {
    calendar: [
        {
            id: 1,
            patientId: 1,
            patientName: "John Doe",
            medicId: 1,
            medicName: "Dr. Smith",
            date: "2025-06-10T09:00:00",
            duration: 30,
            status: "missed",
            initialTreatment: "checkup",
            color: "#4CAF50"
          },
          {
            id: 2,
            patientId: 2,
            patientName: "Jane Smith",
            medicId: 1,
            medicName: "Dr. Smith",
            date: "2025-06-10T10:00:00",
            duration: 45,
            status: "scheduled",
            initialTreatment: "cleaning",
            color: "#1976d2"
          },
          {
            id: 3,
            patientId: 3,
            patientName: "Mike Johnson",
            medicId: 2,
            medicName: "Dr. Johnson",
            date: "2025-06-11T14:00:00",
            duration: 60,
            status: "scheduled",
            initialTreatment: "treatment",
            color: "#9C27B0"
          },
          {
            id: 4,
            patientId: 4,
            patientName: "Sarah Wilson",
            medicId: 1,
            medicName: "Dr. Smith",
            date: "2025-06-10T11:00:00",
            duration: 30,
            status: "done",
            initialTreatment: "checkup",
            color: "#FF9800"
          },
          {
            id: 5,
            patientId: 5,
            patientName: "Robert Brown",
            medicId: 2,
            medicName: "Dr. Johnson",
            date: "2025-06-12T15:30:00",
            duration: 45,
            status: "done",
            initialTreatment: "cleaning",
            color: "#F44336"
          },
          {
            id: 6,
            patientId: 6,
            patientName: "Emily Davis",
            medicId: 1,
            medicName: "Dr. Smith",
            date: "2025-06-12T09:00:00",
            duration: 60,
            status: "notpaid",
            initialTreatment: "treatment",
            color: "#795548"
          },
          {
            id: 7,
            patientId: 7,
            patientName: "David Miller",
            medicId: 2,
            medicName: "Dr. Johnson",
            date: "2025-06-13T14:00:00",
            duration: 30,
            status: "upcoming",
            initialTreatment: "checkup",
            color: "#00BCD4"
          },
          {
            id: 8,
            patientId: 8,
            patientName: "Lisa Anderson",
            medicId: 1,
            medicName: "Dr. Smith",
            date: "2025-06-15T10:30:00",
            duration: 45,
            status: "upcoming",
            initialTreatment: "cleaning",
            color: "#E91E63"
          },
        ],
}


// request made to /api/{tenantId}/{locationId}/clients
// real time data comes from socket connection service
// request example:
// http://localhost:3001/api/1/1/clients

// with pagination
// with search by name

// headers:
// Authorization: Bearer {token}
// Content-Type: application/json
// data: {
//     page: 1,
//     limit: 20,
//     search: "John",
// }

export const clientsSectionClinic = {
    clients: [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1234567890",
            status: "active",
            avatar: "https://via.placeholder.com/150",
            previousAppointment: {
                id: 1,
                date: "2025-06-10T09:00:00",
                status: "done",
                initialTreatment: "checkup",
                color: "#4CAF50",
                medicId: 1,
                medicName: "Dr. Smith",
            },
            nextAppointment: {
                id: 2,
                date: "2025-06-11T10:00:00",
                status: "scheduled",
                initialTreatment: "cleaning",
                color: "#1976d2",
                medicId: 1,
                medicName: "Dr. Smith",
            }
        }
    ]
}


//request made to /api/{tenantId}/{locationId}/treatments
// request example:
// http://localhost:3001/api/1/1/treatments
// headers:
// Authorization: Bearer {token}
// Content-Type: application/json


export const treatmentsSectionClinic = {
    treatments: [
        {
            id: 1,
            name: "Treatment 1",
            price: 100,
            duration: 30,
            category: "category 1",
            status: "active",
            color: "#4CAF50",
            components: [
                {
                    id: 1,
                    name: "Component 1",
                    quantity: 1,
                },
            ]
        },
        {
            id: 2,
            name: "Treatment 2",
            price: 200,
            duration: 45,
            category: "category 2",
            status: "active",
            color: "#1976d2",
            components: [
                {
                    id: 1,
                    name: "Component 1",
                    quantity: 1,
                },
            ],
        }
    ]
}


