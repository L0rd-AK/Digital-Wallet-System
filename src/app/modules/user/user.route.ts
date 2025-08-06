import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { updateUserZodSchema } from "./user.validation";

const router = Router()

router.post("/register",
    // validateRequest(createUserZodSchema),
    UserControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers)
router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe)
router.get("/:id", checkAuth(Role.ADMIN), UserControllers.getSingleUser)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)

// Admin routes for agent management
router.get("/agents/all", checkAuth(Role.ADMIN), UserControllers.getAllAgents)
router.patch("/agents/:id/approve", checkAuth(Role.ADMIN), UserControllers.approveAgent)
router.patch("/agents/:id/suspend", checkAuth(Role.ADMIN), UserControllers.suspendAgent)

// /api/v1/user/:id
export const UserRoutes = router