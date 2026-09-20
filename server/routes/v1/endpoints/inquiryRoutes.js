import express from 'express';
import { createInquiry, getUserInquiries } from '../../../controllers/inquiryController.js';
import { authMiddleware } from '../../../middleware/auth.middleware.js';

const router = express.Router();

// Allow submitting inquiry with or without auth (optional auth inside controller via cookie/header)
const optionalAuth = (req, res, next) => {
  authMiddleware(req, res, () => {
    next();
  }).catch(() => next());
};

router.post('/', (req, res, next) => {
  // Try authenticating, but if not authenticated still allow submitting inquiry
  if (req.cookies?.token || req.headers?.authorization) {
    authMiddleware(req, res, next);
  } else {
    next();
  }
}, createInquiry);

router.get('/', authMiddleware, getUserInquiries);

export default router;
