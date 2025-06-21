// request made to /api/{tenantId}/{locationId}/stocks
// request example:
// http://localhost:3001/api/1/1/stocks
// headers:
// Authorization: Bearer {token}
// Content-Type: application/json
// data: {
//     page: 1,
//     limit: 20,
//     search: "Stock",
// }

export const stocksSectionGeneral = {
    stocks: [
        {
            id: 1,
            name: "Stock 1",
            category: "category 1",
            quantity: 100,
            price: 100,
            totalValue: 10000,
        },
        {
            id: 2,
            name: "Stock 2",
            category: "category 2",
            quantity: 200,
            price: 200,
            totalValue: 20000,
        },
        {
            id: 3,
            name: "Stock 3",
            category: "category 3",
            quantity: 300,
            price: 300,
            totalValue: 30000,
        },
        {
            id: 4,
            name: "Stock 4",
            category: "category 4",
            quantity: 400,
            price: 400,
            totalValue: 40000,
        },
    ]
}