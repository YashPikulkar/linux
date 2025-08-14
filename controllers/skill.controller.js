const pool = require("../config/db");

// Fetch all skills
exports.skills = async (req, res) => {
  console.log("Fetching all skills...");
  try {
    const [rows] = await pool.query("SELECT * FROM skills");

    console.log("Raw rows from database:", rows); // Log raw data
    console.log("Type of rows:", typeof rows); // Should be 'object'
    console.log("Is rows an array?", Array.isArray(rows)); // Should be true

    if (!rows || rows.length === 0)
      return res
        .status(401)
        .json({ success: false, message: "No skills in database", skills: [] });

    const mappedSkills = rows.map((row) => [row.skillid, row.skill_name]);
    console.log("Mapped skills array:", mappedSkills); // Log the formatted array

    res.json({
      success: true,
      message: "Total skills fetched successfully",
      skills: mappedSkills,
    });
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).json({ success: false, error: err.message, skills: [] });
  }
};

// Fetch skill by ID
exports.skill = async (req, res) => {
  console.log("Fetching skill by id...");
  const { skillid } = req.params;
  try {
    const [row] = await pool.query("SELECT * FROM skills WHERE skillid = ?", [
      skillid,
    ]);

    if (!row || row.length === 0)
      return res.status(401).json({ success: false, name: "No Name" });

    res.json({
      success: true,
      name: row[0].skill_name || "No name success",
    });
  } catch (err) {
    res.status(500).json({ success: false, name: "No name error" });
  }
};

// Count applicants per skill
exports.countApplicantSkills = async (req, res) => {
  let skillJSON = {};
  let topSkills = [];
  let leastSkills = [];
  let topCount = 0;
  let leastCount = Infinity;
  let threshold = 10;

  try {
    const [rows] = await pool.query("SELECT * FROM skills");
    const skills = rows.map((row) => [row.skillid, row.skill_name]);
    const skillObject = Object.fromEntries(skills);

    for (const [skillid, skill_name] of Object.entries(skillObject)) {
      const [count] = await pool.query(
        `SELECT COUNT(*) AS total_applicants FROM applicant_skills WHERE skillid = ?`,
        [skillid]
      );

      skillJSON[skill_name] = count[0].total_applicants;
      const applicantCount = count[0].total_applicants;

      if (applicantCount > topCount) {
        topSkills = [{ name: skill_name, count: applicantCount }];
        topCount = applicantCount;
      } else if (applicantCount === topCount) {
        topSkills.push({ name: skill_name, count: applicantCount });
      }

      if (applicantCount < leastCount) {
        leastSkills = [{ name: skill_name, count: applicantCount }];
        leastCount = applicantCount;
      } else if (applicantCount === leastCount) {
        leastSkills.push({ name: skill_name, count: applicantCount });
      }
    }

    topSkills = topSkills.sort((a, b) => b.count - a.count).slice(0, threshold);
    leastSkills = leastSkills
      .sort((a, b) => a.count - b.count)
      .slice(0, threshold);

    const sortedSkills = Object.entries(skillJSON)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
    const result = Object.fromEntries(sortedSkills);

    res.status(200).json({
      success: true,
      message: "Counted applicants successfully",
      data: result,
      topSkills,
      leastSkills,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: {},
      topSkills: [],
      leastSkills: [],
    });
  }
};

// Count jobs per skill
exports.countJobsSkills = async (req, res) => {
  let skillJSON = {};
  let ResponseJSON = {};
  let topSkills = [];
  let leastSkills = [];
  let topCount = 0;
  let leastCount = Infinity;
  let threshold = 10;

  try {
    // Get all job-skill mappings
    const [jobSkillRows] = await pool.query(
      "SELECT jobid, skillid FROM job_skills"
    );

    // Get skill list
    const [skillRows] = await pool.query(
      "SELECT skillid, skill_name FROM skills"
    );

    for (const skill of skillRows) {
      skillJSON[skill.skillid] = skill.skill_name;
    }

    // Count occurrences of each skill in jobs
    for (const row of jobSkillRows) {
      const skillid = row.skillid;
      ResponseJSON[skillid] = (ResponseJSON[skillid] || 0) + 1;
    }

    const result = {};
    for (const [skillid, skillName] of Object.entries(skillJSON)) {
      const count = ResponseJSON[skillid] || 0;
      result[skillName] = count;

      if (count > topCount) {
        topSkills = [{ name: skillName, count }];
        topCount = count;
      } else if (count === topCount) {
        topSkills.push({ name: skillName, count });
      }

      if (count < leastCount) {
        leastSkills = [{ name: skillName, count }];
        leastCount = count;
      } else if (count === leastCount) {
        leastSkills.push({ name: skillName, count });
      }
    }

    topSkills = topSkills.sort((a, b) => b.count - a.count).slice(0, threshold);
    leastSkills = leastSkills
      .sort((a, b) => a.count - b.count)
      .slice(0, threshold);

    const sortedSkills = Object.entries(result)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
    const finalResult = Object.fromEntries(sortedSkills);

    return res.json({
      success: true,
      message: "Counted successfully",
      data: finalResult,
      topSkills,
      leastSkills,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: {},
      topSkills: [],
      leastSkills: [],
    });
  }
};
