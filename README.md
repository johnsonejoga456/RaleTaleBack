1. User Authentication & Authorization
    POST /api/auth/register - Register new users (both property searchers and property owners).
    POST /api/auth/login - Log in users.
    POST /api/auth/logout - Log out users.
    GET /api/auth/me - Get the authenticated user profile.
    POST /api/auth/forgot-password - Send a password reset link.
    POST /api/auth/reset-password - Reset password using a token.
2. User Profiles
    GET /api/users/:id - Get a user profile (either searcher or owner).
    PUT /api/users/:id - Update user profile (e.g., personal details, profile picture).
3. Property Management
    POST /api/properties - Agent or property owner uploads a new property listing.
    GET /api/properties - List all properties (with optional filters like location, price, property type).
    GET /api/properties/:id - Get details of a specific property.
    PUT /api/properties/:id - Update property details (accessible only by the owner/agent).
    DELETE /api/properties/:id - Delete a property listing (accessible only by the owner/agent).
