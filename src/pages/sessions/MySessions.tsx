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
  Table,
  Tag,
} from 'antd';
import { isAxiosError } from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

import { sessionService, TSessionFeed } from '../../services/session.service';
import SessionCard from '../../components/features/SessionCard';
import { useAuth } from '../../context/auth.context';

const { Title, Text } = Typography;

/**
 * A helper component to render a list of session cards.
 * We use this to avoid duplicating the <List> logic for both tabs.
 */
const SessionList: React.FC<{ sessions: TSessionFeed[]; emptyView: React.ReactNode }> = ({
  sessions,
  emptyView,
}) => {
  return (
    <List
      dataSource={sessions}
      // UPDATED GRID CONFIGURATION: 3 columns max to match Dashboard
      grid={{
        gutter: 24,
        xs: 1,
        sm: 1, // Single column on small devices for better readability
        md: 2,
        lg: 3,
        xl: 3, // Changed from 4 to 3
        xxl: 3, // Changed from 4 to 3
      }}
      locale={{
        emptyText: emptyView,
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
  
  const { user: currentUser, isLoading: authIsLoading } = useAuth();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const navigate = useNavigate();

  const baseColumns: ColumnsType<TSessionFeed> = [
    {
      title: 'Session',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, session) => (
        <Link to={`/sessions/${session._id}`}>
          <Text strong style={{ color: '#1677ff' }}>{title}</Text>
        </Link>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Scheduled') color = 'blue';
        if (status === 'Ongoing') color = 'green';
        if (status === 'Cancelled') color = 'red';
        return <Tag color={color}>{status || 'Scheduled'}</Tag>;
      },
    },
    {
      title: 'When',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime: string) => new Date(startTime).toLocaleString(),
      responsive: ['md'], // Hides on small screens
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      responsive: ['lg'], // Hides on medium/small screens
    },
  ];

  const hostedColumns: ColumnsType<TSessionFeed> = [
    ...baseColumns,
    {
      title: 'Attendees',
      dataIndex: 'attendees',
      key: 'attendees',
      render: (attendees: string[]) => attendees.length,
      responsive: ['sm'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, session) => (
        <Link to={`/sessions/${session._id}`}>
          <Button type="link" size="small">Manage</Button>
        </Link>
      ),
    },
  ];

  const joinedColumns: ColumnsType<TSessionFeed> = [
    ...baseColumns,
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      render: (host: TSessionFeed['host']) => (
        <Link to={`/profile/${host?._id}`}>{host?.name || 'N/A'}</Link>
      ),
      responsive: ['sm'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, session) => (
        <Link to={`/sessions/${session._id}`}>
          <Button type="link" size="small">View</Button>
        </Link>
      ),
    },
  ];

  useEffect(() => {
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
  }, [currentUser, authIsLoading]);

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

  const customEmptyView = (
    <Empty
      description={
        <Title level={4} type="secondary">
          No sessions found.
        </Title>
      }
    >
      <Button type="primary" onClick={() => navigate('/sessions/create')}>
        Create a Session
      </Button>
    </Empty>
  );

  const hostedContent = (
    viewMode === 'card' ? (
      <SessionList sessions={hostedSessions} emptyView={customEmptyView} />
    ) : (
      <Table
        dataSource={hostedSessions}
        columns={hostedColumns}
        rowKey="_id"
        locale={{ emptyText: customEmptyView }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    )
  );

  const joinedContent = (
    viewMode === 'card' ? (
      <SessionList sessions={joinedSessions} emptyView={customEmptyView} />
    ) : (
      <Table
        dataSource={joinedSessions}
        columns={joinedColumns}
        rowKey="_id"
        locale={{ emptyText: customEmptyView }}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    )
  );

  const tabItems = [
    {
      label: `Hosted Sessions (${hostedSessions.length})`,
      key: '1',
      children: hostedContent,
    },
    {
      label: `Joined Sessions (${joinedSessions.length})`,
      key: '2',
      children: joinedContent,
    },
  ];

  return (
    <Card style={{ borderRadius: '16px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            My Sessions
          </Title>
        </Col>
        <Col>
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <Radio.Button value="card">Card View</Radio.Button>
            <Radio.Button value="table">Table View</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      <Tabs 
        defaultActiveKey="1"
        items={tabItems}
      />
      
    </Card>
  );
};

export default MySessions;