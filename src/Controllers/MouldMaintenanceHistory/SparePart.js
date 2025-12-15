const express = require("express");
const sql = require("mssql");
const router = express.Router();


router.get("/SparePartCategoryName", async (req, res) => {
  try {
    const pool = await sql.connect();
    const query = `
      SELECT 
        SparePartCategory,
        LastUpdatedTime,
        LastUpdatedBy
      FROM [PPMS_LILBawal].[dbo].[Config_SparePartCategory]
      ORDER BY SparePartCategory ASC
    `;

    const result = await pool.request().query(query);

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error fetching Spare Part Category:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching spare part category data",
      error: error.message,
    });
  }
});

router.get("/SparePartName", async (req, res) => {
  try {
    const pool = await sql.connect();
    const query = `
      SELECT
    SP.SparePartID,
    SP.SparePartName,
    SP.SparePartDescription,

    CAT.SparePartCategory        AS SparePartCategoryID,
    M.MouldName,

    MON.NumberOfMould            AS NoOfMould,

    SP.SparePartSize,
    M.MouldStorageLoc            AS SparePartLoc,

    SP.MinQuantity,
    SP.MaxQuantity,
    SP.ReorderLevel,

    SP.SparePartMake,
    SP.LeadTime,
    SP.ImportExport,
    SP.PackingQuantity,
    SP.PreferredSparePart,

    SP.LastUpdatedTime,
    SP.LastUpdatedBy
FROM dbo.Config_Mould_SparePart SP
LEFT JOIN dbo.Config_SparePartCategory CAT
    ON SP.SparePartID = CAT.SparePartID
LEFT JOIN dbo.Config_Mould M
    ON CAT.MouldID = M.MouldID
LEFT JOIN dbo.Mould_SparePartMonitoring MON
    ON SP.SparePartID = MON.SparePartID
ORDER BY SP.SparePartName ASC;

    `;

    const result = await pool.request().query(query);

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error fetching Spare Part :", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching spare part  data",
      error: error.message,
    });
  }
});


// GET Spare Part Consumption By Category (Custom Date)
router.get("/DashboardSpareConsumptionByCategory", async (req, res) => {
  try {
    const { startDate, endDate, SparePartCategory } = req.query;

    if (!startDate || !endDate || !SparePartCategory) {
      return res.status(400).json({
        success: false,
        message: "startDate, endDate, and SparePartCategory are required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    // ✅ CORRECT PARAM NAMES (NO SPACE)
    request.input("StartDate", sql.Date, startDate);
    request.input("EndDate", sql.Date, endDate);
    request.input("SparePartCategory", sql.NVarChar(100), SparePartCategory);

    const result = await request.execute(
      "DASHBOARD_SparePartConsumptionByCategoryCustomedate"
    );

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching Spare Part Consumption:", error.message);

    res.status(500).json({
      success: false,
      message: "Error fetching Spare Part Consumption (Category-wise)",
      error: error.message,
    });
  }
});


// GET Top 50 Spare Part Consumption (Custom Date Range)
router.get("/DashboardTop50SpareConsumption", async (req, res) => {
  try {
    const { startDate, endDate, SparePartCategory } = req.query;

    if (!startDate || !endDate || !SparePartCategory) {
      return res.status(400).json({
        success: false,
        message: "startDate, endDate, and SparePartCategory are required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    // ✅ MATCH SP PARAM NAME
    request.input("StartDate", sql.Date, startDate);
    request.input("EndDate", sql.Date, endDate);
    request.input("SparePartCategory", sql.NVarChar(100), SparePartCategory);

    const result = await request.execute(
      "DASHBOARD_Top50SparePartConsumptionCustomDate"
    );

    res.json({
      success: true,
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error fetching Top 50 Spare Part Consumption:", error.message);

    res.status(500).json({
      success: false,
      message: "Error fetching Top 50 Spare Part Consumption",
      error: error.message,
    });
  }
});


module.exports = router; 