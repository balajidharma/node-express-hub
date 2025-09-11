# Node Express Hub

### Set Environment Variables

Add MongoDB `MONGODB_APP_DATABASE_URL` on .env file

```
MONGODB_APP_DATABASE_URL="mongodb+srv://......"
JWT_SECRET = "your_jwt_secret"
JWT_REFRESH_SECRET="your_jwt_refresh_secret"
JWT_TTL="1h"
JWT_REFRESH_TTL="30d"
API_AUTH_PORT=3333
```

### Generate the prisma types

```
nx run prisma-mongodb-app:generate-types
```

### Start the auth api server

```
nx serve api-auth
```
