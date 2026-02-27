const express = require("express");
const sql = require("mssql");
const router = express.Router();


// ---------------HC Actual and Plan
router.get("/hcPlannedVsActualCustom", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const pool = await sql.connect();
    const request = pool.request();

    // Send parameters ONLY if provided, otherwise NULL
    request.input("StartDate", sql.Date, startDate || null);
    request.input("EndDate", sql.Date, endDate || null);

    // Execute the stored procedure
    const result = await request.execute(
      "Dashboard_MouldHC_PlannedVsActualCustomeDate"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing Dashboard_MouldHC_PlannedVsActualCustomeDate:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching HC Planned vs Actual (Custom Date)",
      error: error.message,
    });
  }
});

//-----------------hc Deatils Min ,Max,Avg

router.get("/hcTimeDetails", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const pool = await sql.connect();
    const request = pool.request();

    // Send parameters ONLY if provided, otherwise NULL
    request.input("StartDate", sql.Date, startDate || null);
    request.input("EndDate", sql.Date, endDate || null);

    // Execute the stored procedure
    const result = await request.execute(
      "DASHBOARD_HC_DurationStats"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing DASHBOARD_HC_DurationStats:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching hc Time details(Custom Date)",
      error: error.message,
    });
  }
});

//-----------------hc Delay and On Time

router.get("/hcDelayOnTime", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const pool = await sql.connect();
    const request = pool.request();

    // Send parameters ONLY if provided, otherwise NULL
    request.input("StartDate", sql.Date, startDate || null);
    request.input("EndDate", sql.Date, endDate || null);

    // Execute the stored procedure
    const result = await request.execute(
      "DASHBOARD_HC_OnTimeDelayedCount"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing DASHBOARD_HC_OnTimeDelayedCount:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching HC Time details(Custom Date)",
      error: error.message,
    });
  }
});

//-------------hc Table ------------
// router.get("/hcistoryDetailTable", async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;

//     const pool = await sql.connect();
//     const request = pool.request();

//     // Send parameters ONLY if provided, otherwise NULL
//     request.input("StartDate", sql.Date, startDate || null);
//     request.input("EndDate", sql.Date, endDate || null);

//     // Execute the stored procedure
//     const result = await request.execute(
//       "DASHBOARD_HC_CheckListHistory"
//     );

//     return res.json({
//       success: true,
//       data: result.recordset,
//     });
   
//   } catch (error) {
//     console.error("Error executing DASHBOARD_HC_CheckListHistory:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Error fetching hc table details(Custom Date)",
//       error: error.message,
//     });
//   }
// });
router.get("/hcistoryDetailTable", async (req, res) => {
  try {
    const { startDate, endDate, mouldID } = req.query;

    const pool = await sql.connect();
    const request = pool.request();

    // ✅ Pass parameters (NULL if not provided)
    request.input("StartDate", sql.Date, startDate || null);
    request.input("EndDate", sql.Date, endDate || null);
    request.input("MouldID", sql.NVarChar(100), mouldID || null);

    // ✅ Execute stored procedure
    const result = await request.execute(
      "DASHBOARD_HC_CheckListHistory"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing DASHBOARD_HC_CheckListHistory:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching HC table details (Custom Date + Mould Filter)",
      error: error.message,
    });
  }
});
module.exports = router; 