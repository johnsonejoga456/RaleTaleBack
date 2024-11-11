# RALETALE

> "A comprehensive platform for property listing, allowing property owners to post listings and searchers to find their ideal homes."

---

## Overview

This project is a full-stack web application designed to streamline the real estate search and listing process. It enables property owners and agents to list properties, while potential tenants or buyers can explore and filter through listings based on various criteria, like location, price, and property type.

### Key Features

- **User Authentication & Authorization**  
  Secure registration and login system, supporting both property searchers and property owners.

- **User Profiles**  
  Personalized user profiles for both property searchers and owners, with options to update profile information and profile pictures.

- **Property Management**  
  End-to-end property management, including listing, updating, viewing, and deleting properties, with options for custom search filters.

### Tech Stack

- **Frontend**: ReactJs/Next.js, Tailwind CSS
- **Backend**:  Node.js, Express.js
- **Database**: MongoDB
- **Authentication**:  JWT, OAuth

---

## Installation

Provide brief instructions for setting up the project locally.

```bash
# Clone the repository
git clone https://github.com/Yemipidan-org/RaleTaleFrontend.git

# Navigate to the project directory
cd RaleTaleFrontend

# Install dependencies
npm install

# Run the application
npm run dev
```


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
