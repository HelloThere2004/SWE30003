# API Documentation

## Auth Controller (`/auth`)

### POST /auth/signup
Register a new user
- Body:
```json
{
  "name": "string",
  "age": "number",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "customer | driver | manager",
  "licensePlate": "string (optional)",
  "vehicleModel": "string (optional)"
}
```

### POST /auth/signin
Login with credentials
- Body:
```json
{
  "email": "string",
  "password": "string"
}
```

### POST /auth/signout
Logout user
- Headers: `Authorization: Bearer <token>`

## User Controller (`/user`)

### GET /user/findAll
Get all users
- Auth: Requires token
- No parameters required

### GET /user/findOne/:id
Get user by ID
- Auth: Requires token
- Params: `id: number`

### POST /user/create
Create new user
- Auth: Requires token
- Body: Same as signup DTO

### POST /user/create-multiple
Create multiple users
- Auth: Requires token
- Body: Array of signup DTOs

### PUT /user/update/:id
Update user
- Auth: Requires token
- Params: `id: number`
- Body: Partial user object (all fields optional)

### DELETE /user/delete/:id
Delete user
- Auth: Requires token
- Params: `id: number`

## Ride Controller (`/ride`)

### POST /ride/request
Create new ride request
- Auth: Requires customer token
- Body:
```json
{
  "pickupLocation": "string",
  "dropoffLocation": "string",
  "paymentMethod": "cash | online"
}
```

### GET /ride/history
Get authenticated customer's ride history
- Auth: Requires customer token

### GET /ride/feedback
Get all ride feedback
- Auth: Requires manager token

### GET /ride/customer/:customerId
Get customer's rides
- Auth: Requires token
- Params: `customerId: number`

### GET /ride/driver/:driverId
Get driver's rides
- Auth: Requires token
- Params: `driverId: number`

### PUT /ride/:rideId/status
Update ride status
- Auth: Requires driver token
- Params: `rideId: number`
- Body:
```json
{
  "status": "pending | accepted | in_progress | completed | cancelled"
}
```

### PUT /ride/:rideId/feedback
Provide ride feedback
- Auth: Requires customer token
- Params: `rideId: number`
- Body:
```json
{
  "rating": "number",
  "feedback": "string"
}
```

### PUT /ride/cancel/:rideId
Cancel ride
- Auth: Requires customer or driver token
- Params: `rideId: number`

### POST /ride/:rideId/accept
Accept ride
- Auth: Requires driver token
- Params: `rideId: number`
