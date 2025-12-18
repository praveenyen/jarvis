import { 
  signIn as amplifySignIn, 
  signOut as amplifySignOut, 
  signUp as amplifySignUp, 
  signInWithRedirect as amplifySignInWithRedirect,
  confirmSignUp, 
  resendSignUpCode, 
  resetPassword, 
  confirmResetPassword 
} from 'aws-amplify/auth';
import type { 
  SignInInput, 
  SignUpInput, 
  ConfirmSignUpInput, 
  ResendSignUpCodeInput, 
  ResetPasswordInput, 
  ConfirmResetPasswordInput,
  SignInWithRedirectInput
} from 'aws-amplify/auth';

export async function signIn(input: SignInInput) {
  try {
    const result = await amplifySignIn(input);
    return { success: true, result };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error };
  }
}

export async function signOut() {
  try {
    await amplifySignOut();
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error };
  }
}

export async function signUp(input: SignUpInput) {
  try {
    const result = await amplifySignUp(input);
    return { success: true, result };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error };
  }
}

export async function confirmSignUpCode(input: ConfirmSignUpInput) {
  try {
    const result = await confirmSignUp(input);
    return { success: true, result };
  } catch (error) {
    console.error('Confirm sign up error:', error);
    return { success: false, error };
  }
}

export async function resendConfirmationCode(input: ResendSignUpCodeInput) {
  try {
    const result = await resendSignUpCode(input);
    return { success: true, result };
  } catch (error) {
    console.error('Resend code error:', error);
    return { success: false, error };
  }
}

export async function requestPasswordReset(input: ResetPasswordInput) {
  try {
    const result = await resetPassword(input);
    return { success: true, result };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error };
  }
}

export async function confirmPasswordReset(input: ConfirmResetPasswordInput) {
  try {
    const result = await confirmResetPassword(input);
    return { success: true, result };
  } catch (error) {
    console.error('Confirm password reset error:', error);
    return { success: false, error };
  }
}

export async function signInWithRedirect(input?: SignInWithRedirectInput) {
  try {
    await amplifySignInWithRedirect(input);
    return { success: true };
  } catch (error) {
    console.error('Sign in with redirect error:', error);
    return { success: false, error };
  }
}

// Re-export types for convenience
export type { 
  SignInInput, 
  SignUpInput, 
  ConfirmSignUpInput, 
  ResendSignUpCodeInput, 
  ResetPasswordInput, 
  ConfirmResetPasswordInput,
  SignInWithRedirectInput
};
