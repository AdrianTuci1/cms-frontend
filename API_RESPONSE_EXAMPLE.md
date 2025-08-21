# API Response Example

## Expected API Response Format

When calling `/api/business-info/{businessId}`, the API should return a JSON response in this format:

```json
{
  "companyName": "Dental Clinic Example",
  "locations": [
    {
      "id": "location-1",
      "name": "Main Office",
      "address": {
        "street": "123 Main Street",
        "city": "Bucharest",
        "state": "Bucuresti",
        "zipCode": "010000"
      },
      "phone": "+40 21 123 4567",
      "businessHours": {
        "monday": {
          "open": "09:00",
          "close": "17:00"
        }
      },
      "services": ["Dental Cleaning", "Cavity Filling", "Root Canal"],
      "isDefault": true,
      "isActive": true
    },
    {
      "id": "location-2", 
      "name": "Secondary Office",
      "address": "456 Second Street, Bucharest, Bucuresti, 020000",
      "phone": "+40 21 987 6543",
      "isDefault": false,
      "isActive": true
    }
  ]
}
```

## Alternative Simple Format

If the API returns a simpler format, it should still work:

```json
{
  "companyName": "Simple Business Name",
  "locations": [
    {
      "id": "loc-1",
      "name": "Main Location",
      "address": "Simple address string"
    }
  ]
}
```

## Testing with curl

```bash
# Test the API endpoint
curl -X GET "http://localhost:3000/api/business-info/your-business-id" \
  -H "Content-Type: application/json"

# Expected response should be JSON with companyName and locations array
```

## Debug Information

The application will log:
- API Response: The raw response from the API
- Transformed Info: The data after transformation to match expected format
- Current businessInfo state: The final state used for rendering
- Current businessId: The business ID being used

Check the browser console for these logs to debug any issues.
