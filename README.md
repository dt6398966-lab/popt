# 99acres Clone - Real Estate Platform

An exact clone of 99acres.com built with Node.js, Express, EJS, and MySQL using Sequelize ORM.

## Features

- **Property Listings**: Browse properties for Sale/Rent
- **Advanced Search**: Search by location, type, price, and more
- **Property Details**: Comprehensive property information with images
- **User Authentication**: Sign up, login, and logout
- **Post Properties**: List your properties for sale or rent
- **Agent Profiles**: Find and connect with real estate agents
- **Favorites**: Save favorite properties
- **Enquiries**: Contact property owners
- **Responsive Design**: Mobile-friendly interface matching 99acres design

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS (Embedded JavaScript)
- **Database**: MySQL
- **ORM**: Sequelize
- **Styling**: Custom CSS matching 99acres design

## Installation

1. **Clone the repository**
   ```bash
   cd 99acres
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=99acres_db
     DB_PORT=3306
     SESSION_SECRET=your-secret-key
     PORT=3000
     ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE 99acres_db;
   ```

5. **Run migrations**
   ```bash
   npm run migrate
   ```

6. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
99acres/
├── config/
│   └── database.js          # Sequelize database configuration
├── controllers/             # Route controllers
│   ├── authController.js
│   ├── propertyController.js
│   ├── searchController.js
│   ├── agentController.js
│   ├── enquiryController.js
│   └── indexController.js
├── migrations/              # Database migrations
│   ├── 20240101000001-create-users.js
│   ├── 20240101000002-create-properties.js
│   ├── 20240101000003-create-agents.js
│   ├── 20240101000004-create-enquiries.js
│   └── 20240101000005-create-favorites.js
├── models/                  # Sequelize models
│   ├── index.js
│   ├── user.js
│   ├── property.js
│   ├── agent.js
│   ├── enquiry.js
│   └── favorite.js
├── routes/                  # Express routes
│   ├── index.js
│   ├── auth.js
│   ├── properties.js
│   ├── search.js
│   └── agents.js
├── views/                   # EJS templates
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── auth/
│   ├── properties/
│   ├── agents/
│   ├── search/
│   └── error.ejs
├── public/                  # Static files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
├── server.js                # Main server file
├── package.json
└── README.md
```

## Database Schema

### Users Table
- id, name, email, phone, password, user_type, is_verified

### Properties Table
- id, user_id, property_type, transaction_type, title, description
- price, area, bedrooms, bathrooms, balconies
- furnishing_status, floor_number, total_floors
- parking, lift, address, city, state, pincode
- latitude, longitude, images, amenities
- is_featured, is_active, views

### Agents Table
- id, user_id, company_name, experience_years
- specialization, profile_image, bio
- rating, total_properties, is_verified

### Enquiries Table
- id, property_id, user_id, name, email, phone, message, status

### Favorites Table
- id, user_id, property_id

## Usage

### Post a Property
1. Login or create an account
2. Click "Post Property" in the navigation
3. Fill in property details
4. Submit the form

### Search Properties
1. Use the search box on the homepage
2. Apply filters on the properties page
3. Click on a property to view details

### Contact Owner
1. View property details
2. Fill in the enquiry form
3. Submit to contact the owner

## Notes

- Make sure MySQL is running before starting the server
- Create the database before running migrations
- Add property images to `/public/images/` directory
- Default port is 3000 (configurable in `.env`)

## License

This project is for educational purposes only.

