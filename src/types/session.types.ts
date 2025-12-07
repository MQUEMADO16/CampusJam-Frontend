// Defines the TypeScript types for the Session (JamSession) model

import { TUser } from './user.types';

/**
 * String literal union for session status.
 */
export type TSessionStatus = 'Scheduled' | 'Ongoing' | 'Finished' | 'Cancelled';

/**
 * String literal union for session skill level.
 */
export type TSessionSkillLevel = 'Any' | 'Beginner' | 'Intermediate' | 'Advanced';

/**
 * The main Jam Session type.
 * This represents a session document as it is sent from the API.
 */
export type TSession = {
  _id: string;
  title: string;
  description?: string;
  host: TUser; // Populated from User model
  isPublic: boolean;
  status: 'Scheduled' | 'Ongoing' | 'Finished' | 'Cancelled';
  startTime: string; // ISO date string
  endTime?: string; // ISO date string
  location?: string;
  address?: string;
  genre?: string;
  skillLevel: 'Any' | 'Beginner' | 'Intermediate' | 'Advanced';
  instrumentsNeeded: string[];
  spotifyPlaylistUrl?: string;
  attendees: TUser[]; // Populated from User model
  invitedUsers: string[]; // Just ObjectIds
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};
