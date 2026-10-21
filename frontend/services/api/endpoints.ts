/**
 * Centralized API Endpoints Registry
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    CHECK_EMAIL: '/auth/check-email',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  TREE_VARIETIES: {
    BASE: '/tree-varieties',
    BY_ID: (id: string) => `/tree-varieties/${id}`,
  },
  ADOPTION_PLANS: {
    BASE: '/adoption-plans',
    BY_ID: (id: string) => `/adoption-plans/${id}`,
  },
  TREE_INSTANCES: {
    BASE: '/tree-instances',
    BY_ID: (id: string) => `/tree-instances/${id}`,
    BY_TAG: (tag: string) => `/tree-instances/tag/${tag}`,
  },
  CERTIFICATES: {
    BASE: '/certificates',
    BY_ID: (id: string) => `/certificates/${id}`,
    BY_NUMBER: (number: string) => `/certificates/number/${number}`,
    VERIFY: (tokenOrNumber: string) => `/certificates/verify/${tokenOrNumber}`,
  },
  LANDING_PAGE: {
    BASE: '/landing-page',
    RESET: '/landing-page/reset',
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
    BY_NUMBER: (orderNumber: string) => `/orders/number/${orderNumber}`,
    STATUS: (id: string) => `/orders/${id}/status`,
    MARK_ALL_READ: '/orders/mark-all-read',
  },
  LOCATIONS: {
    BASE: '/locations',
    BY_ID: (id: string) => `/locations/${id}`,
  },
  UPLOAD: {
    TREE_IMAGE: '/upload/tree-image',
  },
  HEALTH: '/health',
} as const;
