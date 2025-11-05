import React, { useState, useEffect } from 'react';
import { List, Spin, Typography, Alert, Empty, Button } from 'antd';
import { isAxiosError } from 'axios';

// Import the service and the card component
import { sessionService, TSessionFeed } from '../../services/session.service';
import SessionCard from '../../components/features/SessionCard';

const { Title } = Typography;

/**
 * The main dashboard page.
 * It's a "smart" component that fetches the list of all sessions
 * and then uses the <SessionCard> component to render each one.
 */
const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<TSessionFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await sessionService.getAllPublicSessions();
        
        setSessions(response.data); 

      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        if (isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load sessions.');
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSessions();
  }, []);

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        Public Jam Sessions
      </Title>

      <List
        dataSource={sessions}
        // This makes the list render in a responsive grid
        grid={{
          gutter: 24,
          xs: 1, // 1 column on extra small screens
          sm: 2, // 2 columns on small screens
          md: 2, // 2 columns on medium screens
          lg: 3, // 3 columns on large screens
          xl: 4, // 4 columns on extra large screens
          xxl: 4,
        }}
        // If the list is empty, show this
        locale={{
          emptyText: (
            <Empty
              description={
                <Title level={4} type="secondary">
                  No jam sessions found.
                </Title>
              }
            >
              <Button type="primary">Create a Session</Button>
            </Empty>
          ),
        }}
        renderItem={(session) => (
          <List.Item>
            {/* We pass the single session object to our reusable card */}
            <SessionCard session={session} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Dashboard;

