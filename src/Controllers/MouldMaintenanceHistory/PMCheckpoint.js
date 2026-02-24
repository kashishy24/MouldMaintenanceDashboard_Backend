const express = require("express");
const sql = require("mssql");
const router = express.Router();


// PM Header details 
router.get("/PmHeaderDetails", async (req, res) => {
  try {
    const { checkListID, instance } = req.query;

    if (!checkListID || !instance) {
      return res.status(400).json({
        success: false,
        message: "checkListID and instance are required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    request.input("CheckListID", sql.Int, parseInt(checkListID));
    request.input("Instance", sql.Int, parseInt(instance));

    const result = await request.execute(
      "PM_Dashboard_HeaderDetails_PMCheckpointReport"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing PM_Dashboard_HeaderDetails_PMCheckpointReport:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching PM header details",
      error: error.message,
    });
  }
});

//PM Checkpoint Details
router.get("/PmCheckpointDetails", async (req, res) => {
  try {
    const { checkListID, instance } = req.query;

    if (!checkListID || !instance) {
      return res.status(400).json({
        success: false,
        message: "checkListID and instance are required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    request.input("CheckListID", sql.Int, parseInt(checkListID));
    request.input("Instance", sql.Int, parseInt(instance));

    const result = await request.execute(
      "Dashboard_PM_CheckPointHistoryReport"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing Dashboard_PM_CheckPointHistoryReport:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching PM  details",
      error: error.message,
    });
  }
});
module.exports = router; 