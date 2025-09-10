import sql from "@/app/api/utils/sql";

// Get single user by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const [user] = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;

    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user skills if provider
    let skills = [];
    let portfolioImages = [];

    if (user.role === 'provider') {
      skills = await sql`
        SELECT skill_category 
        FROM user_skills 
        WHERE user_id = ${id}
      `;

      portfolioImages = await sql`
        SELECT image_url 
        FROM user_portfolio 
        WHERE user_id = ${id}
        ORDER BY created_at ASC
      `;
    }

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
        latitude: user.latitude ? parseFloat(user.latitude) : null,
        longitude: user.longitude ? parseFloat(user.longitude) : null,
        isVerified: user.is_verified,
        isAvailable: user.is_available,
        rating: parseFloat(user.rating),
        totalReviews: user.total_reviews,
        totalJobs: user.total_jobs,
        totalEarnings: user.total_earnings,
        totalSpent: user.total_spent,
        skills: skills.map(s => s.skill_category),
        portfolioImages: portfolioImages.map(p => p.image_url),
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return Response.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();

    const {
      name,
      profileImageUrl,
      location,
      bio,
      latitude,
      longitude,
      isAvailable,
      skills,
      portfolioImages
    } = updateData;

    // Build update query dynamically
    let updateFields = [];
    let updateValues = [];
    let paramCount = 0;

    if (name !== undefined) {
      updateFields.push(`name = $${++paramCount}`);
      updateValues.push(name);
    }

    if (profileImageUrl !== undefined) {
      updateFields.push(`profile_image_url = $${++paramCount}`);
      updateValues.push(profileImageUrl);
    }

    if (location !== undefined) {
      updateFields.push(`location = $${++paramCount}`);
      updateValues.push(location);
    }

    if (bio !== undefined) {
      updateFields.push(`bio = $${++paramCount}`);
      updateValues.push(bio);
    }

    if (latitude !== undefined) {
      updateFields.push(`latitude = $${++paramCount}`);
      updateValues.push(latitude);
    }

    if (longitude !== undefined) {
      updateFields.push(`longitude = $${++paramCount}`);
      updateValues.push(longitude);
    }

    if (isAvailable !== undefined) {
      updateFields.push(`is_available = $${++paramCount}`);
      updateValues.push(isAvailable);
    }

    // Always update the updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`);

    if (updateFields.length === 1) { // Only updated_at was added
      return Response.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const results = await sql.transaction(async (txn) => {
      // Update user
      const queryText = `
        UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = $${++paramCount} 
        RETURNING *
      `;
      updateValues.push(id);

      const [user] = await txn(queryText, updateValues);

      if (!user) {
        throw new Error('User not found');
      }

      // Update skills if provided and user is provider
      if (skills !== undefined && user.role === 'provider') {
        // Delete existing skills
        await txn`DELETE FROM user_skills WHERE user_id = ${id}`;
        
        // Insert new skills
        if (skills.length > 0) {
          const skillInserts = skills.map(skill => 
            txn`INSERT INTO user_skills (user_id, skill_category) VALUES (${id}, ${skill})`
          );
          await Promise.all(skillInserts);
        }
      }

      // Update portfolio images if provided and user is provider
      if (portfolioImages !== undefined && user.role === 'provider') {
        // Delete existing portfolio images
        await txn`DELETE FROM user_portfolio WHERE user_id = ${id}`;
        
        // Insert new portfolio images
        if (portfolioImages.length > 0) {
          const portfolioInserts = portfolioImages.map(imageUrl => 
            txn`INSERT INTO user_portfolio (user_id, image_url) VALUES (${id}, ${imageUrl})`
          );
          await Promise.all(portfolioInserts);
        }
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
        latitude: user.latitude ? parseFloat(user.latitude) : null,
        longitude: user.longitude ? parseFloat(user.longitude) : null,
        isVerified: user.is_verified,
        isAvailable: user.is_available,
        rating: parseFloat(user.rating),
        totalReviews: user.total_reviews,
        totalJobs: user.total_jobs,
        totalEarnings: user.total_earnings,
        totalSpent: user.total_spent,
        updatedAt: user.updated_at
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.message === 'User not found') {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const [deletedUser] = await sql`
      DELETE FROM users WHERE id = ${id} RETURNING id, name
    `;

    if (!deletedUser) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: `User ${deletedUser.name} deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}