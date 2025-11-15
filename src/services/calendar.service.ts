import apiClient from './apiClient';

/**
 * Fetches Google Calendar events from our backend.
 */
const getCalendarEvents = async () => {
  try {
    const response = await apiClient.get('/calendar/my-events');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    throw error;
  }
};

/**
 * Tells the backend to add a specific session to the user's Google Calendar.
 */
const addSessionToCalendar = async (sessionId: string) => {
  try {
    // This is the correct path that fixes your error
    const response = await apiClient.post(`/calendar/add-session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to add session to calendar:', error);
    throw error;
  }
};

export const calendarService = {
  getCalendarEvents,
  addSessionToCalendar,
};