/**
 * Centralized API Endpoints Registry
 */
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
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
  HEALTH: '/health',
} as const;
