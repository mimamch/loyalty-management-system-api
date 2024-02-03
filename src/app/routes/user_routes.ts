import { Router } from "express";
import { userSignIn } from "../controllers/user_controller";

const UserRouter = Router();

UserRouter.post("/sign-in", userSignIn);

export default UserRouter;
