const pool = require("../config/db");

exports.companies = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM company");

    if (!rows)
      return res.status(401).json({
        success: false,
        message: "No compnies in database",
        companies: [],
      });

    res.json({
      success: true,
      message: "All companies fetched successfully",
      companies: rows.map((row) => [row.cid, row.name]),
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: err.message, companies: [] });
  }
};

//get comapany via recid

exports.getCompanyByRecruiter = async (req, res) => {
  console.log("Fetching company by recruite hitted r...");
  const email = req.user?.email;
  if (!email) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }

  try {
    const [userRows] = await pool.query(
      "SELECT uid FROM users WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const uid = userRows[0].uid;

    if (!uid) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Recruiter not authenticated" });
    }

    const [rows] = await pool.query(
      `
     select cid from recruiters where uid = ? 
    `,
      [uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Company not found" });
    }
    const cid = rows[0].cid;

    const [companyRows] = await pool.query(
      "SELECT * FROM company WHERE cid = ?",
      [cid]
    );

    return res.json({
      success: true,
      message: "Company fetched successfully",
      company: companyRows[0],
    });
  } catch (err) {
    console.error("Error fetching company by recruiter:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCompanyDetails = async (req, res) => {
  const companyId = req.query.cid;
  console.log(`Received companyId from query param: ${companyId}`);

  if (!companyId) {
    return res.status(400).json({ error: "Missing cid query parameter" });
  }

  const sql = `
    SELECT 
      c.cid,
      c.name,
      c.description,
      c.companySize,
      c.status,
      c.tags,
      c.type,
      c.CEO,
      c.companyEmail,
      c.links,
      
      -- Aggregate location names
      GROUP_CONCAT(DISTINCT l.lname) AS locations,
      -- Aggregate market names
      GROUP_CONCAT(DISTINCT m.mname) AS markets

    FROM company c

    LEFT JOIN JSON_TABLE(
      c.locationids,
      '$[*]' COLUMNS (lid INT PATH '$')
    ) AS loc_ids ON TRUE
    LEFT JOIN locations l ON loc_ids.lid = l.lid

    LEFT JOIN JSON_TABLE(
      c.marketids,
      '$[*]' COLUMNS (mid INT PATH '$')
    ) AS mar_ids ON TRUE
    LEFT JOIN markets m ON mar_ids.mid = m.mid

    WHERE c.cid = ?
    GROUP BY c.cid
  `;

  try {
    const [rows] = await pool.query(sql, [companyId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching company detail:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
