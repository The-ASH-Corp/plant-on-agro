import { Router } from "express";
import { Container } from "../../infrastructure/di/container";
import { validateRequest } from "../middlewares/validate.middleware";
import { authRateLimiter } from "../middlewares/rate-limiter.middleware";
import { registerSchema, loginSchema } from "../validators/auth.validator";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validateRequest({ body: registerSchema }),
  Container.authController.register,
);

router.post(
  "/login",
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  Container.authController.login,
);

export const authRoutes = router;
