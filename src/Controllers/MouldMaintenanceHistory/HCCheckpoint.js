const express = require("express");
const sql = require("mssql");
const router = express.Router();

router.get("/HcHeaderDetails", async (req, res) => {
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
      "HC_Dashboard_HeaderDetails_HCCheckpointReport"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing HC_Dashboard_HeaderDetails_HCCheckpointReport:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching HC header details",
      error: error.message,
    });
  }
});



//HC Checkpoint Details
router.get("/HCCheckpointDetails", async (req, res) => {
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
      "Dashboard_HC_CheckPointHistoryReport"
    );

    return res.json({
      success: true,
      data: result.recordset,
    });

  } catch (error) {
    console.error("Error executing Dashboard_HC_CheckPointHistoryReport:", error);

    return res.status(500).json({
      success: false,
      message: "Error fetching HC  details",
      error: error.message,
    });
  }
});
module.exports = router; 