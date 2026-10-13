import { Router } from "express";
import { Container } from "../../infrastructure/di/container";
import { validateRequest } from "../middlewares/validate.middleware";
import { authRateLimiter } from "../middlewares/rate-limiter.middleware";
import { registerSchema } from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validateRequest({ body: registerSchema }),
  Container.authController.register,
);

export const authRoutes = router;
