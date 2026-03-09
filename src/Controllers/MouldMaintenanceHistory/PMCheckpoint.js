const express = require("express");
const sql = require("mssql");
const router = express.Router();
const dbConfig = require("../../database/db.js")
// PM Header details 
router.get("/PmHeaderDetails", async (req, res) => {
  try {
    const { checkListID, instance, mouldID } = req.query;

    if (!checkListID || !instance || !mouldID) {
      return res.status(400).json({
        success: false,
        message: "checkListID ,mould and instance are required",
      });
    }

    const pool = await sql.connect();
    const request = pool.request();

    request.input("CheckListID", sql.Int, parseInt(checkListID));
    request.input("Instance", sql.Int, parseInt(instance));
    request.input("MouldID", sql.Int, parseInt(mouldID));

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

router.get("/get-checkpoint-images", async (req, res) => {
  try {

    const { mouldName, instance } = req.query;

    // Validate that mouldName and instance are valid
    if (!mouldName || !instance) {
      return res.status(400).json({
        status: 400,
        message: "Invalid mouldName or instance parameter"
      });
    }

    const instanceNum = parseInt(instance);

    if (isNaN(instanceNum)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid instance parameter"
      });
    }

    const pool = await sql.connect();

    const result = await pool.request()
      .input("MouldName", sql.NVarChar, mouldName)
      .input("Instance", sql.Int, instanceNum)
      .query(`
        SELECT 
            mci.UID,
            mci.Checkpoints,
            mci.Image,
            mci.MouldID,
            cm.MouldName,
            mci.Instance
        FROM Mould_Checklist_Images mci
        INNER JOIN Config_Mould cm 
            ON mci.MouldID = cm.MouldID
        WHERE cm.MouldName = @MouldName
        AND mci.Instance = @Instance
        AND mci.ImageType = 'PM'
      `);

    const images = result.recordset.map(row => ({
      uid: row.UID,
      checkpoint: row.Checkpoints,
      image: row.Image ? row.Image.toString("base64") : null,
      mouldID: row.MouldID,
      mouldName: row.MouldName,
      instance: row.Instance
    }));

    res.json({
      status: 200,
      data: images
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      message: "Server error"
    });
  }
});
module.exports = router; 