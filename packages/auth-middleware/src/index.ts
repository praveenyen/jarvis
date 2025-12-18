// Middleware (server-only, safe for middleware.ts)
export type { MiddlewareConfig } from './middleware';
export { createAuthMiddleware } from './middleware';
export { isPrivateRoute, isPublicRoute } from './route-utils';

// Auth configuration (shared)
export type { AmplifyAuthConfig } from './auth-config';
export { createAuthConfig } from './auth-config';

// Client-side Amplify configuration (client-safe)
export { configureAmplifyClient, getAmplifyConfig } from './amplify-client-config';

// Note: For server-side auth functions, import from '@repo/auth-middleware/server'
// Note: For client-side auth functions, import from '@repo/auth-middleware/client'
