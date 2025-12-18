# @repo/auth-middleware

Shared authentication middleware and utilities for AWS Amplify Cognito across all microfrontend apps.

## Features

- ✅ Centralized AWS Amplify authentication configuration
- ✅ Next.js middleware for route protection
- ✅ Server-side auth functions (SSR/API routes)
- ✅ Client-side auth functions (sign in, sign out, sign up, etc.)
- ✅ TypeScript support with full type definitions

## Installation

This package is automatically available in the workspace. Add it to your app's `package.json`:

```json
{
  "dependencies": {
    "@repo/auth-middleware": "workspace:*"
  }
}
```

## Usage

### 1. Configure Middleware

In your app's `middleware.ts`:

```typescript
import { createAuthMiddleware, createAuthConfig, initializeAmplifyServer } from '@repo/auth-middleware';

// Initialize Amplify server configuration
initializeAmplifyServer(
  createAuthConfig({
    userPoolId: String(process.env.NEXT_PUBLIC_USER_POOL_ID),
    userPoolClientId: String(process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID),
    cognitoDomain: String(process.env.NEXT_PUBLIC_COGNITO_DOMAIN),
    redirectSignInUrls: [
      String(process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN_URL),
    ],
    redirectSignOutUrls: [
      String(process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT_URL),
    ],
    oAuthScopes: ['phone', 'email', 'profile', 'openid'],
    providers: ['Google'],
  })
);

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$|api/).*)'],
};

// Configure protected routes
export const middleware = createAuthMiddleware({
  privateRoutes: ['/dashboard', '/profile', '/settings'],
  loginRedirectPath: '/login',
});
```

### 2. Server-Side Auth Functions

Use in Server Components, Server Actions, or API Routes:

```typescript
import { getCurrentUser, getAuthSession, checkAuthentication } from '@repo/auth-middleware';

// Get current authenticated user
export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return <div>Welcome {user.email}</div>;
}

// Check if user is authenticated
const isAuthenticated = await checkAuthentication();

// Get full auth session
const session = await getAuthSession();
```

### 3. Client-Side Auth Functions

Use in Client Components:

```typescript
'use client';

import { signIn, signOut, signUp } from '@repo/auth-middleware';

export function LoginForm() {
  async function handleSignIn() {
    const result = await signIn({
      username: 'user@example.com',
      password: 'password123',
    });
    
    if (result.success) {
      // Handle successful sign in
    }
  }
  
  return <button onClick={handleSignIn}>Sign In</button>;
}
```

## Available Functions

### Server-Side

- `initializeAmplifyServer(config)` - Initialize Amplify server configuration
- `getCurrentUser()` - Get current user attributes
- `getAuthSession()` - Get auth session with tokens
- `checkAuthentication()` - Check if user is authenticated

### Client-Side

- `signIn(input)` - Sign in user
- `signOut()` - Sign out user
- `signUp(input)` - Sign up new user
- `confirmSignUpCode(input)` - Confirm sign up with code
- `resendConfirmationCode(input)` - Resend confirmation code
- `requestPasswordReset(input)` - Request password reset
- `confirmPasswordReset(input)` - Confirm password reset with code

### Configuration

- `createAuthConfig(config)` - Create Amplify auth configuration
- `createAuthMiddleware(config)` - Create Next.js middleware for route protection

## Environment Variables

Required environment variables for each app:

```env
NEXT_PUBLIC_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_USER_POOL_CLIENT_ID=your-client-id
NEXT_PUBLIC_COGNITO_DOMAIN=your-cognito-domain.auth.region.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN_URL=https://yourapp.com/
NEXT_PUBLIC_REDIRECT_SIGN_OUT_URL=https://yourapp.com/login
```

## Benefits

- **No duplication**: Install AWS Amplify packages only once in the shared package
- **Consistent auth**: Same auth logic across all apps
- **Easy updates**: Update auth logic in one place
- **Type safety**: Full TypeScript support
- **Flexible**: Each app can have different protected routes
