const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");  //  add this
const middlewares = require("./src/middlewares/middlewares.js");
const loginRoute = require("./src/Controllers/loginAPI.js");
const HomeRoute=require("./src/Controllers/HomePage/Home.js")
const PMRoute=require("./src/Controllers/MouldMaintenanceHistory/PM.js")
const hcRoute=require("./src/Controllers/MouldMaintenanceHistory/HC.js")
const breakdownRoute=require("./src/Controllers/MouldMaintenanceHistory/Breakdown.js")
const SparePartRoute=require("./src/Controllers/MouldMaintenanceHistory/SparePart.js")
const pmStatusRoute=require("./src/Controllers/PM Status/PMStatus.js")
const hcStatusRoute=require("./src/Controllers/HCStatus/HCStatus.js")
const MouldSummary=require("./src/Controllers/Mould Summary/MouldSummary.js")
const ParameterRoute=require("./src/Controllers/Parameter/Parameter.js")
const PMCheckpointDetails=require("./src/Controllers/MouldMaintenanceHistory/PMCheckpoint.js")
const HCCheckpointDetails=require("./src/Controllers/MouldMaintenanceHistory/HCCheckpoint.js")

const app = express();



app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

//app.use(limiter);   

// app.use("/api", limiter);
app.use(express.json());

app.use("/api/login", loginRoute);

 app.use("/api/Home",HomeRoute );
app.use("/api/MouldMaintenanceHistoryPM",PMRoute );
app.use("/api/MouldMaintenanceHistoryhc",hcRoute );
app.use("/api/MouldMaintenanceHistoryBreakdownCalDetails",breakdownRoute );
app.use("/api/MouldMaintenanceHistorySparePart",SparePartRoute );
app.use("/api/PMStatus",pmStatusRoute );
app.use("/api/HCStatus",hcStatusRoute );
app.use("/api/MouldSummary",MouldSummary );
app.use("/api/MachineParameter",ParameterRoute );
//New 
app.use("/api/MouldMaintenanceHistoryPM/PMCheckpointDetails",PMCheckpointDetails );
app.use("/api/MouldMaintenanceHistoryHC/HCCheckpointDetails",HCCheckpointDetails );

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/api/status", (request, response) => {
  middlewares.standardResponse(response, null, 200, "running");
});
