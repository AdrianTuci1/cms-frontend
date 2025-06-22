// Hotel-specific mock data

// Hotel reservations data
export const hotelReservationsData = {
    reservations: [
        {
            id: 1,
            guestId: 1,
            guestName: "John Smith",
            guestEmail: "john.smith@example.com",
            guestPhone: "+1234567890",
            roomId: 101,
            roomNumber: "101",
            roomType: "Standard",
            checkIn: "2025-01-15T14:00:00",
            checkOut: "2025-01-17T11:00:00",
            duration: 2, // nights
            status: "confirmed",
            totalPrice: 299.98,
            adults: 2,
            children: 0,
            specialRequests: "Late check-in",
            color: "#4CAF50",
            bookingDate: "2024-12-20T10:30:00",
            paymentStatus: "paid"
        },
        {
            id: 2,
            guestId: 2,
            guestName: "Sarah Wilson",
            guestEmail: "sarah.wilson@example.com",
            guestPhone: "+1234567891",
            roomId: 205,
            roomNumber: "205",
            roomType: "Deluxe",
            checkIn: "2025-01-15T15:00:00",
            checkOut: "2025-01-18T11:00:00",
            duration: 3, // nights
            status: "checked_in",
            totalPrice: 599.97,
            adults: 1,
            children: 1,
            specialRequests: "Crib needed",
            color: "#2196F3",
            bookingDate: "2024-12-15T14:20:00",
            paymentStatus: "paid"
        },
        {
            id: 3,
            guestId: 3,
            guestName: "Mike Johnson",
            guestEmail: "mike.johnson@example.com",
            guestPhone: "+1234567892",
            roomId: 302,
            roomNumber: "302",
            roomType: "Suite",
            checkIn: "2025-01-16T12:00:00",
            checkOut: "2025-01-19T11:00:00",
            duration: 3, // nights
            status: "scheduled",
            totalPrice: 899.97,
            adults: 2,
            children: 2,
            specialRequests: "High floor preferred",
            color: "#FF9800",
            bookingDate: "2024-12-25T09:15:00",
            paymentStatus: "pending"
        },
        {
            id: 4,
            guestId: 4,
            guestName: "Lisa Davis",
            guestEmail: "lisa.davis@example.com",
            guestPhone: "+1234567893",
            roomId: 108,
            roomNumber: "108",
            roomType: "Standard",
            checkIn: "2025-01-14T16:00:00",
            checkOut: "2025-01-16T11:00:00",
            duration: 2, // nights
            status: "checked_out",
            totalPrice: 299.98,
            adults: 1,
            children: 0,
            specialRequests: null,
            color: "#9C27B0",
            bookingDate: "2024-12-10T11:45:00",
            paymentStatus: "paid"
        }
    ]
};

// Hotel rooms data
export const hotelRoomsData = {
    rooms: [
        {
            id: 101,
            number: "101",
            type: "Standard",
            category: "standard",
            capacity: 2,
            price: 149.99,
            status: "occupied",
            floor: 1,
            amenities: ["WiFi", "TV", "AC", "Private Bathroom"],
            description: "Comfortable standard room with city view",
            color: "#F44336",
            lastCleaned: "2025-01-15T08:00:00",
            nextCleaning: "2025-01-17T08:00:00",
            maintenanceNotes: null
        },
        {
            id: 102,
            number: "102",
            type: "Standard",
            category: "standard",
            capacity: 2,
            price: 149.99,
            status: "available",
            floor: 1,
            amenities: ["WiFi", "TV", "AC", "Private Bathroom"],
            description: "Comfortable standard room with city view",
            color: "#4CAF50",
            lastCleaned: "2025-01-15T10:00:00",
            nextCleaning: "2025-01-18T10:00:00",
            maintenanceNotes: null
        },
        {
            id: 205,
            number: "205",
            type: "Deluxe",
            category: "deluxe",
            capacity: 3,
            price: 199.99,
            status: "occupied",
            floor: 2,
            amenities: ["WiFi", "TV", "AC", "Private Bathroom", "Balcony", "Mini Bar"],
            description: "Spacious deluxe room with balcony",
            color: "#F44336",
            lastCleaned: "2025-01-15T09:00:00",
            nextCleaning: "2025-01-18T09:00:00",
            maintenanceNotes: null
        },
        {
            id: 302,
            number: "302",
            type: "Suite",
            category: "suite",
            capacity: 4,
            price: 299.99,
            status: "reserved",
            floor: 3,
            amenities: ["WiFi", "TV", "AC", "Private Bathroom", "Balcony", "Mini Bar", "Jacuzzi", "Living Room"],
            description: "Luxury suite with separate living area",
            color: "#FF9800",
            lastCleaned: "2025-01-14T11:00:00",
            nextCleaning: "2025-01-16T11:00:00",
            maintenanceNotes: null
        },
        {
            id: 108,
            number: "108",
            type: "Standard",
            category: "standard",
            capacity: 2,
            price: 149.99,
            status: "maintenance",
            floor: 1,
            amenities: ["WiFi", "TV", "AC", "Private Bathroom"],
            description: "Comfortable standard room with city view",
            color: "#795548",
            lastCleaned: "2025-01-16T08:00:00",
            nextCleaning: "2025-01-19T08:00:00",
            maintenanceNotes: "AC repair needed"
        }
    ]
};

// Hotel guests data
export const hotelGuestsData = {
    guests: [
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@example.com",
            phone: "+1234567890",
            status: "active",
            avatar: "https://via.placeholder.com/150",
            address: "123 Main St, Anytown, USA",
            city: "Anytown",
            state: "CA",
            country: "USA",
            loyaltyPoints: 1250,
            membershipLevel: "gold",
            totalStays: 15,
            totalNights: 45,
            lastStay: "2025-01-15",
            preferences: {
                roomType: "Standard",
                floor: "high",
                specialRequests: "Late check-in preferred"
            },
            currentReservation: {
                id: 1,
                roomNumber: "101",
                checkIn: "2025-01-15T14:00:00",
                checkOut: "2025-01-17T11:00:00"
            }
        },
        {
            id: 2,
            name: "Sarah Wilson",
            email: "sarah.wilson@example.com",
            phone: "+1234567891",
            status: "active",
            avatar: "https://via.placeholder.com/150",
            address: "456 Oak Ave, Somewhere, USA",
            city: "Somewhere",
            state: "NY",
            country: "USA",
            loyaltyPoints: 850,
            membershipLevel: "silver",
            totalStays: 8,
            totalNights: 24,
            lastStay: "2025-01-15",
            preferences: {
                roomType: "Deluxe",
                floor: "any",
                specialRequests: "Quiet room preferred"
            },
            currentReservation: {
                id: 2,
                roomNumber: "205",
                checkIn: "2025-01-15T15:00:00",
                checkOut: "2025-01-18T11:00:00"
            }
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike.johnson@example.com",
            phone: "+1234567892",
            status: "active",
            avatar: "https://via.placeholder.com/150",
            address: "789 Pine St, Elsewhere, USA",
            city: "Elsewhere",
            state: "TX",
            country: "USA",
            loyaltyPoints: 2100,
            membershipLevel: "platinum",
            totalStays: 25,
            totalNights: 78,
            lastStay: "2024-12-20",
            preferences: {
                roomType: "Suite",
                floor: "high",
                specialRequests: "Corner room preferred"
            },
            currentReservation: {
                id: 3,
                roomNumber: "302",
                checkIn: "2025-01-16T12:00:00",
                checkOut: "2025-01-19T11:00:00"
            }
        }
    ]
}; 