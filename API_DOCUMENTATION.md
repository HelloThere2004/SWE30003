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
- Returns: Authentication token

### POST /auth/signout
Logout user
- Headers: `Authorization: Bearer <token>`

## User Controller (`/user`)

### GET /user/findAll
Get all users
- Auth: Requires manager token
- Headers: `Authorization: Bearer <token>`
- Access: Manager only

### GET /user/findOne/:id
Get user by ID
- Auth: Requires manager token
- Headers: `Authorization: Bearer <token>`
- Params: `id: number`
- Access: Manager only

### POST /user/create
Create new user
- Auth: Requires manager token
- Headers: `Authorization: Bearer <token>`
- Body: Same as signup DTO
- Access: Manager only

### POST /user/create-multiple
Create multiple users
- Auth: Requires manager token
- Headers: `Authorization: Bearer <token>`
- Body: Array of signup DTOs
- Access: Manager only

### PUT /user/update/:id
Update user
- Auth: Requires authentication
- Headers: `Authorization: Bearer <token>`
- Params: `id: number`
- Body: Partial user object
- Access: Users can only update their own information

### DELETE /user/delete/:id
Delete user
- Auth: Requires manager token
- Headers: `Authorization: Bearer <token>`
- Params: `id: number`
- Access: Manager only

## Ride Controller (`/ride`)

### POST /ride/request
Create new ride request
- Auth: Requires customer token
- Headers: `Authorization: Bearer <token>`
- Body:
```json
{
  "pickupLocation": "string",
  "dropoffLocation": "string",
  "paymentMethod": "cash | online"
}
```
- Access: Customer only

### GET /ride/history
Get authenticated customer's ride history
- Auth: Requires customer token
- Headers: `Authorization: Bearer <token>`
- Access: Customer only
- Returns: List of completed rides

### GET /ride/feedback
Get all ride feedback
- Auth: Requires manager token
- Headers: `Authorization: Bearer <token>`
- Access: Manager only

### GET /ride/customer/:customerId
Get customer's rides
- Auth: Requires authentication
- Headers: `Authorization: Bearer <token>`
- Params: `customerId: number`

### GET /ride/driver/:driverId
Get driver's rides
- Auth: Requires authentication
- Headers: `Authorization: Bearer <token>`
- Params: `driverId: number`

### PUT /ride/:rideId/status
Update ride status
- Auth: Requires driver token
- Headers: `Authorization: Bearer <token>`
- Params: `rideId: number`
- Body:
```json
{
  "status": "pending | accepted | in_progress | completed | cancelled"
}
```
- Access: Only assigned driver can update
- Restrictions: Cannot update cancelled or completed rides

### PUT /ride/:rideId/feedback
Provide ride feedback
- Auth: Requires customer token
- Headers: `Authorization: Bearer <token>`
- Params: `rideId: number`
- Body:
```json
{
  "rating": "number",
  "feedback": "string"
}
```
- Access: Only customer who took the ride
- Restrictions: Only for completed rides

### PUT /ride/cancel/:rideId
Cancel ride
- Auth: Requires authentication
- Headers: `Authorization: Bearer <token>`
- Params: `rideId: number`
- Access: Only customer who created the ride or assigned driver
- Restrictions: Can only cancel pending or accepted rides

### POST /ride/:rideId/accept
Accept ride
- Auth: Requires driver token
- Headers: `Authorization: Bearer <token>`
- Params: `rideId: number`
- Access: Drivers only