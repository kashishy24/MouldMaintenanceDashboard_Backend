const express = require("express");
const sql = require("mssql");
const router = express.Router();



router.get("/MouldName", async (req, res) => {
  try {
    const pool = await sql.connect();
    const query = `
      SELECT 
        MouldID,
        MouldName
      FROM [PPMS_LILBawal].[dbo].[Config_Mould]
      ORDER BY MouldID ASC
    `;

    const result = await pool.request().query(query);

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error fetching Mould Name:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching mould data",
      error: error.message,
    });
  }
});


//get mould id and desc acc to mouldName

router.get("/MouldIDDesc", async (req, res) => {
  try {
    const { mouldName } = req.query; // ⬅ frontend sends ?mouldName=...

    if (!mouldName) {
      return res.status(400).json({
        success: false,
        message: "mouldName is required",
      });
    }

    const pool = await sql.connect();
    const query = `
      SELECT 
        MouldID,
        MouldName,
        MouldDesc
      FROM [PPMS_LILBawal].[dbo].[Config_Mould]
      WHERE MouldName = @mouldName
    `;

    const result = await pool
      .request()
      .input("mouldName", sql.VarChar, mouldName)
      .query(query);

    return res.json({
      success: true,
      data: result.recordset, // returns [{ MouldID, MouldName, MouldDesc }]
    });

  } catch (error) {
    console.error("Error fetching Mould:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching mould data",
      error: error.message,
    });
  }
});


//get the mould summary data
// GET: /api/mouldPMHCOverview?mouldId=2
router.get("/mouldPMHCOverview", async (req, res) => {
  try {
    const { mouldId } = req.query;

    // Validate input
    if (!mouldId) {
      return res.status(400).json({
        success: false,
        message: "mouldId query parameter is required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    // Input parameter for the stored procedure
    request.input("MouldID", sql.NVarChar(100), mouldId);

    // Execute the stored procedure
    const result = await request.execute("Dashboard_Mould_PM_HC_Overview");

    // SP returns a single row; we can send recordset[0]
    const row = result.recordset && result.recordset[0] ? result.recordset[0] : null;

    return res.json({
      success: true,
      data: row,
    });
  } catch (error) {
    console.error("Error fetching Mould PM/HC Overview:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching Mould PM/HC Overview",
      error: error.message,
    });
  }
});

//On time and delay PM 

// Get PM On-Time vs Delayed status for a given mould
router.get("/Dashboard_PM_OnTimeVsDelayed", async (req, res) => {
  try {
    const { mouldId } = req.query;

    // Validate
    if (!mouldId) {
      return res.status(400).json({
        success: false,
        message: "mouldId query parameter is required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    // Pass stored procedure parameter
    request.input("MouldID", sql.NVarChar(50), mouldId);

    // Execute your SP
    const result = await request.execute("Dashboard_PM_OnTimeVsDelayed");

    return res.json({
      success: true,
      data: result.recordset, // returns array of months with status
    });
  } catch (error) {
    console.error("Error fetching Dashboard_PM_OnTimeVsDelayed:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching Dashboard PM OnTime vs Delayed details",
      error: error.message,
    });
  }
});


//get on time delay for hc

// Get PM On-Time vs Delayed status for a given mould
router.get("/Dashboard_HC_OnTimeVsDelayed", async (req, res) => {
  try {
    const { mouldId } = req.query;

    // Validate
    if (!mouldId) {
      return res.status(400).json({
        success: false,
        message: "mouldId query parameter is required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    // Pass stored procedure parameter
    request.input("MouldID", sql.NVarChar(50), mouldId);

    // Execute your SP
    const result = await request.execute("Dashboard_HC_OnTimeVsDelayed");

    return res.json({
      success: true,
      data: result.recordset, // returns array of months with status
    });
  } catch (error) {
    console.error("Error fetching Dashboard_HC_OnTimeVsDelayed :", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching Dashboard hc OnTime vs Delayed details",
      error: error.message,
    });
  }
});

//get the breakdown by duration
router.get("/DashboardGetTop5BreakDownsByDuration", async (req, res) => {
  try {
    const { mouldId } = req.query;

    if (!mouldId) {
      return res.status(400).json({
        success: false,
        message: "mouldId query parameter is required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    request.input("MouldID", sql.NVarChar(100), mouldId);

    const result = await request.execute("Dashboard_GetTop5BreakDowns_ByDuration");

    return res.json({
      success: true,
      data: result.recordset,   // 👈 return ALL 5 rows
    });
  } catch (error) {
    console.error("Error fetching Dashboard_GetTop5BreakDowns_ByDuration:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching Mould breakdown duration Overview",
      error: error.message,
    });
  }
});

//get the breakdown by ocuurence
router.get("/DashboardGetTop5BreakDownsByOccurrences", async (req, res) => {
  try {
    const { mouldId } = req.query;

    if (!mouldId) {
      return res.status(400).json({
        success: false,
        message: "mouldId query parameter is required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    request.input("MouldID", sql.NVarChar(100), mouldId);

    const result = await request.execute("Dashboard_GetTop5BreakDowns_ByOccurrences");

    return res.json({
      success: true,
      data: result.recordset,  // ✅ return full array (all 5)
    });
  } catch (error) {
    console.error("Error fetching Dashboard_GetTop5BreakDowns_ByOccurrences:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching Mould breakdown occurrence overview",
      error: error.message,
    });
  }
});

//get the top 10 spare part name
router.get("/Dashboard_GetTop10SpareParts_ByMould", async (req, res) => {
  try {
    const { mouldId } = req.query;

    if (!mouldId) {
      return res.status(400).json({
        success: false,
        message: "mouldId query parameter is required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    request.input("MouldID", sql.NVarChar(100), mouldId);

    const result = await request.execute("Dashboard_GetTop10SpareParts_ByMould");

    return res.json({
      success: true,
      data: result.recordset,  // ✅ return full array (all 5)
    });
  } catch (error) {
    console.error("Error fetching Dashboard_GetTop10SpareParts_ByMould:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching MDashboard_GetTop10SpareParts_ByMould overview",
      error: error.message,
    });
  }
});

// API to get all machine Production History of mould
// Get Machine Wise Shot Count By Mould
router.get("/Dashboard_GET_MachineWiseShotCount_ByMould", async (req, res) => {
  try {
    const { mouldName } = req.query;

    if (!mouldName) {
      return res.status(400).json({
        success: false,
        message: "mouldName query parameter is required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    request.input("MouldName", sql.NVarChar(200), mouldName);

    const result = await request.execute(
      "Dashboard_GET_MachineWiseShotCount_ByMould"
    );

    return res.json({
      success: true,
      data: result.recordset,   // full array for chart
    });

  } catch (error) {
    console.error(
      "Error fetching Dashboard_GET_MachineWiseShotCount_ByMould:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error fetching Machine Wise Shot Count",
      error: error.message,
    });
  }
});

// Get Machines By Mould Name
router.get("/Dashboard_GET_Machines_ByMouldName", async (req, res) => {
  try {
    const { mouldName } = req.query;

    // Validate query parameter
    if (!mouldName) {
      return res.status(400).json({
        success: false,
        message: "mouldName query parameter is required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    // Pass parameter to stored procedure
    request.input("MouldName", sql.NVarChar(200), mouldName);

    const result = await request.execute(
      "Dashboard_GET_Machines_ByMouldName"
    );

    return res.json({
      success: true,
      data: result.recordset,   // returning full array
    });

  } catch (error) {
    console.error(
      "Error fetching Dashboard_GET_Machines_ByMouldName:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error fetching machines by mould name",
      error: error.message,
    });
  }
});

// Get Machine Mould Production Details
router.get("/Dashboard_GET_MachineMouldProductionDetails", async (req, res) => {
  try {
    const { equipmentName } = req.query;

    // Validate query parameter
    if (!equipmentName) {
      return res.status(400).json({
        success: false,
        message: "equipmentName query parameter is required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    // Pass parameter to stored procedure
    request.input("EquipmentName", sql.NVarChar(200), equipmentName);

    const result = await request.execute(
      "Dashboard_GET_MachineMouldProductionDetails"
    );

    return res.json({
      success: true,
      data: result.recordset,   // return full array
    });

  } catch (error) {
    console.error(
      "Error fetching Dashboard_GET_MachineMouldProductionDetails:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Error fetching machine mould production details",
      error: error.message,
    });
  }
});

module.exports = router; 