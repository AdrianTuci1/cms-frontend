// request made to /api/{tenantId}/{locationId}/history/?displayDate=2025-06-10
// real time data comes from socket connection service
// request example:
// http://localhost:3001/api/1/1/history (live data only for current day)
// headers:
// Authorization: Bearer {token}
// Content-Type: application/json

// only deleted actions are revertable, the rest are not
// the history is sorted by date and hour
// history can be filtered by type

export const historySectionGeneral = {
    history: [
        {
            id: 1,
            date: "2025-06-10",
            hour: "10:00",
            initiatedBy: {
                id: 1,
                name: "John Doe",
                role: "admin",
            },
            description: "Created a new client",
            action: "Check-out room 104",
            type: "check-out",
            revertable: false,
        },
        {
            id: 2,
            date: "2025-06-10",
            hour: "10:00",
            initiatedBy: {
                id: 1,
                name: "John Doe",
                role: "admin",
            },
            description: "Client has a problem",
            action: "problem at room 104",
            type: "problem",
            revertable: false,
        },
        {
            id: 3,
            date: "2025-06-10",
            hour: "10:00",
            initiatedBy: {
                id: 1,
                name: "John Doe",
                role: "admin",
            },
            description: "",
            action: "cleaning at room 104",
            type: "cleaning",
            revertable: false,
        },
        {
            id: 4,
            date: "2025-06-10",
            hour: "10:00",
            initiatedBy: {
                id: 1,
                name: "John Doe",
                role: "admin",
            },
            description: "Client has a problem",
            action: "problem at room 104",
            type: "problem",
            revertable: false,
        },
        {
            id: 5,
            date: "2025-06-10",
            hour: "10:00",
            initiatedBy: {
                id: 1,
                name: "John Doe",
                role: "admin",
            },  
            description: "Client has a problem",
            action: "reservation deleted at room 104",
            type: "deleted",
            revertable: true,
        },
    ]
}
