import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';

import { TUser } from '../types';
import AuthService from '../services/auth.service';
import { userService } from '../services/user.service'; // To fetch user on load
import apiClient from '../services/apiClient'; // To set token on apiClient

/**
 * A simple JWT parser.
 * It decodes the payload of a JWT token.
 * NOTE: This does NOT verify the signature. It just decodes.
 */
function parseJwt(token: string): { id: string; email: string; iat: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT:', e);
    return null;
  }
}

// --- Define the shape of the Context ---
interface AuthContextType {
  user: TUser | null;
  token: string | null;
  isLoading: boolean; // True while checking for existing session
  login: (user: TUser, token: string) => void;
  logout: () => void;
}

// --- Create the Context ---
// Be are sure we will provide a value before any consumer tries to access it.
const AuthContext = createContext<AuthContextType>(null!);

// --- Create the Provider Component ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true

  /**
   * On app load, check localStorage for a token.
   * If found, validate it by fetching the user profile.
   */
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const storedToken = AuthService.getToken();

      if (storedToken) {
        try {
          // Decode token to get user ID
          const decoded = parseJwt(storedToken);
          if (!decoded || !decoded.id) {
            throw new Error('Invalid token');
          }

          // Set token for apiClient before making the request
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Fetch the user's data
          const response = await userService.getUserById(decoded.id);
          
          // If successful, set the auth state
          setUser(response.data);
          setToken(storedToken);

        } catch (error) {
          console.error('Session restore failed:', error);
          // Token is invalid or expired. Clear it.
          AuthService.logout(); // Clears localStorage
          delete apiClient.defaults.headers.common['Authorization'];
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // --- Define Login/Logout Functions ---

  /**
   * Login function to be called from the Login component.
   * It sets the user and token in the state.
   */
  const login = useCallback((loggedInUser: TUser, userToken: string) => {
    setUser(loggedInUser);
    setToken(userToken);
    // The auth.service.login funciton already set the token in localStorage
    // The apiClient interceptor will now pick it up for future requests.
    // We can also set it explicitly just in case.
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
  }, []);

  /**
   * Logout function to be called from a Logout button, etc.
   * It clears state and localStorage.
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    AuthService.logout(); // Clears localStorage
    delete apiClient.defaults.headers.common['Authorization'];
    // You might want to redirect to /login here
    // window.location.href = '/login';
  }, []);

  // --- Provide the context value ---
  // We use useMemo to prevent unnecessary re-renders of consumers
  // when the provider's internal state changes but the value objects
  // are technically the same.
  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- Create the Custom Hook ---
/**
 * The `useAuth` hook is what your components will import
 * to access the auth state and functions.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};