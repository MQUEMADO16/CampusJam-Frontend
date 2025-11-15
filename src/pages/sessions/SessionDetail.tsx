import React, { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Button,
  Tag,
  Divider,
  Row,
  Col,
  Space,
  Spin,
  List,
  Descriptions,
  message,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

// --- Import Services, Context, and Types ---
import { sessionService } from '../../services/session.service';
import { calendarService } from '../../services/calendar.service';
import { useAuth } from '../../context/auth.context';
import { TSession, TUser } from '../../types';

// --- Import Error Pages ---
import AccessDenied from '../AccessDenied';
import NotFound from '../NotFound';

const { Title, Text, Paragraph } = Typography;

/**
 * Renders a colored tag based on the session status.
 */
const StatusTag: React.FC<{ status: TSession['status'] }> = ({ status }) => {
  switch (status) {
    case 'Scheduled':
      return <Tag color="blue">{status}</Tag>;
    case 'Ongoing':
      return <Tag color="green">{status}</Tag>;
    case 'Finished':
      return <Tag color="default">{status}</Tag>;
    case 'Cancelled':
      return <Tag color="red">{status}</Tag>;
    default:
      return <Tag>{status}</Tag>;
  }
};



// The error indicates the API returns a TSession with 'invitedUsers' populated.
// We'll create a local type for this to use in our state.
type TPopulatedSession = Omit<TSession, 'invitedUsers'> & {
  invitedUsers: TUser[]; // The API is sending TUser objects
};

const SessionDetail: React.FC = () => {
  // --- State and Hooks ---
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isLoading: authIsLoading } = useAuth();
  
  // Use our new local type for the state
  const [session, setSession] = useState<TPopulatedSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState<'404' | '403' | null>(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (!sessionId) {
      setErrorType('404');
      return;
    }

    const fetchSession = async () => {
      try {
        setIsLoading(true);
        setErrorType(null);
        
        const response = await sessionService.getSessionById(sessionId);
        setSession(response.data as any as TPopulatedSession);

      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 404) {
            setErrorType('404');
          } else {
            // Treat other errors (403, 500) as "Access Denied" for simplicity
            setErrorType('403');
          }
        } else {
          setErrorType('403');
        }
        console.error('Failed to fetch session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, navigate]);

const handleAddToCalendar = async () => {
    if (!session) {
      message.error('Session data not loaded yet.');
      return;
    }

    message.loading('Adding to your calendar...', 0);

    try {
      // Call our new service function
      const response = await calendarService.addSessionToCalendar(session._id);
      
      message.destroy(); // Remove loading message
      message.success(response.message); // Show success message from backend

    } catch (err: any) {
      message.destroy(); // Remove loading message
      let msg = 'Failed to add event.';
      if (err.response?.data?.message) {
        msg = err.response.data.message; // Show error from backend
      }
      message.error(msg);
    }
  };

  // --- Render Logic ---

  if (authIsLoading || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (errorType === '404') return <NotFound />;
  if (errorType === '403') return <AccessDenied />;
  if (!session) return <NotFound />; // Safety check

  // Check if the logged-in user is the host
  const isHost = currentUser?._id === session.host._id;

  // Check if the logged-in user is already an attendee
  const isAttending = session.attendees.some(
    (attendee) => attendee._id === currentUser?._id
  );

  return (
    <Row justify="center" style={{ padding: '24px 0' }}>
      <Col xs={24} md={22} lg={20} xl={18}>
        <Card style={{ width: '100%', borderRadius: '16px' }}>
          
          {/* --- Header: Title and Actions --- */}
          <Row justify="space-between" align="top" gutter={[16, 16]}>
            <Col>
              <Title level={2} style={{ marginBottom: 8 }}>
                {session.title}
              </Title>
              <StatusTag status={session.status} />
            </Col>
            <Col>
              <Space wrap>
                {isHost ? (
                  <Link to={`/sessions/${session._id}/edit`}>
                    <Button icon={<EditOutlined />}>Edit Session</Button>
                  </Link>
                ) : isAttending ? (
                  <Button type="default" disabled icon={<CheckCircleOutlined />}>
                    Attending
                  </Button>
                ) : (
                  <Button type="primary" icon={<CheckCircleOutlined />}>
                    Join Session
                  </Button>
                )}
                {!isHost && (
                  <Button icon={<CalendarOutlined />} onClick={handleAddToCalendar}>
                    Add to Calendar
                  </Button>
                )}
              </Space>
            </Col>
          </Row>

          <Divider />

          {/* --- Main Content: Details + Attendees --- */}
          <Row gutter={[32, 24]}>
            {/* Left Column: Details */}
            <Col xs={24} md={16}>
              <Title level={4}>Description</Title>
              <Paragraph>
                {session.description || 'No description provided.'}
              </Paragraph>

              <Title level={4} style={{ marginTop: 24 }}>Details</Title>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label={<Space><UserOutlined /> Host</Space>}>
                  <Link to={`/profile/${session.host._id}`}>
                    <Space>
                      <Avatar src={/* session.host.avatarUrl */ ''} icon={<UserOutlined />} />
                      {session.host.name}
                    </Space>
                  </Link>
                </Descriptions.Item>
                <Descriptions.Item label={<Space><CalendarOutlined /> Time</Space>}>
                  {new Date(session.startTime).toLocaleString()}
                  {session.endTime && ` - ${new Date(session.endTime).toLocaleString()}`}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><EnvironmentOutlined /> Location</Space>}>
                  {session.location || 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label={<Space>Genre</Space>}>
                  <Tag>{session.genre || 'Any'}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label={<Space><InfoCircleOutlined /> Skill Level</Space>}>
                  <Tag>{session.skillLevel}</Tag>
                </Descriptions.Item>
              </Descriptions>

              <Title level={4} style={{ marginTop: 24 }}>Instruments Needed</Title>
              <Space wrap size={[0, 8]}>
                {session.instrumentsNeeded.length > 0 ? (
                  session.instrumentsNeeded.map((inst) => (
                    <Tag key={inst} color="blue">{inst}</Tag>
                  ))
                ) : (
                  <Text type="secondary">All instruments welcome!</Text>
                )}
              </Space>
            </Col>

            {/* Right Column: Attendees */}
            <Col xs={24} md={8}>
              <Title level={4}>
                <TeamOutlined style={{ marginRight: 8 }} />
                Attendees ({session.attendees.length})
              </Title>
              <List
                dataSource={session.attendees}
                renderItem={(user) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={/* user.avatarUrl */ ''} icon={<UserOutlined />} />}
                      title={<Link to={`/profile/${user._id}`}>{user.name}</Link>}
                      description={user.profile.instruments.join(', ')}
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default SessionDetail;
