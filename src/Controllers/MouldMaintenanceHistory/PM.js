const express = require("express");
const sql = require("mssql");
const router = express.Router();


// ---------------PM Actual and Plan
router.get("/PmPlannedVsActualCustom", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const pool = await sql.connect();
    const request = pool.request();

    // Send parameters ONLY if provided, otherwise NULL
    request.input("StartDate", sql.Date, startDate || null);
    request.input("EndDate", sql.Date, endDate || null);

    // Execute the stored procedure
    const result = await request.execute(
      "Dashboard_MouldPM_PlannedVsActualCustomeDate"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing Dashboard_MouldPM_PlannedVsActualCustomeDate:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching PM Planned vs Actual (Custom Date)",
      error: error.message,
    });
  }
});

//-----------------PM Deatils Min ,Max,Avg

router.get("/PmTimeDetails", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const pool = await sql.connect();
    const request = pool.request();

    // Send parameters ONLY if provided, otherwise NULL
    request.input("StartDate", sql.Date, startDate || null);
    request.input("EndDate", sql.Date, endDate || null);

    // Execute the stored procedure
    const result = await request.execute(
      "DASHBOARD_PM_DurationStats"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing DASHBOARD_PM_DurationStats:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching PM PM Time details(Custom Date)",
      error: error.message,
    });
  }
});

//-----------------PM Delay and On Time

router.get("/PmDelayOnTime", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const pool = await sql.connect();
    const request = pool.request();

    // Send parameters ONLY if provided, otherwise NULL
    request.input("StartDate", sql.Date, startDate || null);
    request.input("EndDate", sql.Date, endDate || null);

    // Execute the stored procedure
    const result = await request.execute(
      "DASHBOARD_PM_OnTimeDelayedCount"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing DASHBOARD_PM_DurationStats:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching PM PM Time details(Custom Date)",
      error: error.message,
    });
  }
});

//-------------PM Table ------------
// router.get("/PmHistoryDetailTable", async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const pool = await sql.connect();
//     const request = pool.request();

//     // Send parameters ONLY if provided, otherwise NULL
//     request.input("StartDate", sql.Date, startDate || null);
//     request.input("EndDate", sql.Date, endDate || null);

//     // Execute the stored procedure
//     const result = await request.execute(
//       "DASHBOARD_PM_CheckListHistory"
//     );

//     return res.json({
//       success: true,
//       data: result.recordset,
//     });
   
//   } catch (error) {
//     console.error("Error executing DASHBOARD_PM_CheckListHistory:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Error fetching PM table details(Custom Date)",
//       error: error.message,
//     });
//   }
// });
router.get("/PmHistoryDetailTable", async (req, res) => {
  try {
    const { startDate, endDate, mouldID } = req.query;

    const pool = await sql.connect();
    const request = pool.request();

    // ✅ Pass parameters (NULL if not provided)
    request.input("StartDate", sql.Date, startDate || null);
    request.input("EndDate", sql.Date, endDate || null);
    request.input("MouldID", sql.NVarChar(100), mouldID || null);

    // ✅ Execute Stored Procedure
    const result = await request.execute(
      "DASHBOARD_PM_CheckListHistory"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing DASHBOARD_PM_CheckListHistory:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching PM table details (Custom Date + Mould Filter)",
      error: error.message,
    });
  }
});
module.exports = router; 