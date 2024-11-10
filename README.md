# API Documentation

## 1. User Authentication & Authorization

- **Register** - Register new users (both property searchers and property owners)  
  `POST /api/auth/register`
  
- **Log In** - Log in users  
  `POST /api/auth/login`
  
- **Log Out** - Log out users  
  `POST /api/auth/logout`
  
- **User Profile** - Get the authenticated user profile  
  `GET /api/auth/me`
  
- **Forgot Password** - Send a password reset link  
  `POST /api/auth/forgot-password`
  
- **Reset Password** - Reset password using a token  
  `POST /api/auth/reset-password`

## 2. User Profiles

- **Get User Profile** - Retrieve profile of a specific user (either searcher or owner)  
  `GET /api/users/:id`
  
- **Update User Profile** - Update personal details, profile picture, etc.  
  `PUT /api/users/:id`

## 3. Property Management

- **Upload Property** - Agent or property owner uploads a new property listing  
  `POST /api/properties`
  
- **List Properties** - View all properties with optional filters (location, price, property type)  
  `GET /api/properties`
  
- **Property Details** - Get details of a specific property  
  `GET /api/properties/:id`
  
- **Update Property** - Update property details (only accessible by the owner/agent)  
  `PUT /api/properties/:id`
  
- **Delete Property** - Remove a property listing (only accessible by the owner/agent)  
  `DELETE /api/properties/:id`
