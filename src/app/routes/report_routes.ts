import { Router } from "express";
import {
  exportData,
  reportEarned,
  reportRedemeed,
} from "../controllers/report_controller";

const ReportRoute = Router();

ReportRoute.get("/earned", reportEarned);
ReportRoute.get("/redeemed", reportRedemeed);
ReportRoute.get("/export", exportData);

export default ReportRoute;
