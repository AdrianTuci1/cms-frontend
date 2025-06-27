timelineSync


HOTEL

// needed for calendar component
packages = {
    rooms: [
        {
            roomId: 1,
            roomNumber: 102,
            roomType: 'twin',
            roomPrice: 240, 
        }
    ]
}


timeline = {
    bookings: [
        {
            id: 1,
            rooms: [
               {
                roomId: 102,
                startDate: 12.06.2025,
                endDate: 14.06.2025,
               }
            ]
            client: {
                clientId: 2,
                clintName: Andrei,
                language: RO,
                email: '',
                phone: '',
                registered: 'false',
            }
            general: {
                status: 'scheduled',
                isPaid: 'false',
                isConfirmed: 'false',
                createdBy: '',
            }
        }
    ]
}


CLINIC

timeline = {
    reservations: [
        {
            id: 1,
            treatmentId: 1,
            displayTreatment: 'Treatment',
            color: '#fff',
            clientId: 2,
            clientName: 'Gabi',
            medicId: 1,
            medicName: 'Stefan',
            treatments: [
                {
                    treatmentId: 1,
                    treatmentName: Treatment,
                    color: '#fff',
                    price: 50,
                }
            ]
        }
    ]
}



GYM

timeline = {
    checkedIn: [
        {
            memberId: 1,
            memberName: 'Lucky',
            serviceId: 1,
            serviceName: 'Black',
            serviceChecked: 1,
            checkInTime: 14:00,
            checkOutTime: '',
        }
    ]

    classes: [
        {
            classId: 1,
            className: 'Zumba',
            occupancy: '15/20',
            teacher: 'Ion',
            startHour: 10:00,
        }
    ]

    occupancy: [
        {
            facilityId: 1,
            facilityName: Fitness,
            occupancy: '30/50',
        }
    ]
}