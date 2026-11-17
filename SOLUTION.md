
# Full Stack Developer Technical Assessment

## Problem 1: Doctor Slot Booking

### Root Cause

Duplicate appointments occurred because the API
did not handle repeated requests idempotently.

Double booking happened because concurrent requests
could check the same slot as available before either
request completed its database insertion.

### Technical Solution

I implemented idempotency using a unique requestId
index in MongoDB. Repeated requests with the same
requestId return the previously created booking.

To prevent double booking, I implemented a compound
unique index on doctorId and slotTime. MongoDB
guarantees that only one appointment can be inserted
for the same doctor and slot, even during concurrent
requests.

### API Endpoint

POST /api/appointments/book

### Request Body

{
  "requestId": "req_abc123",
  "patientPhone": "+19876543210",
  "doctorId": "doc_101",
  "slotTime": "2026-10-25T10:00:00Z"
}

### HTTP Status Codes

- 201: Appointment created successfully
- 200: Previously processed request
- 400: Invalid request data
- 409: Duplicate request ID or slot conflict
- 500: Internal server error

### Database

MongoDB with Mongoose.

### Indexes

1. Unique index on requestId.
2. Unique compound index on doctorId and slotTime.

## Problem 2

Pending: Problem 2 requirements were not included
in the provided assessment document.

## Problem 3

Pending: Problem 3 requirements were not included
in the provided assessment document.
