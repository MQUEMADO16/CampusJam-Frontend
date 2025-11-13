import { isAxiosError } from 'axios';
import apiClient from './apiClient';
import { TUser } from '../types';

// --- Type Definitions ---

// Type for login input
// Based on auth.controller: const { email, password } = req.body;
interface LoginCredentials {
  email: string;
  password: string;
}

// Type for login output
interface AuthResponse {
  message: string;
  token: string;
  user: TUser;
}

// --- ADDED THIS ---
// Type for the response from our /auth/google-url endpoint
interface GoogleAuthUrlResponse {
  url: string;
}

/**
 * Logs the user in by calling the /auth/login endpoint.
 * On success, it stores the JWT in localStorage.
 */
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

    // If the API call was successful, store the token.
    // The key 'authToken' MUST match the key in your apiClient interceptor.
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    // Return all data (user object, token, message) to the component/context
    // so it can update the global application state.
    return response.data;

  } catch (error) {
    let errorMessage = 'An unexpected error occurred during login.';

    if (isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Cannot connect to the server. Please try again later.';
      } else {
        // Something else happened in setting up the request
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      // This is a standard JavaScript error
      errorMessage = error.message;
    }

    console.error('Login failed:', errorMessage, error);
    
    throw new Error(errorMessage);
  }
};

/**
 * Logs the user out by removing the token from localStorage.
 * apiClient interceptor will automatically stop sending the
 * Authorization header on future requests.
 */
const logout = () => {
  // Must remove the exact same key.
  localStorage.removeItem('authToken');
  // Can also add logic here to redirect the user:
  // window.location.href = '/login';
};

/**
 * A helper function to get the current token from storage.
 * This is useful for global AuthContext to check if a user
 * is already logged in when the app first loads.
 */
const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * A helper to get the user object from storage.
 */
const getStoredUser = (): TUser | null => {
  const userJson = localStorage.getItem('user'); // Assuming you decide to store it
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as TUser;
  } catch (error) {
    console.error('Failed to parse stored user:', error);
    return null;
  }
};

const getGoogleAuthUrl = async (): Promise<string> => {
  try {
    // apiClient will automatically send the 'authToken' header
    const response = await apiClient.get<GoogleAuthUrlResponse>('/auth/google-url');
    
    // The response is { url: '...' }, so we just return the string
    return response.data.url; 

  } catch (error) {
    let errorMessage = 'An unexpected error occurred trying to link Google.';

    if (isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.message) {
        // This will catch the 'User not authenticated' message
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = 'Cannot connect to the server.';
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('Failed to get Google Auth URL:', errorMessage, error);
    throw new Error(errorMessage);
  }
};

// Export all auth-related methods as a single service object.
const AuthService = {
  login,
  logout,
  getToken,
  getStoredUser,
  getGoogleAuthUrl,
};

export default AuthService;