// Gym-specific mock data

// Members data for gym
export const gymMembersData = {
    members: [
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@example.com",
            phone: "+1234567890",
            status: "active",
            avatar: "https://via.placeholder.com/150",
            membershipType: "premium",
            membershipExpiry: "2025-12-31",
            joinDate: "2024-01-15",
            lastVisit: "2025-01-10T14:30:00",
            trainerId: 1,
            trainerName: "Mike Johnson",
            membershipLevel: "gold",
            totalVisits: 45,
            currentStreak: 5
        },
        {
            id: 2,
            name: "Sarah Wilson",
            email: "sarah.wilson@example.com",
            phone: "+1234567891",
            status: "active",
            avatar: "https://via.placeholder.com/150",
            membershipType: "basic",
            membershipExpiry: "2025-06-30",
            joinDate: "2024-03-20",
            lastVisit: "2025-01-12T09:15:00",
            trainerId: 2,
            trainerName: "Lisa Davis",
            membershipLevel: "silver",
            totalVisits: 23,
            currentStreak: 2
        },
        {
            id: 3,
            name: "David Brown",
            email: "david.brown@example.com",
            phone: "+1234567892",
            status: "inactive",
            avatar: "https://via.placeholder.com/150",
            membershipType: "premium",
            membershipExpiry: "2024-12-31",
            joinDate: "2023-08-10",
            lastVisit: "2024-11-15T16:45:00",
            trainerId: 1,
            trainerName: "Mike Johnson",
            membershipLevel: "gold",
            totalVisits: 67,
            currentStreak: 0
        }
    ]
};

// Classes data for gym
export const gymClassesData = {
    classes: [
        {
            id: 1,
            name: "Yoga Flow",
            instructor: "Emma Thompson",
            instructorId: 3,
            date: "2025-01-15T08:00:00",
            duration: 60,
            capacity: 20,
            enrolled: 15,
            status: "scheduled",
            category: "yoga",
            difficulty: "beginner",
            color: "#4CAF50",
            location: "Studio A",
            description: "Gentle yoga flow for all levels"
        },
        {
            id: 2,
            name: "HIIT Training",
            instructor: "Mike Johnson",
            instructorId: 1,
            date: "2025-01-15T10:00:00",
            duration: 45,
            capacity: 15,
            enrolled: 12,
            status: "scheduled",
            category: "cardio",
            difficulty: "advanced",
            color: "#F44336",
            location: "Gym Floor",
            description: "High-intensity interval training"
        },
        {
            id: 3,
            name: "Strength Training",
            instructor: "Lisa Davis",
            instructorId: 2,
            date: "2025-01-15T14:00:00",
            duration: 90,
            capacity: 12,
            enrolled: 8,
            status: "scheduled",
            category: "strength",
            difficulty: "intermediate",
            color: "#2196F3",
            location: "Weight Room",
            description: "Full body strength workout"
        }
    ]
};

// Occupancy data for gym
export const gymOccupancyData = {
    occupancy: [
        {
            id: 1,
            timeSlot: "06:00-08:00",
            date: "2025-01-15",
            currentMembers: 8,
            maxCapacity: 50,
            percentage: 16,
            status: "low",
            color: "#4CAF50"
        },
        {
            id: 2,
            timeSlot: "08:00-10:00",
            date: "2025-01-15",
            currentMembers: 25,
            maxCapacity: 50,
            percentage: 50,
            status: "medium",
            color: "#FF9800"
        },
        {
            id: 3,
            timeSlot: "10:00-12:00",
            date: "2025-01-15",
            currentMembers: 35,
            maxCapacity: 50,
            percentage: 70,
            status: "high",
            color: "#F44336"
        },
        {
            id: 4,
            timeSlot: "12:00-14:00",
            date: "2025-01-15",
            currentMembers: 15,
            maxCapacity: 50,
            percentage: 30,
            status: "low",
            color: "#4CAF50"
        },
        {
            id: 5,
            timeSlot: "14:00-16:00",
            date: "2025-01-15",
            currentMembers: 20,
            maxCapacity: 50,
            percentage: 40,
            status: "medium",
            color: "#FF9800"
        },
        {
            id: 6,
            timeSlot: "16:00-18:00",
            date: "2025-01-15",
            currentMembers: 45,
            maxCapacity: 50,
            percentage: 90,
            status: "peak",
            color: "#9C27B0"
        },
        {
            id: 7,
            timeSlot: "18:00-20:00",
            date: "2025-01-15",
            currentMembers: 40,
            maxCapacity: 50,
            percentage: 80,
            status: "high",
            color: "#F44336"
        },
        {
            id: 8,
            timeSlot: "20:00-22:00",
            date: "2025-01-15",
            currentMembers: 12,
            maxCapacity: 50,
            percentage: 24,
            status: "low",
            color: "#4CAF50"
        }
    ]
};

// Gym packages data
export const gymPackagesData = {
    packages: [
        {
            id: 1,
            name: "Basic Membership",
            price: 49.99,
            duration: 30, // days
            category: "membership",
            status: "active",
            color: "#4CAF50",
            features: [
                "Access to gym equipment",
                "Locker room access",
                "Free parking"
            ],
            maxVisits: null,
            description: "Perfect for beginners"
        },
        {
            id: 2,
            name: "Premium Membership",
            price: 89.99,
            duration: 30, // days
            category: "membership",
            status: "active",
            color: "#2196F3",
            features: [
                "All Basic features",
                "Group classes included",
                "Personal trainer consultation",
                "Sauna access",
                "Guest passes (2/month)"
            ],
            maxVisits: null,
            description: "Best value for regular gym-goers"
        },
        {
            id: 3,
            name: "Personal Training Package",
            price: 299.99,
            duration: 30, // days
            category: "training",
            status: "active",
            color: "#FF9800",
            features: [
                "10 personal training sessions",
                "Custom workout plan",
                "Nutrition consultation",
                "Progress tracking"
            ],
            maxVisits: 10,
            description: "Get personalized attention"
        }
    ]
}; 