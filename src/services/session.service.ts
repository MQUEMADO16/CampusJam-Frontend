import apiClient from './apiClient';
import { TSession, TUser, TMessage } from '../types';

// --- Request Body Type Definitions ---

// Type for creating a new session (omits auto-generated fields)
type TCreateSessionData = Pick<TSession,
  'title' | 'host' | 'startTime'
> & Partial<Pick<TSession, // Optional fields
  'description' | 'isPublic' | 'endTime' | 'location' | 'genre' | 'skillLevel' | 'instrumentsNeeded' | 'spotifyPlaylistUrl'
>>;

// Type for updating a session (all fields optional)
type TUpdateSessionData = Partial<Omit<TSession, '_id' | 'host' | 'attendees' | 'invitedUsers' | 'createdAt' | 'updatedAt'>>;

// Type for adding/removing a user to/from participants
type TParticipantData = {
  userId: string;
};

// Type for setting/updating session visibility
type TVisibilityData = {
  sessionId: string;
  isPublic: boolean;
};

// --- API Service Object ---

export const sessionService = {
  /**
   * Fetches all public sessions.
   * GET /api/sessions
   */
  getAllPublicSessions: () => {
    // Assumes host is populated with name/skillLevel as per controller
    type TPopulatedHost = Pick<TUser, '_id' | 'name'> & { profile: Pick<TUser['profile'], 'skillLevel'> };
    type TSessionWithPopulatedHost = Omit<TSession, 'host'> & { host: TPopulatedHost };
    return apiClient.get<TSessionWithPopulatedHost[]>('/sessions');
  },

  /**
   * Creates a new session.
   * POST /api/sessions
   */
  createSession: (sessionData: TCreateSessionData) => {
    return apiClient.post<{ message: string; session: TSession }>('/sessions', sessionData);
  },

  /**
   * Fetches a single session by its ID, populating host and attendees.
   * GET /api/sessions/:id
   */
  getSessionById: (sessionId: string) => {
    // Define types for populated fields based on controller
    type TPopulatedUser = Omit<TUser, 'password' | '__v'>; // Using simple Omit for brevity
    type TSessionWithPopulatedRefs = Omit<TSession, 'host' | 'attendees' | 'invitedUsers'> & {
        host: TPopulatedUser;
        attendees: TPopulatedUser[]; // Backend populates attendees.user
        invitedUsers: TPopulatedUser[]; // Assume this is populated too, adjust if not
    };
    return apiClient.get<TSessionWithPopulatedRefs>(`/sessions/${sessionId}`);
  },

  /**
   * Updates an existing session by ID.
   * PUT /api/sessions/:id
   */
  updateSession: (sessionId: string, updateData: TUpdateSessionData) => {
    return apiClient.put<{ message: string; session: TSession }>(
      `/sessions/${sessionId}`,
      updateData
    );
  },

  /**
   * Deletes a session by ID.
   * DELETE /api/sessions/:id
   */
  deleteSessionById: (sessionId: string) => {
    return apiClient.delete<{ message: string }>(`/sessions/${sessionId}`);
  },

  /**
   * Fetches the participants (attendees) of a session, populated.
   * GET /api/sessions/:id/participants
   */
  getSessionParticipants: (sessionId: string) => {
    // Controller populates attendees.user
     type TPopulatedAttendee = Omit<TUser, 'password' | '__v'>; // Using simple Omit
     return apiClient.get<TPopulatedAttendee[]>(`/sessions/${sessionId}/participants`);
  },

  /**
   * Adds a user to a session's attendees list.
   * POST /api/sessions/:id/participants
   */
  addUserToSession: (sessionId: string, userId: string) => {
    return apiClient.post<{ message: string; attendees: string[] }>( // Returns array of ObjectIds
      `/sessions/${sessionId}/participants`,
      { userId }
    );
  },

  /**
   * Removes a user from a session's attendees list.
   * DELETE /api/sessions/:id/participants/:userId
   */
  removeUserFromSession: (sessionId: string, userId: string) => {
    return apiClient.delete<{ message: string; attendees: string[] }>( // Returns array of ObjectIds
      `/sessions/${sessionId}/participants/${userId}`
    );
  },

  /**
   * Gets the visibility (isPublic) status of a session.
   * GET /api/sessions/:id/visibility
   */
  getVisibility: (sessionId: string) => {
    return apiClient.get<{ visibility: boolean }>(`/sessions/${sessionId}/visibility`);
  },

  /**
   * Sets the visibility status of a session (using POST).
   * POST /api/sessions/visibility
   */
  setVisibility: (sessionId: string, isPublic: boolean) => {
    return apiClient.post<{ message: string }>(`/sessions/visibility`, { sessionId, isPublic });
  },

  /**
   * Updates the visibility status of a session (using PUT).
   * PUT /api/sessions/visibility
   */
  updateVisibility: (sessionId: string, isPublic: boolean) => {
    return apiClient.put<{ message: string }>(`/sessions/visibility`, { sessionId, isPublic });
  },

  /**
   * Marks a session as complete ('Finished').
   * POST /api/sessions/:id/complete
   */
  markComplete: (sessionId: string) => {
    return apiClient.post<{ message: string; session: TSession }>(
      `/sessions/${sessionId}/complete`
    );
  },

  /**
   * Fetches all sessions currently marked as 'Ongoing'.
   * GET /api/sessions/active
   */
  getActiveSessions: () => {
    return apiClient.get<TSession[]>('/sessions/active');
  },

  /**
   * Fetches all sessions marked as 'Scheduled' that start now or in the future.
   * GET /api/sessions/upcoming
   */
  getUpcomingSessions: () => {
    return apiClient.get<TSession[]>('/sessions/upcoming');
  },

  /**
   * Fetches all sessions marked as 'Finished'.
   * GET /api/sessions/past
   */
  getPastSessions: () => {
    return apiClient.get<TSession[]>('/sessions/past');
  },
};
