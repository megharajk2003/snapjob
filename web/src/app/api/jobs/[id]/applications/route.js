import sql from "@/app/api/utils/sql";

// Apply for a job
export async function POST(request, { params }) {
  try {
    const { id: jobId } = params;
    const { providerId, applicationMessage = '' } = await request.json();

    if (!providerId) {
      return Response.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      );
    }

    // Validate provider exists and is a provider
    const [provider] = await sql`
      SELECT id, role FROM users WHERE id = ${providerId}
    `;

    if (!provider) {
      return Response.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    if (provider.role !== 'provider') {
      return Response.json(
        { error: 'Only providers can apply for jobs' },
        { status: 403 }
      );
    }

    // Validate job exists and is open
    const [job] = await sql`
      SELECT id, status, hirer_id FROM jobs WHERE id = ${jobId}
    `;

    if (!job) {
      return Response.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.status !== 'open') {
      return Response.json(
        { error: 'Job is no longer accepting applications' },
        { status: 400 }
      );
    }

    // Check if provider already applied
    const [existingApplication] = await sql`
      SELECT id FROM job_applications 
      WHERE job_id = ${jobId} AND provider_id = ${providerId}
    `;

    if (existingApplication) {
      return Response.json(
        { error: 'You have already applied for this job' },
        { status: 409 }
      );
    }

    // Create application
    const [application] = await sql`
      INSERT INTO job_applications (job_id, provider_id, application_message)
      VALUES (${jobId}, ${providerId}, ${applicationMessage})
      RETURNING *
    `;

    return Response.json({
      success: true,
      application: {
        id: application.id,
        jobId: application.job_id,
        providerId: application.provider_id,
        status: application.status,
        applicationMessage: application.application_message,
        createdAt: application.created_at
      }
    });

  } catch (error) {
    console.error('Error creating job application:', error);
    return Response.json(
      { error: 'Failed to apply for job' },
      { status: 500 }
    );
  }
}

// Get applications for a job
export async function GET(request, { params }) {
  try {
    const { id: jobId } = params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Validate job exists
    const [job] = await sql`
      SELECT id, hirer_id FROM jobs WHERE id = ${jobId}
    `;

    if (!job) {
      return Response.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    let whereCondition = 'ja.job_id = $1';
    let queryParams = [jobId];

    if (status) {
      whereCondition += ' AND ja.status = $2';
      queryParams.push(status);
    }

    const queryText = `
      SELECT 
        ja.*,
        p.name as provider_name,
        p.rating as provider_rating,
        p.profile_image_url as provider_profile_image,
        p.total_jobs as provider_total_jobs,
        p.is_verified as provider_is_verified
      FROM job_applications ja
      JOIN users p ON ja.provider_id = p.id
      WHERE ${whereCondition}
      ORDER BY ja.created_at ASC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(limit, offset);

    const applications = await sql(queryText, queryParams);

    // Get skills for each provider
    const providerIds = applications.map(app => app.provider_id);
    let skillsMap = {};

    if (providerIds.length > 0) {
      const skills = await sql`
        SELECT user_id, skill_category 
        FROM user_skills 
        WHERE user_id = ANY(${providerIds})
      `;

      skillsMap = skills.reduce((acc, skill) => {
        if (!acc[skill.user_id]) acc[skill.user_id] = [];
        acc[skill.user_id].push(skill.skill_category);
        return acc;
      }, {});
    }

    const formattedApplications = applications.map(app => ({
      id: app.id,
      jobId: app.job_id,
      providerId: app.provider_id,
      status: app.status,
      applicationMessage: app.application_message,
      provider: {
        name: app.provider_name,
        rating: parseFloat(app.provider_rating),
        profileImageUrl: app.provider_profile_image,
        totalJobs: app.provider_total_jobs,
        isVerified: app.provider_is_verified,
        skills: skillsMap[app.provider_id] || []
      },
      createdAt: app.created_at,
      updatedAt: app.updated_at
    }));

    return Response.json({
      success: true,
      applications: formattedApplications,
      pagination: {
        limit,
        offset,
        hasMore: applications.length === limit
      }
    });

  } catch (error) {
    console.error('Error fetching job applications:', error);
    return Response.json(
      { error: 'Failed to fetch job applications' },
      { status: 500 }
    );
  }
}