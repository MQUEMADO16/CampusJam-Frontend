import React, { useState, useEffect } from 'react';
import {
  List,
  Spin,
  Typography,
  Alert,
  Empty,
  Button,
  Tabs,
  Radio,
  Card,
  Row,
  Col,
} from 'antd';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { sessionService, TSessionFeed } from '../../services/session.service';
import SessionCard from '../../components/features/SessionCard';
import { useAuth } from '../../context/auth.context';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

/**
 * A helper component to render a list of session cards.
 * We use this to avoid duplicating the <List> logic for both tabs.
 */
const SessionList: React.FC<{ sessions: TSessionFeed[] }> = ({ sessions }) => {
  const navigate = useNavigate();

  return (
    <List
      dataSource={sessions}
      grid={{
        gutter: 24,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 4,
      }}
      locale={{
        emptyText: (
          <Empty
            description={
              <Title level={4} type="secondary">
                No sessions found.
              </Title>
            }
          >
            <Button type="primary" onClick={() => navigate('/create-session')}>
              Create a Session
            </Button>
          </Empty>
        ),
      }}
      renderItem={(session) => (
        <List.Item>
          <SessionCard session={session} />
        </List.Item>
      )}
    />
  );
};

/**
 * The "My Sessions" page.
 * This is the primary dashboard for a logged-in user, showing their
 * hosted and joined sessions.
 */
const MySessions: React.FC = () => {
  const [hostedSessions, setHostedSessions] = useState<TSessionFeed[]>([]);
  const [joinedSessions, setJoinedSessions] = useState<TSessionFeed[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get auth state to ensure user is loaded before fetching
  const { user: currentUser, isLoading: authIsLoading } = useAuth();

  // State for the Card/Table view toggle
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    // Don't fetch until the auth check is complete
    if (authIsLoading) {
      return;
    }
    if (!currentUser) {
      setIsLoading(false);
      setError('You must be logged in to view your sessions.');
      return;
    }

    const fetchUserSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await sessionService.getUserSessions();
        
        // Populate both state arrays from the single response,
        // using fallbacks to ensure they are always arrays.
        setHostedSessions(response.data.hostedSessions || []);
        setJoinedSessions(response.data.joinedSessions || []);

      } catch (err) {
        console.error('Failed to fetch user sessions:', err);
        if (isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load sessions.');
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSessions();
  }, [currentUser, authIsLoading]); // Re-run if auth state changes

  if (authIsLoading || isLoading) {
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
    <Card style={{ borderRadius: '16px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            My Sessions
          </Title>
        </Col>
        <Col>
          {/* This is the placeholder for the view switcher */}
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <Radio.Button value="card">Card View</Radio.Button>
            <Radio.Button value="table" disabled>Table View</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      {/* Use AntD's Tabs to separate Hosted and Joined sessions */}
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={`Hosted Sessions (${hostedSessions.length})`}
          key="1"
        >
          {/* We only render the list if viewMode is 'card' */}
          {viewMode === 'card' && <SessionList sessions={hostedSessions} />}
          {viewMode === 'table' && <Text>Table view coming soon!</Text>}
        </TabPane>
        <TabPane
          tab={`Joined Sessions (${joinedSessions.length})`}
          key="2"
        >
          {viewMode === 'card' && <SessionList sessions={joinedSessions} />}
          {viewMode === 'table' && <Text>Table view coming soon!</Text>}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default MySessions;
