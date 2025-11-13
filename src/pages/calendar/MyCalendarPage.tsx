import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import { Spin, message, Alert } from 'antd';
import { calendarService } from '../../services/calendar.service';

// Import the CSS for the calendar
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer
const localizer = momentLocalizer(moment);

// Define what our Google Event looks like
interface GoogleEvent {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    date?: string; // For all-day events
  };
  end: {
    dateTime: string;
    date?: string; // For all-day events
  };
}

const MyCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const googleEvents: GoogleEvent[] = await calendarService.getCalendarEvents();

        // We must transform Google's data into the format BigCalendar expects
        const formattedEvents: Event[] = googleEvents.map((event) => ({
          id: event.id,
          title: event.summary,
          start: new Date(event.start.dateTime || event.start.date!),
          end: new Date(event.end.dateTime || event.end.date!),
        }));

        setEvents(formattedEvents);
      } catch (err: any) {
        let msg = 'Failed to load calendar.';
        if (err.response?.data?.message) {
          msg = err.response.data.message;
        }
        setError(msg);
        message.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div style={{ height: '80vh', padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default MyCalendarPage;