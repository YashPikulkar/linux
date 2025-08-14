const e = require("express");
const pool = require("../config/db");

// ✅ Create Job (for recruiter)
exports.createJob = async (req, res) => {
  console.log("Creating job with data:", req.body);
  try {
    const {
      custom_title, // Changed from 'title' to match DB field
      job_type,
      mode_of_work,
      experience_min, // Changed from 'exp_required' to match DB field
      experience_max, // New field from DB schema
      salary_min, // Changed from 'salary' to match DB field
      salary_max, // New field from DB schema
      equity_min, // New field from DB schema
      equity_max, // New field from DB schema
      opening, // New field from DB schema
      qualification_id, // New field from DB schema
      marketid, // New field from DB schema
      lid, // Keeping same
      skillids, // Keeping same
      smallDescription, // Keeping same
      bigDescription, // Keeping same
      links, // This might be stored elsewhere or ignored
    } = req.body;

    const userEmail = req.user?.email;

    if (!userEmail) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Recruiter not authenticated" });
    }

    const [userRows] = await pool.query(
      "SELECT uid FROM users WHERE email = ?",
      [userEmail]
    );

    if (userRows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const uid = userRows[0].uid;

    const [companyRows] = await pool.query(
      "SELECT cid FROM recruiters WHERE uid = ?",
      [uid]
    );

    if (companyRows.length === 0) {
      return res
        .status(400)
        .json({ message: "Company not found for this user" });
    }

    const cid = companyRows[0].cid;

    // Validation - Updated field names
    if (
      !custom_title ||
      !job_type ||
      !mode_of_work ||
      experience_min === undefined ||
      salary_min === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate location if provided
    if (lid) {
      const [locationRows] = await pool.query(
        "SELECT lid FROM locations WHERE lid = ?",
        [lid]
      );
      if (locationRows.length === 0) {
        return res.status(400).json({ message: "Invalid location selected" });
      }
    }

    // Validate qualification if provided
    if (qualification_id) {
      const [qualificationRows] = await pool.query(
        "SELECT qualification_id FROM qualification WHERE qualification_id = ?",
        [qualification_id]
      );
      if (qualificationRows.length === 0) {
        return res
          .status(400)
          .json({ message: "Invalid qualification selected" });
      }
    }

    // Validate market if provided
    if (marketid) {
      const [marketRows] = await pool.query(
        "SELECT mid FROM markets WHERE mid = ?",
        [marketid]
      );
      if (marketRows.length === 0) {
        return res.status(400).json({ message: "Invalid market selected" });
      }
    }

    // Salary parsing and validation
    const parsedSalaryMin = parseInt(salary_min);
    const parsedSalaryMax = salary_max ? parseInt(salary_max) : null;

    if (isNaN(parsedSalaryMin) || parsedSalaryMin < 1000) {
      return res.status(400).json({ message: "Invalid minimum salary amount" });
    }

    if (parsedSalaryMax && parsedSalaryMax < parsedSalaryMin) {
      return res
        .status(400)
        .json({ message: "Maximum salary cannot be less than minimum salary" });
    }

    // Insert query with updated field names
    const [result] = await pool.query(
      `INSERT INTO jobs (
        uid, cid, lid, custom_title, bigDescription, smallDescription, 
        posted, job_type, mode_of_work, experience_min, experience_max,
        salary_min, salary_max, equity_min, equity_max, opening,
        qualification_id, marketid, skillids
      ) VALUES (?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uid,
        cid,
        lid,
        custom_title,
        bigDescription,
        smallDescription,
        job_type,
        mode_of_work,
        experience_min || 0,
        experience_max || 0,
        parsedSalaryMin,
        parsedSalaryMax,
        equity_min || 0,
        equity_max || 0,
        opening || 1,
        qualification_id || null,
        marketid || null,
        JSON.stringify(skillids),
      ]
    );

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      jobid: result.insertId,
      job: {
        jobid: result.insertId,
        custom_title,
        bigDescription,
        smallDescription,
        job_type,
        mode_of_work,
        experience_min: experience_min || 0,
        experience_max: experience_max || 0,
        salary_min: parsedSalaryMin,
        salary_max: parsedSalaryMax,
        equity_min: equity_min || 0,
        equity_max: equity_max || 0,
        opening: opening || 1,
        qualification_id: qualification_id || null,
        marketid: marketid || null,
        skillids,
        lid,
        cid,
        uid,
        posted: new Date().toISOString().split("T")[0],
      },
    });
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
};

// ✅ Get All Jobs (public)
exports.getJobs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM jobs ORDER BY posted DESC");

    if (rows.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    res.status(200).json({ jobs: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Job by ID (public)
exports.getJobById = async (req, res) => {
  try {
    const jobid = req.params.jobid;

    const [rows] = await pool.query("SELECT * FROM jobs WHERE jobid = ?", [
      jobid,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ job: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//
exports.getRecommendedJobs = async (req, res) => {
  const uid = req.user?.id;
  if (!uid) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }

  try {
    const [skillRows] = await pool.query(
      `SELECT skillid FROM applicant_skills WHERE uid = ?`,
      [uid]
    );

    if (skillRows.length === 0) {
      return res.status(404).json({ message: "No skills found for the user" });
    }

    const skillIds = skillRows.map((row) => row.skillid);
    const placeholders = skillIds
      .map(() => "JSON_CONTAINS(skillids, JSON_ARRAY(?))")
      .join(" OR ");

    const [jobs] = await pool.query(
      `SELECT * FROM jobs WHERE ${placeholders} ORDER BY posted DESC`,
      skillIds
    );

    for (let job of jobs) {
      const [locationData] = await pool.query(
        `SELECT lname FROM locations WHERE lid = ?`,
        [job.lid]
      );

      const [companyData] = await pool.query(
        `SELECT name, location, status, tags, type FROM company WHERE cid = ?`,
        [job.cid]
      );

      job.location = locationData[0]?.lname || null;
      job.company = companyData[0] || null;
    }

    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Jobs Posted by Recruiter (by uid)
exports.getJobsByRecruiter = async (req, res) => {
  const email = req.user?.email;
  if (!email) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Recruiter not authenticated" });
  }

  const [userRows] = await pool.query("SELECT uid FROM users WHERE email = ?", [
    email,
  ]);

  if (userRows.length === 0) {
    return res.status(401).json({ message: "User not found" });
  }

  const uid = userRows[0].uid;

  if (!uid) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Recruiter not authenticated" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM jobs WHERE uid = ? ORDER BY posted DESC",
      [uid]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found for this recruiter" });
    }

    res.status(200).json({ jobs: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Job by jobid (only by the recruiter who posted it)
exports.updateJob = async (req, res) => {
  const jobid = req.params.jobid;
  const uid = req.user?.id;

  if (!uid) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Recruiter not authenticated" });
  }

  try {
    const {
      title,
      jobType,
      modeOfWork,
      experienceRequired,
      salary,
      location,
      skills,
      recruiterEmail,
      recruiterName,
      description,
    } = req.body;

    // First, check if the job exists and belongs to the user
    const [existingJob] = await pool.query(
      "SELECT * FROM jobs WHERE jobid = ? AND uid = ?",
      [jobid, uid]
    );

    if (existingJob.length === 0) {
      return res
        .status(404)
        .json({ message: "Job not found or unauthorized to update" });
    }

    // Parse existing description to merge with updates
    let existingDescription = {};
    try {
      existingDescription = JSON.parse(existingJob[0].description);
    } catch (error) {
      console.log("Error parsing existing description:", error);
    }

    // Create updated description object
    const updatedDescription = {
      ...existingDescription,
      jobType: jobType || existingDescription.jobType || "Full-time",
      modeOfWork: modeOfWork || existingDescription.modeOfWork || "Office",
      experienceRequired:
        experienceRequired ||
        existingDescription.experienceRequired ||
        "0-1 years",
      salary: salary || existingDescription.salary || "Not specified",
      location: location || existingDescription.location || "Not specified",
      skills: skills || existingDescription.skills || [],
      recruiterEmail: recruiterEmail || existingDescription.recruiterEmail,
      recruiterName: recruiterName || existingDescription.recruiterName,
      description:
        description ||
        existingDescription.description ||
        `${title || existingJob[0].title} position`,
    };

    const [result] = await pool.query(
      "UPDATE jobs SET title = ?, description = ? WHERE jobid = ? AND uid = ?",
      [
        title || existingJob[0].title,
        JSON.stringify(updatedDescription),
        jobid,
        uid,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Job not found or unauthorized to update" });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job: {
        jobid: parseInt(jobid),
        title: title || existingJob[0].title,
        ...updatedDescription,
        posted: existingJob[0].posted,
      },
    });
  } catch (err) {
    console.error("Update job error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Job by jobid (only by the recruiter who posted it)
exports.deleteJob = async (req, res) => {
  const jobid = req.params.jobid;
  const uid = req.user?.id;

  if (!uid) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Recruiter not authenticated" });
  }

  try {
    const [result] = await pool.query(
      "DELETE FROM jobs WHERE jobid = ? AND uid = ?",
      [jobid, uid]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Job not found or unauthorized to delete" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTotalJobsByRecruiter = async (req, res) => {
  console.log("Fetching job statistics by recruiter...");
  const email = req.user?.email;

  if (!email) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }

  try {
    // Get user ID from email
    const [userRows] = await pool.query(
      "SELECT uid FROM users WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const uid = userRows[0].uid;

    // Get recruiter's job statistics
    const [recruiterStats] = await pool.query(
      `
      SELECT 
        COUNT(*) as total_jobs,
        COUNT(*) as active_jobs, -- All jobs are active for now
        COUNT(CASE WHEN posted >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 1 END) as jobs_this_month,
        COUNT(CASE WHEN posted >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH) AND posted < DATE_SUB(CURDATE(), INTERVAL 1 MONTH) THEN 1 END) as jobs_last_month
      FROM jobs 
      WHERE uid = ?
    `,
      [uid]
    );

    // Get global platform statistics for comparison
    const [globalStats] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM recruiters) as total_recruiters
    `);

    const stats = recruiterStats[0];
    const global = globalStats[0];

    // Calculate percentage changes
    const jobsChange =
      stats.jobs_last_month > 0
        ? Math.round(
            ((stats.jobs_this_month - stats.jobs_last_month) /
              stats.jobs_last_month) *
              100
          )
        : stats.jobs_this_month > 0
        ? 100
        : 0;

    const response = {
      stats: {
        total_jobs: stats.total_jobs,
        jobs_this_month: stats.jobs_this_month,
        total_recruiters: global.total_recruiters, // Global metric
        active_jobs: stats.active_jobs,

        // Percentage changes
        jobs_change: 12, // Mock for total jobs
        jobs_this_month_change: jobsChange,
        platform_growth: 15, // Mock global platform growth
        active_jobs_change: 5, // Mock for active jobs
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching job statistics:", err);
    res.status(500).json({ error: err.message });
  }
};

// stats for pie chart

exports.Piechart = async (req, res) => {
  const email = req.user?.email;

  if (!email) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }

  try {
    // Get user ID from email
    const [userRows] = await pool.query(
      "SELECT uid FROM users WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const uid = userRows[0].uid;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: "Recruiter UID is required",
      });
    }

    const query = `
      SELECT 
        a.status,
        COUNT(*) as count
      FROM applications a
      INNER JOIN jobs j ON a.jobid = j.jobid
      WHERE j.uid = ?
      GROUP BY a.status
    `;

    // Execute the query
    const results = await pool.query(query, [uid]);

    // Initialize stats with default values
    let stats = {
      accepted: 0,
      rejected: 0,
      pending: 0,
    };

    // Process results and populate stats
    results[0].forEach((row) => {
      stats[row.status] = parseInt(row.count);
    });

    // Return the stats
    return res.status(200).json({
      success: true,
      accepted: stats.accepted,
      rejected: stats.rejected,
      pending: stats.pending,
    });
  } catch (error) {
    console.error("Error fetching application stats:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getFilters = async (req, res) => {
  try {
    const queries = {
      jobRoles: "SELECT job_role_id, role_name FROM job_roles",
      markets: "SELECT mid, mname FROM markets",
      locations: "SELECT lid, lname FROM locations",
      skills: "SELECT skillid, skill_name FROM skills",
      companies: "SELECT cid, name FROM company",
    };

    const runQuery = async (sql, labelKey, valueKey) => {
      const [rows] = await pool.query(sql);
      console.log(`Fetched ${rows.length} rows for ${labelKey}`);
      return rows.map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      }));
    };

    const [jobRoles, markets, locations, skills, companies] = await Promise.all(
      [
        runQuery(queries.jobRoles, "role_name", "job_role_id"),
        runQuery(queries.markets, "mname", "mid"),
        runQuery(queries.locations, "lname", "lid"),
        runQuery(queries.skills, "skill_name", "skillid"),
        runQuery(queries.companies, "name", "cid"),
      ]
    );

    res.json({
      success: true,
      jobRoles,
      markets,
      locations,
      skills,
      companies,
    });
  } catch (err) {
    console.error("Error fetching filters:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filters",
      jobRoles: [],
      markets: [],
      locations: [],
      skills: [],
      companies: [],
    });
  }
}; // controllers/jobsController.js

// controllers/jobsController.js
exports.getJobs = async (req, res) => {
  try {
    console.log("Received filters:", req.query);

    const whereClauses = [];
    const params = [];

    // Parse jobRoles filter
    const jobRolesFilter = req.query.jobRoles;
    let jobRoles = [];
    if (jobRolesFilter) {
      if (typeof jobRolesFilter === "string") {
        jobRoles = jobRolesFilter.split(",").map(Number);
      } else if (Array.isArray(jobRolesFilter)) {
        jobRoles = jobRolesFilter.map(Number);
      }
    }

    // Parse preferredLocations filter
    const preferredLocationsFilter = req.query.preferredLocations;
    let preferredLocations = [];
    if (preferredLocationsFilter) {
      if (typeof preferredLocationsFilter === "string") {
        preferredLocations = preferredLocationsFilter.split(",").map(Number);
      } else if (Array.isArray(preferredLocationsFilter)) {
        preferredLocations = preferredLocationsFilter.map(Number);
      }
    }

    // Parse salaryMin and salaryMax
    const salaryMin = req.query.salaryMin ? Number(req.query.salaryMin) : null;
    const salaryMax = req.query.salaryMax ? Number(req.query.salaryMax) : null;

    // Parse experienceMin and experienceMax
    const experienceMin = req.query.experienceMin
      ? Number(req.query.experienceMin)
      : null;
    const experienceMax = req.query.experienceMax
      ? Number(req.query.experienceMax)
      : null;

    // Parse skills filter
    const skillsFilter = req.query.skills;
    let skills = [];
    if (skillsFilter) {
      if (typeof skillsFilter === "string") {
        skills = skillsFilter.split(",").map(Number);
      } else if (Array.isArray(skillsFilter)) {
        skills = skillsFilter.map(Number);
      }
    }

    // Parse markets filter
    const marketsFilter = req.query.markets;
    let markets = [];
    if (marketsFilter) {
      if (typeof marketsFilter === "string") {
        markets = marketsFilter.split(",").map(Number);
      } else if (Array.isArray(marketsFilter)) {
        markets = marketsFilter.map(Number);
      }
    }

    // Parse companies filter
    const companiesFilter = req.query.companies;
    let companies = [];
    if (companiesFilter) {
      if (typeof companiesFilter === "string") {
        companies = companiesFilter.split(",").map(Number);
      } else if (Array.isArray(companiesFilter)) {
        companies = companiesFilter.map(Number);
      }
    }

    // Parse companySizes filter
    const companySizesFilter = req.query.companySizes;
    let companySizes = [];
    if (companySizesFilter) {
      if (typeof companySizesFilter === "string") {
        companySizes = companySizesFilter.split(",");
      } else if (Array.isArray(companySizesFilter)) {
        companySizes = companySizesFilter;
      }
    }

    // Parse jobTypes filter
    const jobTypesFilter = req.query.jobTypes;
    let jobTypes = [];
    if (jobTypesFilter) {
      if (typeof jobTypesFilter === "string") {
        jobTypes = jobTypesFilter.split(",");
      } else if (Array.isArray(jobTypesFilter)) {
        jobTypes = jobTypesFilter;
      }
    }

    // Parse education filter
    const educationFilter = req.query.education;
    let education = [];
    if (educationFilter) {
      if (typeof educationFilter === "string") {
        education = educationFilter.split(",").map(Number);
      } else if (Array.isArray(educationFilter)) {
        education = educationFilter.map(Number);
      }
    }

    // Parse companyTypes filter (array of strings)
    const companyTypesFilter = req.query.companyTypes;
    let companyTypes = [];
    if (companyTypesFilter) {
      if (typeof companyTypesFilter === "string") {
        companyTypes = companyTypesFilter.split(",");
      } else if (Array.isArray(companyTypesFilter)) {
        companyTypes = companyTypesFilter;
      }
    }

    // **NEW: Parse mode_of_work filter as array**
    const modeOfWorkFilter = req.query.mode_of_work;
    let modeOfWork = [];
    if (modeOfWorkFilter) {
      if (typeof modeOfWorkFilter === "string") {
        modeOfWork = modeOfWorkFilter.split(",");
      } else if (Array.isArray(modeOfWorkFilter)) {
        modeOfWork = modeOfWorkFilter;
      }
    }

    console.log("Filtering by companyTypes:", companyTypes);
    console.log("Filtering by mode_of_work:", modeOfWork);

    // Add companyTypes filter to whereClauses using JSON_CONTAINS with stringified values
    if (companyTypes.length > 0) {
      const orConditions = companyTypes
        .map(() => `JSON_CONTAINS(c.type, ?, '$')`)
        .join(" OR ");
      whereClauses.push(`(${orConditions})`);
      params.push(...companyTypes.map((type) => JSON.stringify(type)));
    }

    // Job role filter
    if (jobRoles.length > 0) {
      const placeholders = jobRoles.map(() => "?").join(", ");
      whereClauses.push(`jr.job_role_id IN (${placeholders})`);
      params.push(...jobRoles);
    }

    // Location filter
    if (preferredLocations.length > 0) {
      const placeholders = preferredLocations.map(() => "?").join(", ");
      whereClauses.push(`l.lid IN (${placeholders})`);
      params.push(...preferredLocations);
    }

    // Salary filter
    if (salaryMin !== null && salaryMax !== null) {
      whereClauses.push(`(j.salary_max >= ? AND j.salary_min <= ?)`);
      params.push(salaryMin, salaryMax);
    } else if (salaryMin !== null) {
      whereClauses.push(`j.salary_max >= ?`);
      params.push(salaryMin);
    } else if (salaryMax !== null) {
      whereClauses.push(`j.salary_min <= ?`);
      params.push(salaryMax);
    }

    // Experience filter
    if (experienceMin !== null && experienceMax !== null) {
      whereClauses.push(`(j.experience_max >= ? AND j.experience_min <= ?)`);
      params.push(experienceMin, experienceMax);
    } else if (experienceMin !== null) {
      whereClauses.push(`j.experience_max >= ?`);
      params.push(experienceMin);
    } else if (experienceMax !== null) {
      whereClauses.push(`j.experience_min <= ?`);
      params.push(experienceMax);
    }

    // Skills filter
    if (skills.length > 0) {
      const placeholders = skills.map(() => "?").join(", ");
      whereClauses.push(`s.skillid IN (${placeholders})`);
      params.push(...skills);
    }

    // Markets filter
    if (markets.length > 0) {
      const placeholders = markets.map(() => "?").join(", ");
      whereClauses.push(`m.mid IN (${placeholders})`);
      params.push(...markets);
    }

    // Company ID filter
    if (companies.length > 0) {
      const placeholders = companies.map(() => "?").join(", ");
      whereClauses.push(`c.cid IN (${placeholders})`);
      params.push(...companies);
    }

    // Company size filter
    if (companySizes.length > 0) {
      const placeholders = companySizes.map(() => "?").join(", ");
      whereClauses.push(`c.companySize IN (${placeholders})`);
      params.push(...companySizes);
    }

    // Job type filter
    if (jobTypes.length > 0) {
      const placeholders = jobTypes.map(() => "?").join(", ");
      whereClauses.push(`j.job_type IN (${placeholders})`);
      params.push(...jobTypes);
    }

    // Education filter
    if (education.length > 0) {
      const placeholders = education.map(() => "?").join(", ");
      whereClauses.push(`j.qualification_id IN (${placeholders})`);
      params.push(...education);
    }

    // **NEW: mode_of_work filter as IN clause**
    if (modeOfWork.length > 0) {
      const placeholders = modeOfWork.map(() => "?").join(", ");
      whereClauses.push(`j.mode_of_work IN (${placeholders})`);
      params.push(...modeOfWork);
    }

    let sql = `
      SELECT
        j.jobid,
        j.uid,
        j.custom_title,
        j.bigDescription,
        j.posted,
        j.popularity_score,
        j.job_type,
        j.mode_of_work,
         j.opening,                     -- <== Added here
        j.cid AS company_id,

        -- Company details
        c.name AS company_name,
        c.companySize,
        c.type AS company_type,
        c.tags AS company_tags,
        c.status AS company_status,
        c.CEO AS company_ceo,
        q.qualification_name,

        j.salary_min,
        j.salary_max,
        j.experience_min,
        j.experience_max,

        GROUP_CONCAT(DISTINCT jr.role_name) AS job_roles,
        GROUP_CONCAT(DISTINCT m.mname) AS markets,
        GROUP_CONCAT(DISTINCT l.lname) AS locations,
        GROUP_CONCAT(DISTINCT s.skill_name) AS skills
      FROM jobs j
      LEFT JOIN company c ON j.cid = c.cid
      LEFT JOIN qualification q ON j.qualification_id = q.qualification_id
      LEFT JOIN job_job_roles jjr ON j.jobid = jjr.jobid
      LEFT JOIN job_roles jr ON jjr.job_role_id = jr.job_role_id
      LEFT JOIN job_markets jm ON j.jobid = jm.jobid
      LEFT JOIN markets m ON jm.mid = m.mid
      LEFT JOIN job_locations jl ON j.jobid = jl.jobid
      LEFT JOIN locations l ON jl.lid = l.lid
      LEFT JOIN job_skills js ON j.jobid = js.jobid
      LEFT JOIN skills s ON js.skillid = s.skillid
    `;

    if (whereClauses.length > 0) {
      sql += " WHERE " + whereClauses.join(" AND ");
    }

    sql += `
      GROUP BY j.jobid
      ORDER BY j.posted DESC
    `;

    console.log("Final SQL:", sql);
    console.log("Query Params:", params);

    const [rows] = await pool.query(sql, params);
    res.json({ success: true, jobs: rows });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// In jobs.controller.js

exports.getJobDetails = async (req, res) => {
  const jobid = req.query.jobid;
  console.log(`Received jobid from query param: ${jobid}`);

  if (!jobid) {
    return res.status(400).json({ error: "Missing jobid query parameter" });
  }

  const sql = `
    SELECT
  j.jobid,
  j.uid,
  j.custom_title,
  j.bigDescription,
  j.posted,
  j.popularity_score,
  j.job_type,
  j.mode_of_work,
  j.opening,
  j.cid AS company_id,

  c.name AS company_name,
  c.companySize,                 -- added company size here
  c.tags AS company_tags,

  j.salary_min,
  j.salary_max,
  j.experience_min,
  j.experience_max,
  j.smallDescription,
  j.equity_min,
  j.equity_max,
  j.qualification_id,
  q.qualification_name,          -- join qualification name

  GROUP_CONCAT(DISTINCT jr.role_name) AS job_roles,
  GROUP_CONCAT(DISTINCT m.mname) AS markets,
  GROUP_CONCAT(DISTINCT l.lname) AS locations,
  GROUP_CONCAT(DISTINCT s.skill_name) AS skills

FROM jobs j
LEFT JOIN company c ON j.cid = c.cid
LEFT JOIN qualification q ON j.qualification_id = q.qualification_id      -- join qualification table here
LEFT JOIN job_job_roles jjr ON j.jobid = jjr.jobid
LEFT JOIN job_roles jr ON jjr.job_role_id = jr.job_role_id
LEFT JOIN job_markets jm ON j.jobid = jm.jobid
LEFT JOIN markets m ON jm.mid = m.mid
LEFT JOIN job_locations jl ON j.jobid = jl.jobid
LEFT JOIN locations l ON jl.lid = l.lid
LEFT JOIN job_skills js ON j.jobid = js.jobid
LEFT JOIN skills s ON js.skillid = s.skillid

WHERE j.jobid = ?
GROUP BY j.jobid


  `;

  try {
    const [rows] = await pool.query(sql, [jobid]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Return the job details object
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching job detail:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
