import sql from "@/app/api/utils/sql";

// Create new job
export async function POST(request) {
  try {
    const {
      hirerId,
      title,
      description,
      category,
      budget,
      budgetType,
      location,
      latitude,
      longitude,
      isUrgent = false
    } = await request.json();

    // Validate required fields
    if (!hirerId || !title || !description || !category || !budget || !budgetType || !location) {
      return Response.json(
        { error: 'All job fields are required' },
        { status: 400 }
      );
    }

    // Validate budget type
    if (!['fixed', 'hourly'].includes(budgetType)) {
      return Response.json(
        { error: 'Budget type must be either fixed or hourly' },
        { status: 400 }
      );
    }

    // Validate hirer exists and is a hirer
    const [hirer] = await sql`
      SELECT id, role FROM users WHERE id = ${hirerId}
    `;

    if (!hirer) {
      return Response.json(
        { error: 'Hirer not found' },
        { status: 404 }
      );
    }

    if (hirer.role !== 'hirer') {
      return Response.json(
        { error: 'Only hirers can post jobs' },
        { status: 403 }
      );
    }

    const [job] = await sql`
      INSERT INTO jobs (
        hirer_id, title, description, category, budget, budget_type,
        location, latitude, longitude, is_urgent
      ) VALUES (
        ${hirerId}, ${title}, ${description}, ${category}, ${budget}, ${budgetType},
        ${location}, ${latitude}, ${longitude}, ${isUrgent}
      )
      RETURNING *
    `;

    return Response.json({
      success: true,
      job: {
        id: job.id,
        hirerId: job.hirer_id,
        title: job.title,
        description: job.description,
        category: job.category,
        budget: job.budget,
        budgetType: job.budget_type,
        location: job.location,
        latitude: job.latitude ? parseFloat(job.latitude) : null,
        longitude: job.longitude ? parseFloat(job.longitude) : null,
        isUrgent: job.is_urgent,
        status: job.status,
        createdAt: job.created_at
      }
    });

  } catch (error) {
    console.error('Error creating job:', error);
    return Response.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

// Get jobs with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hirerId = searchParams.get('hirerId');
    const providerId = searchParams.get('providerId');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const radius = searchParams.get('radius') || '10'; // km
    const isUrgent = searchParams.get('isUrgent');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereConditions = [];
    let params = [];

    // Build where conditions dynamically
    if (hirerId) {
      whereConditions.push('j.hirer_id = $' + (params.length + 1));
      params.push(hirerId);
    }

    if (providerId) {
      whereConditions.push('j.provider_id = $' + (params.length + 1));
      params.push(providerId);
    }

    if (category) {
      whereConditions.push('j.category = $' + (params.length + 1));
      params.push(category);
    }

    if (status) {
      whereConditions.push('j.status = $' + (params.length + 1));
      params.push(status);
    } else {
      // Default to open jobs for browsing
      whereConditions.push("j.status = 'open'");
    }

    if (isUrgent === 'true') {
      whereConditions.push('j.is_urgent = true');
    }

    // Location-based filtering
    if (latitude && longitude) {
      whereConditions.push(`
        (6371 * acos(cos(radians($${params.length + 1})) * cos(radians(j.latitude)) * 
        cos(radians(j.longitude) - radians($${params.length + 2})) + 
        sin(radians($${params.length + 1})) * sin(radians(j.latitude)))) < $${params.length + 3}
      `);
      params.push(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    const queryText = `
      SELECT 
        j.*,
        h.name as hirer_name,
        h.rating as hirer_rating,
        h.profile_image_url as hirer_profile_image,
        p.name as provider_name,
        p.rating as provider_rating,
        p.profile_image_url as provider_profile_image,
        COALESCE(
          (6371 * acos(cos(radians($${latitude ? params.indexOf(parseFloat(latitude)) + 1 : 'NULL'})) * cos(radians(j.latitude)) * 
          cos(radians(j.longitude) - radians($${longitude ? params.indexOf(parseFloat(longitude)) + 1 : 'NULL'})) + 
          sin(radians($${latitude ? params.indexOf(parseFloat(latitude)) + 1 : 'NULL'})) * sin(radians(j.latitude)))), 0
        ) as distance_km,
        (SELECT COUNT(*) FROM job_applications ja WHERE ja.job_id = j.id) as application_count
      FROM jobs j
      JOIN users h ON j.hirer_id = h.id
      LEFT JOIN users p ON j.provider_id = p.id
      ${whereClause}
      ORDER BY 
        j.is_urgent DESC,
        ${latitude && longitude ? 'distance_km ASC,' : ''} 
        j.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    params.push(limit, offset);

    const jobs = await sql(queryText, params);

    const formattedJobs = jobs.map(job => ({
      id: job.id,
      hirerId: job.hirer_id,
      providerId: job.provider_id,
      title: job.title,
      description: job.description,
      category: job.category,
      budget: job.budget,
      budgetType: job.budget_type,
      location: job.location,
      latitude: job.latitude ? parseFloat(job.latitude) : null,
      longitude: job.longitude ? parseFloat(job.longitude) : null,
      isUrgent: job.is_urgent,
      status: job.status,
      applicationCount: job.application_count,
      distanceKm: job.distance_km ? parseFloat(job.distance_km) : null,
      hirer: {
        name: job.hirer_name,
        rating: parseFloat(job.hirer_rating),
        profileImageUrl: job.hirer_profile_image
      },
      provider: job.provider_id ? {
        name: job.provider_name,
        rating: parseFloat(job.provider_rating),
        profileImageUrl: job.provider_profile_image
      } : null,
      assignedAt: job.assigned_at,
      startedAt: job.started_at,
      completedAt: job.completed_at,
      createdAt: job.created_at,
      updatedAt: job.updated_at
    }));

    return Response.json({
      success: true,
      jobs: formattedJobs,
      pagination: {
        limit,
        offset,
        hasMore: jobs.length === limit
      }
    });

  } catch (error) {
    console.error('Error fetching jobs:', error);
    return Response.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}