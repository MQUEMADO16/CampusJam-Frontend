import apiClient from './apiClient';
import { TMessage, TUser } from '../types';

// Payload for sending a direct message
type TSendDirectMessageData = {
  recipientId: string;
  content: string;
};

// Payload for sending a session message
type TSendSessionMessageData = {
  content: string;
};

export const messageService = {

  // Direct messaging (User-to-User)

  getConversations: () => {
    return apiClient.get<{ message: string; conversations: any[] }>(
      '/messages/conversations'
    );
  },

  /**
   * Fetches the conversation history between the current user and another user.
   * GET /api/messages/dm/:userId
   */
  getDirectMessages: (userId: string) => {
    return apiClient.get<{ message: string; messages: TMessage[] }>(
      `/messages/dm/${userId}`
    );
  },

  /**
   * Sends a direct message to another user.
   * POST /api/messages/dm
   */
  sendDirectMessage: (messageData: TSendDirectMessageData) => {
    return apiClient.post<{ message: string; data: TMessage }>(
      '/messages/dm',
      messageData
    );
  },

  /**
   * Marks all messages from a specific sender as read.
   * PUT /api/messages/dm/:senderId/read
   */
  markAsRead: (senderId: string) => {
    return apiClient.put<{ message: string }>(
      `/messages/dm/${senderId}/read`
    );
  },

  // Session messaging (Group Chat)

  /**
   * Fetches all messages for a specific session.
   * GET /api/messages/session/:sessionId
   */
  getSessionMessages: (sessionId: string) => {
    return apiClient.get<{ message: string; messages: TMessage[] }>(
      `/messages/session/${sessionId}`
    );
  },

  /**
   * Sends a message to a specific session.
   * POST /api/messages/session/:sessionId
   */
  sendSessionMessage: (sessionId: string, messageData: TSendSessionMessageData) => {
    return apiClient.post<{ message: string; data: TMessage }>(
      `/messages/session/${sessionId}`,
      messageData
    );
  },
};