# Task Management API

Base URL: `/api`

## Authentication

`POST /auth/send-otp`

```json
{ "email": "user@example.com" }
```

`POST /auth/verify-otp`

```json
{ "email": "user@example.com", "otp": "1234" }
```

`POST /auth/register`

Requires a verified OTP. The password must be 8-128 characters.

```json
{ "name": "Ada Lovelace", "email": "user@example.com", "password": "correct horse battery staple" }
```

`POST /auth/login`

```json
{ "email": "user@example.com", "password": "correct horse battery staple" }
```

Successful login returns a JWT in `token`. Send it on protected requests:

```text
Authorization: Bearer <token>
```

## Protected task endpoints

All task endpoints require the `Authorization` header. Tasks are scoped to the authenticated user.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/tasks` | Create a task |
| GET | `/tasks` | List the current user's tasks |
| GET | `/tasks/:id` | Get one of the current user's tasks |
| PUT | `/tasks/:id` | Update one of the current user's tasks |
| DELETE | `/tasks/:id` | Delete one of the current user's tasks |

Task fields are `title`, `description`, `priority` (`High`, `Medium`, `Low`),
`assignedDate`, `dueDate`, and `status` (`Pending`, `In Progress`, `Completed`).

`GET /tasks` supports `search`, `status`, `priority`, and `sortDueDate=asc|desc`.

Errors use this shape:

```json
{
  "message": "Validation failed",
  "errors": ["Title must be between 1 and 200 characters"]
}
```
