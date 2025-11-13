import apiClient from './apiClient';

/**
 * Fetches Google Calendar events from our backend.
 */
const getCalendarEvents = async () => {
  try {
    const response = await apiClient.get('/calendar/my-events'); // <-- RIGHT
    return response.data;
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    throw error;
  }
};

export const calendarService = {
  getCalendarEvents,
};