// Defines the TypeScript types for the User model

/**
 * Type for the 'subscription' sub-document
 */
export type TUserSubscription = {
  tier: 'basic' | 'pro';
};

/**
 * Type for the 'profile' sub-document
 */
export type TUserProfile = {
  instruments: string[];
  genres: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  bio?: string;
};

/**
 * Type for the 'connections' sub-document.
 * Refs to other Users are represented as strings (ObjectIds) by default.
 */
export type TUserConnections = {
  following: string[]; // Array of User ObjectIds
  followers: string[]; // Array of User ObjectIds
};

/**
 * Type for the 'integrations' sub-document
 */
export type TUserIntegrations = {
  googleId?: string;
  spotify?: {
    id?: string;
    topGenres?: string[];
  };
};

/**
 * The main User type.
 * This represents a user document as it is sent from the API.
 * Note: 'password' is intentionally omitted as it should never be sent to the client.
 */
export type TUser = {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string; // This will be an ISO date string (e.g., "2023-10-27T10:00:00.000Z")
  campus?: string;
  subscription: TUserSubscription;
  profile: TUserProfile;
  joinedSessions: string[]; // An array of Session ObjectIds (can be populated)
  connections: TUserConnections;
  blockedUsers: string[]; // An array of User ObjectIds (can be populated)
  integrations: TUserIntegrations;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
