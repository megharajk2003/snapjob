import sql from "@/app/api/utils/sql";

// Create new user
export async function POST(request) {
  try {
    const {
      phone,
      name,
      role,
      language = 'en',
      profileImageUrl,
      location,
      bio,
      latitude,
      longitude,
      skills = [],
      portfolioImages = []
    } = await request.json();

    // Validate required fields
    if (!phone || !name || !role) {
      return Response.json(
        { error: 'Phone, name, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['hirer', 'provider'].includes(role)) {
      return Response.json(
        { error: 'Role must be either hirer or provider' },
        { status: 400 }
      );
    }

    // Start transaction
    const results = await sql.transaction(async (txn) => {
      // Create user
      const [user] = await txn`
        INSERT INTO users (
          phone, name, role, language, profile_image_url, location, bio, 
          latitude, longitude, is_available
        ) VALUES (
          ${phone}, ${name}, ${role}, ${language}, ${profileImageUrl}, ${location}, ${bio},
          ${latitude}, ${longitude}, ${role === 'provider'}
        )
        RETURNING *
      `;

      // Add skills for providers
      if (role === 'provider' && skills.length > 0) {
        const skillInserts = skills.map(skill => 
          txn`INSERT INTO user_skills (user_id, skill_category) VALUES (${user.id}, ${skill})`
        );
        await Promise.all(skillInserts);
      }

      // Add portfolio images for providers
      if (role === 'provider' && portfolioImages.length > 0) {
        const portfolioInserts = portfolioImages.map(imageUrl => 
          txn`INSERT INTO user_portfolio (user_id, image_url) VALUES (${user.id}, ${imageUrl})`
        );
        await Promise.all(portfolioInserts);
      }

      return [user];
    });

    const [user] = results;

    return Response.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        language: user.language,
        profileImageUrl: user.profile_image_url,
        location: user.location,
        bio: user.bio,
        isVerified: user.is_verified,
        isAvailable: user.is_available,
        rating: parseFloat(user.rating),
        totalReviews: user.total_reviews,
        totalJobs: user.total_jobs,
        totalEarnings: user.total_earnings,
        totalSpent: user.total_spent,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return Response.json(
        { error: 'Phone number already exists' },
        { status: 409 }
      );
    }

    return Response.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Get users with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const category = searchParams.get('category');
    const available = searchParams.get('available');
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const radius = searchParams.get('radius') || '10'; // km
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereConditions = [];
    let params = [];

    // Build where conditions dynamically
    if (role) {
      whereConditions.push('u.role = $' + (params.length + 1));
      params.push(role);
    }

    if (available === 'true') {
      whereConditions.push('u.is_available = true');
    }

    // Location-based filtering using Haversine formula
    if (latitude && longitude) {
      whereConditions.push(`
        (6371 * acos(cos(radians($${params.length + 1})) * cos(radians(u.latitude)) * 
        cos(radians(u.longitude) - radians($${params.length + 2})) + 
        sin(radians($${params.length + 1})) * sin(radians(u.latitude)))) < $${params.length + 3}
      `);
      params.push(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));
    }

    // Category filter for providers
    if (category && role === 'provider') {
      whereConditions.push('EXISTS (SELECT 1 FROM user_skills us WHERE us.user_id = u.id AND us.skill_category = $' + (params.length + 1) + ')');
      params.push(category);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Build the complete query
    const queryText = `
      SELECT 
        u.*,
        COALESCE(
          (6371 * acos(cos(radians($${latitude ? params.indexOf(parseFloat(latitude)) + 1 : 'NULL'})) * cos(radians(u.latitude)) * 
          cos(radians(u.longitude) - radians($${longitude ? params.indexOf(parseFloat(longitude)) + 1 : 'NULL'})) + 
          sin(radians($${latitude ? params.indexOf(parseFloat(latitude)) + 1 : 'NULL'})) * sin(radians(u.latitude)))), 0
        ) as distance_km
      FROM users u
      ${whereClause}
      ORDER BY ${latitude && longitude ? 'distance_km ASC,' : ''} u.rating DESC, u.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const users = await sql(queryText, params);

    // Get skills and portfolio for each provider
    const userIds = users.map(u => u.id);
    let skillsMap = {};
    let portfolioMap = {};

    if (userIds.length > 0) {
      // Get skills
      const skills = await sql`
        SELECT user_id, skill_category 
        FROM user_skills 
        WHERE user_id = ANY(${userIds})
      `;

      skillsMap = skills.reduce((acc, skill) => {
        if (!acc[skill.user_id]) acc[skill.user_id] = [];
        acc[skill.user_id].push(skill.skill_category);
        return acc;
      }, {});

      // Get portfolio images
      const portfolio = await sql`
        SELECT user_id, image_url 
        FROM user_portfolio 
        WHERE user_id = ANY(${userIds})
        ORDER BY created_at ASC
      `;

      portfolioMap = portfolio.reduce((acc, item) => {
        if (!acc[item.user_id]) acc[item.user_id] = [];
        acc[item.user_id].push(item.image_url);
        return acc;
      }, {});
    }

    const formattedUsers = users.map(user => ({
      id: user.id,
      phone: user.phone,
      name: user.name,
      role: user.role,
      language: user.language,
      profileImageUrl: user.profile_image_url,
      location: user.location,
      bio: user.bio,
      latitude: user.latitude ? parseFloat(user.latitude) : null,
      longitude: user.longitude ? parseFloat(user.longitude) : null,
      isVerified: user.is_verified,
      isAvailable: user.is_available,
      rating: parseFloat(user.rating),
      totalReviews: user.total_reviews,
      totalJobs: user.total_jobs,
      totalEarnings: user.total_earnings,
      totalSpent: user.total_spent,
      skills: skillsMap[user.id] || [],
      portfolioImages: portfolioMap[user.id] || [],
      distanceKm: user.distance_km ? parseFloat(user.distance_km) : null,
      createdAt: user.created_at
    }));

    return Response.json({
      success: true,
      users: formattedUsers,
      pagination: {
        limit,
        offset,
        hasMore: users.length === limit
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}