import { Router } from "express";
import { listMember, memberDetail } from "../controllers/member_controller";

const MemberRoute = Router();

MemberRoute.get("/", listMember);
MemberRoute.get("/:id", memberDetail);

export default MemberRoute;
