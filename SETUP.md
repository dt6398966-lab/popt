# Setup Instructions for 99acres Clone

## Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
1. Create MySQL database:
   ```sql
   CREATE DATABASE 99acres_db;
   ```

2. Create `.env` file in the root directory:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=99acres_db
   DB_PORT=3306
   SESSION_SECRET=your-secret-key-here
   PORT=3000
   ```

3. Run migrations to create tables:
   ```bash
   npm run migrate
   ```

### 3. Start the Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and go to: `http://localhost:3000`

## Features Available

- **Homepage**: Search properties, browse featured listings
- **Properties**: View all properties with filters (price, location, type, bedrooms)
- **Property Details**: Full property information with enquiry form
- **Post Property**: Create account and list properties
- **Agents**: Browse real estate agents
- **Authentication**: Sign up and login system

## Testing the Application

1. **Create an Account**: 
   - Go to `/auth/signup`
   - Fill in details and create account

2. **Post a Property**:
   - Login
   - Go to `/properties/create`
   - Fill in property details and submit

3. **Search Properties**:
   - Use the search bar on homepage
   - Apply filters on properties page

4. **Contact Owner**:
   - View any property detail page
   - Fill in enquiry form

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify database credentials in `.env`
- Ensure database `99acres_db` exists

### Migration Errors
- Make sure database is created
- Check user has proper permissions
- Run `npm run migrate:undo` if needed, then retry

### Port Already in Use
- Change PORT in `.env` file
- Or stop the process using port 3000

## Notes

- Images are using placeholder URLs. You can add image upload functionality later.
- Property amenities are entered as comma-separated values.
- All prices are in INR (₹).

