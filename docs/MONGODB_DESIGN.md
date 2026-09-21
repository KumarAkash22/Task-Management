# MongoDB design

The application uses MongoDB through Mongoose. Collections and ownership rules:

## users

- `_id`: ObjectId primary key
- `name`: required string, 2-100 characters
- `email`: required normalized string, unique and indexed
- `password`: bcrypt hash; excluded from normal queries
- `isEmailVerified`: boolean
- `createdAt`, `updatedAt`: timestamps

## tasks

- `_id`: ObjectId primary key
- `owner`: required reference to `users._id`
- `title`: required string, maximum 200 characters
- `description`: optional string, maximum 5000 characters
- `priority`: `High`, `Medium`, or `Low`
- `status`: `Pending`, `In Progress`, or `Completed`
- `assignedDate`, `dueDate`: dates
- `createdAt`, `updatedAt`: timestamps

Indexes on `tasks.owner + createdAt`, and `tasks.owner + status + priority`
support the dashboard queries. Every task query includes `owner`, preventing
cross-user access.

## otp records

OTP records contain a normalized email, a bcrypt OTP hash, an expiry date,
verification state, and timestamps. OTPs are removed after registration.
