'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get the first user ID
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users ORDER BY id LIMIT 1"
    );
    
    if (!users || users.length === 0) {
      throw new Error('No user found. Please run user seeder first.');
    }
    
    const userId = users[0].id;
    
    // Sample properties data matching 99acres style
    const properties = [
      {
        user_id: userId,
        property_type: 'Apartment',
        transaction_type: 'Sale',
        title: '3 BHK Apartment for Sale in Whitefield',
        description: 'Spacious 3 BHK apartment in prime location with modern amenities. Well-ventilated rooms, premium finishes, and ready to move in.',
        price: 8500000,
        area: 1650,
        bedrooms: 3,
        bathrooms: 2,
        balconies: 2,
        furnishing_status: 'Semi-Furnished',
        floor_number: 5,
        total_floors: 12,
        parking: true,
        lift: true,
        address: 'Near ITPL, Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560066',
        latitude: 12.9698,
        longitude: 77.7499,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'
        ]),
        amenities: JSON.stringify(['Power Backup', 'Lift', 'Parking', 'Security', 'Gym', 'Swimming Pool']),
        is_featured: true,
        is_active: true,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: userId,
        property_type: 'Villa',
        transaction_type: 'Sale',
        title: '4 BHK Independent Villa for Sale in Koramangala, Bangalore',
        description: 'Luxury 4 BHK independent villa for sale in the heart of Koramangala. This beautifully designed villa features modern architecture with a private garden and spacious interiors. Located in a premium residential area with excellent connectivity to restaurants, shopping malls, and business hubs. The property comes fully furnished with high-end fittings and is perfect for those seeking luxury living in a vibrant neighborhood.',
        price: 15000000,
        area: 2800,
        bedrooms: 4,
        bathrooms: 3,
        balconies: 3,
        furnishing_status: 'Furnished',
        floor_number: 2,
        total_floors: 2,
        parking: true,
        lift: false,
        address: '5th Block, Koramangala',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560095',
        latitude: 12.9352,
        longitude: 77.6245,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
          'https://images.unsplash.com/photo-1600585154526-990dbe4e5e34?w=800&q=80'
        ]),
        amenities: JSON.stringify(['Power Backup', 'Parking', 'Security', 'Garden', 'Modular Kitchen']),
        is_featured: true,
        is_active: true,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: userId,
        property_type: 'Apartment',
        transaction_type: 'Rent',
        title: '2 BHK Apartment for Rent in HSR Layout, Bangalore',
        description: 'Well-maintained 2 BHK apartment available for rent in HSR Layout. This north-facing property is fully furnished and ideally located close to the metro station. The apartment offers modern amenities including modular kitchen, 24/7 water supply, and parking facility. Perfect for working professionals and families seeking a comfortable living space in a well-connected area.',
        price: 35000,
        area: 1100,
        bedrooms: 2,
        bathrooms: 2,
        balconies: 1,
        furnishing_status: 'Furnished',
        floor_number: 3,
        total_floors: 8,
        parking: true,
        lift: true,
        address: '27th Main, HSR Layout',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560102',
        latitude: 12.9115,
        longitude: 77.6450,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        ]),
        amenities: JSON.stringify(['Power Backup', 'Lift', 'Parking', 'Security', 'WiFi', 'Water Supply']),
        is_featured: false,
        is_active: true,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: userId,
        property_type: 'Apartment',
        transaction_type: 'Sale',
        title: '3 BHK Apartment for Sale in Electronic City, Bangalore',
        description: 'Premium 3 BHK apartment for sale in Electronic City. This property offers excellent connectivity to major IT parks and tech companies. Features include modern amenities, quality construction, and a peaceful living environment. The apartment complex includes clubhouse, swimming pool, gym, and landscaped gardens. Ideal investment for those working in the IT sector.',
        price: 7200000,
        area: 1450,
        bedrooms: 3,
        bathrooms: 2,
        balconies: 2,
        furnishing_status: 'Unfurnished',
        floor_number: 7,
        total_floors: 14,
        parking: true,
        lift: true,
        address: 'Phase 1, Electronic City',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560100',
        latitude: 12.8456,
        longitude: 77.6632,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
        ]),
        amenities: JSON.stringify(['Power Backup', 'Lift', 'Parking', 'Security', 'Club House', 'Swimming Pool']),
        is_featured: false,
        is_active: true,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: userId,
        property_type: 'Plot',
        transaction_type: 'Sale',
        title: 'Residential Plot for Sale in Hebbal, Bangalore',
        description: 'Prime residential plot for sale in Hebbal, near the scenic Hebbal Lake. This approved layout plot comes with clear title and is ready for immediate construction. The location offers excellent connectivity to the airport and major business districts. Perfect investment opportunity for those looking to build their dream home or for future appreciation.',
        price: 4500000,
        area: 2400,
        bedrooms: 0,
        bathrooms: 0,
        balconies: 0,
        furnishing_status: null,
        floor_number: null,
        total_floors: null,
        parking: false,
        lift: false,
        address: 'Near Hebbal Lake',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560024',
        latitude: 13.0358,
        longitude: 77.5970,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'
        ]),
        amenities: JSON.stringify(['Approved Layout', 'Clear Title', 'Good Connectivity']),
        is_featured: false,
        is_active: true,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: userId,
        property_type: 'Villa',
        transaction_type: 'Rent',
        title: '3 BHK Independent Villa for Rent in Indiranagar, Bangalore',
        description: 'Beautiful 3 BHK independent villa available for rent in prime Indiranagar location. This stunning property features a private garden and spacious terrace, perfect for entertaining. The villa is fully furnished with modern amenities and is pet-friendly. Located on 100 Feet Road with easy access to restaurants, cafes, and shopping areas. Ideal for families seeking luxury rental accommodation.',
        price: 85000,
        area: 2200,
        bedrooms: 3,
        bathrooms: 2,
        balconies: 2,
        furnishing_status: 'Furnished',
        floor_number: 2,
        total_floors: 2,
        parking: true,
        lift: false,
        address: '100 Feet Road, Indiranagar',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560038',
        latitude: 12.9784,
        longitude: 77.6408,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&q=80',
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80'
        ]),
        amenities: JSON.stringify(['Parking', 'Security', 'Garden', 'Terrace', 'Fully Furnished']),
        is_featured: true,
        is_active: true,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: userId,
        property_type: 'Apartment',
        transaction_type: 'Sale',
        title: '4 BHK Luxury Apartment for Sale in JP Nagar, Bangalore',
        description: 'Spacious 4 BHK luxury apartment for sale in JP Nagar 7th Phase. This premium property features branded fittings, modern design, and is ready for possession. The apartment complex offers world-class amenities including swimming pool, gym, clubhouse, landscaped gardens, and 24/7 security. Located in a well-established neighborhood with excellent connectivity to schools, hospitals, and shopping centers.',
        price: 12500000,
        area: 2200,
        bedrooms: 4,
        bathrooms: 3,
        balconies: 3,
        furnishing_status: 'Semi-Furnished',
        floor_number: 10,
        total_floors: 18,
        parking: true,
        lift: true,
        address: '7th Phase, JP Nagar',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560078',
        latitude: 12.8996,
        longitude: 77.5845,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
        ]),
        amenities: JSON.stringify(['Power Backup', 'Lift', 'Parking', 'Security', 'Gym', 'Swimming Pool', 'Club House', 'Landscaped Gardens']),
        is_featured: true,
        is_active: true,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        user_id: userId,
        property_type: 'Commercial',
        transaction_type: 'Rent',
        title: 'Office Space for Rent in MG Road, Bangalore',
        description: 'Premium office space available for rent in MG Road, the central business district of Bangalore. This fully air-conditioned commercial space is ready to move in and ideal for corporate setup. Features include high-speed internet connectivity, power backup, security services, and dedicated parking. Perfect location for businesses seeking prime commercial space with excellent connectivity and professional environment.',
        price: 120000,
        area: 2500,
        bedrooms: 0,
        bathrooms: 2,
        balconies: 0,
        furnishing_status: 'Semi-Furnished',
        floor_number: 5,
        total_floors: 10,
        parking: true,
        lift: true,
        address: 'MG Road, Central Business District',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        latitude: 12.9716,
        longitude: 77.5946,
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'
        ]),
        amenities: JSON.stringify(['Air Conditioning', 'Lift', 'Parking', 'Security', 'Power Backup', 'High Speed Internet']),
        is_featured: false,
        is_active: true,
        views: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('properties', properties);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('properties', null, {});
  }
};

