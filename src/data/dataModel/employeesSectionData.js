// request made to /api/{tenantId}/{locationId}/employees
// headers:
// Authorization: Bearer {token}
// Content-Type: application/json

export const employeesSectionGeneral = {
    employees: [
        {
            id: 1,
            name: "John Doe",
            role: "admin",
            email: "john.doe@example.com",
            phone: "1234567890",
            address: "123 Main St, Anytown, USA",
            city: "Anytown",
            state: "CA",
            avatar: "https://via.placeholder.com/150",
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            workingHours: "09:00 - 17:00",
            specializations: ["cleaning", "maintenance", "reception"],
        },
        {
            id: 2,
            name: "Jane Doe",
            role: "admin",
            email: "jane.doe@example.com",
            phone: "1234567890",
            address: "123 Main St, Anytown, USA",
            city: "Anytown",
            state: "CA",
            avatar: "https://via.placeholder.com/150",
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            workingHours: "09:00 - 17:00",
            specializations: ["cleaning", "maintenance", "reception"],
        },
        {
            id: 3,
            name: "John Doe",
            role: "admin",
            email: "john.doe@example.com",
            phone: "1234567890",
            address: "123 Main St, Anytown, USA",
            city: "Anytown",
            state: "CA",
            avatar: "https://via.placeholder.com/150",
            workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            workingHours: "09:00 - 17:00",
            specializations: ["cleaning", "maintenance", "reception"],
        }
    ]
}



export const availableRolesGeneral = {
    roles: [
        {
            id: 1,
            name: "canReadOwnAppointments",
            businessType: "clinic",
            description: "can read own appointments",
        },
        {
            id: 2,
            name: "canReadAllAppointments",
            businessType: "general",
            description: "can read all appointments",
        },
        {
            id: 3,
            name: "canMakeSales",
            businessType: "general",
            description: "can make sales",
        },
        {
            id: 4,
            name: "canModifyOwnAppointments",
            businessType: "clinic",
            description: "can modify own appointments",
        },
        {
            id: 5,
            name: "canModifyAllAppointments",
            businessType: "general",
            description: "can modify all appointments",
        },
        {
            id: 6,
            name: "canModifyOwnClients",
            businessType: "clinic",
            description: "can modify own clients",
        },
        {
            id: 7, 
            name: "canModifyAllClients",
            businessType: "general",
            description: "can modify all clients",
        },
        {
            id: 8,
            name: "canModifyOwnEmployees",
            businessType: "general",
            description: "can modify employees",
        },
        {
            id: 9,
            name: "canModifyAllEmployees",
            businessType: "general",
            description: "can modify employees",
        },
        {
            id: 11,
            name: "canEditServices",
            businessType: "general",
            description: "can modify available services",
        },
        {
            id: 12,
            name: "canEditStocks",
            businessType: "general",
            description: "can modify stock",
        },
        {
            id: 13,
            name: "canBill",
            businessType: "general",
            description: "can bill",
        },
        {
            id: 15,
            name: "canEditCreatedInvoices",
            businessType: "general",
        },
        {
            id: 14,
            name: "canInvoice",
            businessType: "general",
            description: "can generate invoices",
        },
        {
            id: 15,
            name: "canViewOwnHistory",
            businessType: "general",
            description: "can view own history",
        },
        {
            id: 16,
            name: "canViewAllHistory",
            businessType: "general",
            description: "can view all history",
        },   
        {
            id: 17,
            name: "canViewReports",
            businessType: "general",
            description: "can view reports",
        },
    ]
}

//request made to /api/{tenantId}/{locationId}/employees/roles
// headers:
// Authorization: Bearer {token}
// Content-Type: application/json

export const employeesRolesSectionGeneral = {
    roles: [
        {
            id: 1,
            name: "administrator",
            locations: ['*'],
            permissions: ['*'],
        },
        {
            id: 2,
            name: "receptionist",
            locations: [1,2],
            permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        },
    ]
}

