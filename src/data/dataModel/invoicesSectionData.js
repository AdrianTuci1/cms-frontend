// request made to /api/{tenantId}/{locationId}/invoices/?displayDate=2025-06-10
// request example:
// http://localhost:3001/api/1/1/invoices/?displayDate=2025-06-10
// headers:
// Authorization: Bearer {token}
// Content-Type: application/json

export const invoicesSectionGeneral = {
    invoices: [
        {
            id: 1,
            billId: 1,
            date: "2025-06-10",
            total: 100,
            status: "paid",
            clientName: "John Doe",
            clientId: 1,
            businessName: "Business 1",
            

        },
        {
            id: 2,
            billId: 2,
            date: "2025-06-11",
            total: 200,
            status: "pending",
            clientName: "Jane Doe",
            clientId: 2,
            businessName: "Business 2",
        },
    ]
}

// request made to /api/{tenantId}/{locationId}/billing-suggestions
// billing suggestions live data comes from socket connection service
// request example:
// http://localhost:3001/api/1/1/billing-suggestions
// headers:
// Authorization: Bearer {token}
// Content-Type: application/json

export const billingSuggestionsSectionGeneral = {
    billingSuggestions: [
        {
            id: 1,
            billId: null,
            date: "2025-06-10",
            total: 100,
            status: "suggested",
            clientName: "John Doe",
            clientId: 1,
            businessName: "Business 1",
        },
        {
            id: 2,
            billId: null,
            date: "2025-06-11",
            total: 200,
            status: "suggested",
            clientName: "Jane Doe",
            clientId: 2,
            businessName: "Business 2",
        },
    ]
}

