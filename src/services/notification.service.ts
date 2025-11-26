import apiClient from './apiClient';

/**
 * Fetch all notifications for the current user
 */
export const getNotifications = () => {
  return apiClient.get('/notifications');
};

/**
 * Mark a single notification as read
 * @param id - The ID of the notification
 */
export const markNotificationRead = (id: string) => {
  return apiClient.put(`/notifications/${id}/read`);
};

/**
 * Mark ALL notifications as read for the current user
 */
export const markAllNotificationsRead = () => {
  return apiClient.put('/notifications/read-all');
};