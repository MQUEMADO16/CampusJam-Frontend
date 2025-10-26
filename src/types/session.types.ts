// Defines the TypeScript types for the Session (JamSession) model

/**
 * String literal union for session status.
 */
export type TSessionStatus = 'Scheduled' | 'Ongoing' | 'Finished' | 'Cancelled';

/**
 * String literal union for session skill level.
 */
export type TSessionSkillLevel = 'Any' | 'Beginner' | 'Intermediate' | 'Advanced';

/**
 * The main Session type.
 * This represents a jam session document.
 */
export type TSession = {
  _id: string;
  title: string;
  description?: string;
  host: string; // A User ObjectId. API will likely populate this into a TUser object.
  isPublic: boolean;
  status: TSessionStatus;
  startTime: string; // ISO date string
  endTime?: string; // ISO date string
  location?: string;
  genre?: string;
  skillLevel: TSessionSkillLevel;
  instrumentsNeeded: string[];
  spotifyPlaylistUrl?: string;
  attendees: string[]; // Array of User ObjectIds. API can populate this.
  invitedUsers: string[]; // Array of User ObjectIds. API can populate this.
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
