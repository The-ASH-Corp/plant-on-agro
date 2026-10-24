import { Router } from "express";
import { Container } from "../../infrastructure/di/container";
import { validateRequest } from "../middlewares/validate.middleware";
import { authRateLimiter } from "../middlewares/rate-limiter.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import {
  registerSchema,
  loginSchema,
  checkEmailSchema,
  requestPasswordResetOtpSchema,
  verifyPasswordResetOtpSchema,
  resetPasswordWithOtpSchema,
} from "../validators/auth.validator";

const router = Router();

router.post(
  "/check-email",
  validateRequest({ body: checkEmailSchema }),
  Container.authController.checkEmail
);

router.post(
  "/register",
  authRateLimiter,
  validateRequest({ body: registerSchema }),
  Container.authController.register
);

router.post(
  "/login",
  authRateLimiter,
  validateRequest({ body: loginSchema }),
  Container.authController.login
);

router.get("/me", authenticate, Container.authController.me);

// Forgot Password OTP Endpoints
router.post(
  "/forgot-password/request-otp",
  authRateLimiter,
  validateRequest({ body: requestPasswordResetOtpSchema }),
  Container.authController.requestPasswordResetOtp
);

router.post(
  "/forgot-password/verify-otp",
  authRateLimiter,
  validateRequest({ body: verifyPasswordResetOtpSchema }),
  Container.authController.verifyPasswordResetOtp
);

router.post(
  "/forgot-password/reset-password",
  authRateLimiter,
  validateRequest({ body: resetPasswordWithOtpSchema }),
  Container.authController.resetPasswordWithOtp
);

export const authRoutes = router;
