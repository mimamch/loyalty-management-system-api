import { Router } from "express";
import {
  addMemberActivity,
  addMemberReferral,
  listMember,
  memberDetail,
  memberRedeemRoyalty,
} from "../controllers/member_controller";

const MemberRoute = Router();

MemberRoute.get("/", listMember);
MemberRoute.get("/:id", memberDetail);
MemberRoute.post("/referral", addMemberReferral);
MemberRoute.post("/activity", addMemberActivity);
MemberRoute.post("/redeem", memberRedeemRoyalty);

export default MemberRoute;
