import React, { useState, useEffect, useCallback } from 'react';
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
  Modal,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  CheckOutlined
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

const StatusTag: React.FC<{ status: TSession['status'] }> = ({ status }) => {
  switch (status) {
    case 'Scheduled': return <Tag color="blue">{status}</Tag>;
    case 'Ongoing': return <Tag color="green">{status}</Tag>;
    case 'Finished': return <Tag color="default">{status}</Tag>;
    case 'Cancelled': return <Tag color="red">{status}</Tag>;
    default: return <Tag>{status}</Tag>;
  }
};

type TPopulatedSession = Omit<TSession, 'invitedUsers' | 'attendees' | 'host'> & {
  host: TUser;
  attendees: TUser[];
  invitedUsers: TUser[];
};

const SessionDetail: React.FC = () => {
  // --- State and Hooks ---
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isLoading: authIsLoading } = useAuth();
  
  const [session, setSession] = useState<TPopulatedSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState<'404' | '403' | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  
  // --- New Calendar States ---
  const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);
  const [calendarCheckLoading, setCalendarCheckLoading] = useState(false);

  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  // --- Data Fetching Effect ---
  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setErrorType('404');
      return;
    }
    
    // Only set loading true if we don't have data yet (prevents UI flash on refresh)
    setIsLoading(prev => !session ? true : prev);
    
    try {
      setErrorType(null);
      const response = await sessionService.getSessionById(sessionId);
      setSession(response.data as any as TPopulatedSession);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) setErrorType('404');
        else setErrorType('403');
      } else {
        setErrorType('403');
      }
      console.error('Failed to fetch session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]); 

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // --- Check Calendar Status ---
  useEffect(() => {
    const checkCalendarStatus = async () => {
      if (!session || !currentUser) return;
      
      setCalendarCheckLoading(true);

      try {
        const rawResponse = await calendarService.getCalendarEvents();
        
        // Handle wrapped vs raw array response
        const events = Array.isArray(rawResponse) ? rawResponse : (rawResponse.data || []);
        
        const sessionTime = new Date(session.startTime).getTime();
        const sessionTitle = session.title.trim().toLowerCase();

        const isAlreadyAdded = events.some((event: any) => {
          // Safety check: ensure event has start time
          const eventTimeStr = event.start?.dateTime || event.start?.date;
          if (!eventTimeStr) return false;

          const eventTime = new Date(eventTimeStr).getTime();
          const eventTitle = (event.summary || '').trim().toLowerCase();
          
          // Match Logic: 5 minute buffer (300,000ms) to account for slight drifts
          const timeDiff = Math.abs(eventTime - sessionTime);
          const isTimeMatch = timeDiff < 300000; 
          const isTitleMatch = eventTitle === sessionTitle;

          return isTitleMatch && isTimeMatch;
        });

        setIsAddedToCalendar(isAlreadyAdded);
      } catch (err) {
        console.error("Failed to check calendar status:", err);
        setIsAddedToCalendar(false);
      } finally {
        setCalendarCheckLoading(false);
      }
    };

    checkCalendarStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?._id, currentUser?._id]);

  // --- Button Handlers ---
  const handleJoinSession = () => {
    if (!currentUser || !session) return;
    
    modal.confirm({
      title: 'Join Session',
      content: 'Are you sure you want to join this session?',
      okText: 'Join Session',
      cancelText: 'Cancel',
      width: 400,
      onOk: async () => {
        setJoinLoading(true);
        try {
          await sessionService.addUserToSession(session._id, currentUser._id);
          messageApi.success("You've joined the session!");
          await fetchSession();
        } catch (err) {
          messageApi.error("Failed to join session. You may already be an attendee.");
        } finally {
          setJoinLoading(false);
        }
      },
    });
  };

  const handleLeaveSession = () => {
    if (!currentUser || !session) return;
    
    modal.confirm({
      title: 'Leave Session',
      content: 'Are you sure you want to leave this session?',
      okText: 'Leave Session',
      cancelText: 'Cancel',
      width: 400,
      onOk: async () => {
        setJoinLoading(true);
        try {
          await sessionService.removeUserFromSession(session._id, currentUser._id);
          messageApi.info("You've left the session.");
          await fetchSession();
        } catch (err) {
          messageApi.error("Failed to leave session.");
        } finally {
          setJoinLoading(false);
        }
      },
    });
  };

  const handleAddToCalendar = async () => {
    if (!session) return;

    // Optimistic UI Update
    setIsAddedToCalendar(true);
    messageApi.loading({ content: 'Adding to your calendar...', key: 'calAdd' }); 

    try {
      await calendarService.addSessionToCalendar(session._id);
      messageApi.success({ content: 'Added to Google Calendar!', key: 'calAdd' }); 
    } catch (err: any) {
      // Revert if failed
      setIsAddedToCalendar(false);
      
      let msg = 'Failed to add event.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }
      messageApi.error({ content: msg, key: 'calAdd' }); 
    }
  };

  // --- Render Logic ---

  if (authIsLoading || (!session && isLoading)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (errorType === '404') return <NotFound />;
  if (errorType === '403') return <AccessDenied />;
  if (!session) return <NotFound />; 

  const isHost = currentUser?._id === session.host?._id;
  
  const isAttending = session.attendees.some(
    (attendee) => attendee._id === currentUser?._id
  );

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
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
                    <Button
                      type="default"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={handleLeaveSession}
                      loading={joinLoading}
                    >
                      Leave Session
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={handleJoinSession}
                      loading={joinLoading}
                    >
                      Join Session
                    </Button>
                  )}
                  
                  {/* Calendar Button: Render if Host OR Attending */}
                  {(isHost || isAttending) && (
                    <Button 
                      icon={isAddedToCalendar ? <CheckOutlined /> : <CalendarOutlined />} 
                      onClick={handleAddToCalendar}
                      // Disable if added OR currently checking
                      disabled={isAddedToCalendar || calendarCheckLoading}
                      loading={calendarCheckLoading && !isAddedToCalendar} 
                    >
                      {calendarCheckLoading ? 'Checking...' : (isAddedToCalendar ? 'Added to Calendar' : 'Add to Calendar')}
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
                    {session.host ? (
                      <Link to={`/profile/${session.host._id}`}>
                        <Space>
                          <Avatar icon={<UserOutlined />} />
                          {session.host.name}
                        </Space>
                      </Link>
                    ) : (
                      <Text type="secondary">User not found</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label={<Space><CalendarOutlined /> Time</Space>}>
                    {new Date(session.startTime).toLocaleString()}
                    {session.endTime && ` - ${new Date(session.endTime).toLocaleString()}`}
                  </Descriptions.Item>
                  <Descriptions.Item label={<Space><EnvironmentOutlined /> Location</Space>}>
                    {session.location || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label={<Space><EnvironmentOutlined /> Address</Space>}>
                    {session.address || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label={<Space><CustomerServiceOutlined /> Genre</Space>}>
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
                        description={
                          <Link to={`/profile/${user._id}`}>
                            <Space>
                              <Avatar icon={<UserOutlined />} />
                              {user.name}
                            </Space>
                          </Link>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SessionDetail;