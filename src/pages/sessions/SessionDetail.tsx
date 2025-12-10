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
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined 
} from '@ant-design/icons';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import { sessionService } from '../../services/session.service';
import { calendarService } from '../../services/calendar.service';
import { useAuth } from '../../context/auth.context';
import { TSession, TUser } from '../../types';
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
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { user: currentUser, isLoading: authIsLoading } = useAuth();
  
  const [session, setSession] = useState<TPopulatedSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState<'404' | '403' | null>(null);
  
  const [joinLoading, setJoinLoading] = useState(false);
  const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);
  const [calendarCheckLoading, setCalendarCheckLoading] = useState(false);

  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();

  // --- Fetch Data ---
  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setErrorType('404');
      return;
    }
    setIsLoading(prev => !session ? true : prev);
    try {
      setErrorType(null);
      const response = await sessionService.getSessionById(sessionId);
      setSession(response.data as any as TPopulatedSession);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) setErrorType('404');
        else setErrorType('403');
      } else setErrorType('403');
      console.error('Failed to fetch session:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]); 

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // --- Check Calendar ---
  useEffect(() => {
    const checkCalendarStatus = async () => {
      if (!session || !currentUser) return;
      setCalendarCheckLoading(true);
      try {
        const rawResponse = await calendarService.getCalendarEvents();
        const events = Array.isArray(rawResponse) ? rawResponse : (rawResponse.data || []);
        
        const sessionTime = new Date(session.startTime).getTime();
        const sessionTitle = session.title.trim().toLowerCase();

        const isAlreadyAdded = events.some((event: any) => {
          const eventTimeStr = event.start?.dateTime || event.start?.date;
          if (!eventTimeStr) return false;
          const eventTime = new Date(eventTimeStr).getTime();
          const eventTitle = (event.summary || '').trim().toLowerCase();
          
          return (eventTitle === sessionTitle) && (Math.abs(eventTime - sessionTime) < 300000);
        });

        setIsAddedToCalendar(isAlreadyAdded);
      } catch (err) {
        setIsAddedToCalendar(false);
      } finally {
        setCalendarCheckLoading(false);
      }
    };
    checkCalendarStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?._id, currentUser?._id]);

  // --- Action Handlers ---
  const handleGoBack = () => navigate(-1);

  const handleJoinSession = () => {
    if (!currentUser || !session) return;
    modal.confirm({
      title: 'Join Session',
      content: 'Are you sure you want to join this session?',
      okText: 'Join',
      onOk: async () => {
        setJoinLoading(true);
        try {
          await sessionService.addUserToSession(session._id, currentUser._id);
          messageApi.success("You've joined the session!");
          await fetchSession();
        } catch (err) {
          messageApi.error("Failed to join session.");
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
      okText: 'Leave',
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

  const handleDeleteSession = () => {
    if (!session) return;
    modal.confirm({
      title: 'Delete Session',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this session? This action cannot be undone.',
      okText: 'Delete Session',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await sessionService.deleteSessionById(session._id);
          message.success('Session deleted.');
          navigate(-1); 
        } catch (error) {
          message.error('Failed to delete session.');
        }
      },
    });
  };

  const handleAddToCalendar = async () => {
    if (!session) return;
    setIsAddedToCalendar(true);
    messageApi.loading({ content: 'Adding to your calendar...', key: 'calAdd' }); 
    try {
      await calendarService.addSessionToCalendar(session._id);
      messageApi.success({ content: 'Added to Google Calendar!', key: 'calAdd' }); 
    } catch (err: any) {
      setIsAddedToCalendar(false);
      messageApi.error({ content: err.response?.data?.message || 'Failed to add event.', key: 'calAdd' }); 
    }
  };

  // --- Render Action Buttons ---
  const renderActionButtons = () => {
    const isHost = currentUser?._id === session?.host?._id;
    const isAttending = session?.attendees.some(u => u._id === currentUser?._id);

    const calendarButton = (
       <Button 
         key="calendar"
         icon={isAddedToCalendar ? <CheckOutlined /> : <CalendarOutlined />} 
         onClick={handleAddToCalendar}
         disabled={isAddedToCalendar || calendarCheckLoading}
         loading={calendarCheckLoading && !isAddedToCalendar} 
       >
         {calendarCheckLoading ? 'Checking...' : (isAddedToCalendar ? 'Added' : 'Add to Calendar')}
       </Button>
    );

    if (isHost) {
      return (
        <Space wrap>
          {/* Host Safe Actions */}
          <Link to={`/sessions/${session!._id}/edit`}>
            <Button icon={<EditOutlined />}>Edit Session</Button>
          </Link>
          {calendarButton}

          <Divider type="vertical" style={{ height: '24px', borderColor: '#d9d9d9' }} />

          {/* Host Destructive Action */}
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={handleDeleteSession}
          >
            Delete
          </Button>
        </Space>
      );
    }

    if (isAttending) {
      return (
        <Space wrap>
          {/* Attendee Safe Action */}
          {calendarButton}

          <Divider type="vertical" style={{ height: '24px', borderColor: '#d9d9d9' }} />

          {/* Attendee Destructive Action */}
          <Button
            danger
            icon={<MinusCircleOutlined />}
            onClick={handleLeaveSession}
            loading={joinLoading}
          >
            Leave Session
          </Button>
        </Space>
      );
    }

    // Default: Join Button
    return (
      <Button
        type="primary"
        icon={<CheckCircleOutlined />}
        onClick={handleJoinSession}
        loading={joinLoading}
      >
        Join Session
      </Button>
    );
  };

  // --- Main Render ---

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

  return (
    <>
      {modalContextHolder}
      {messageContextHolder}
      <Row justify="center" style={{ padding: '24px 0' }}>
        <Col xs={24} md={22} lg={20} xl={18}>
          <Card style={{ width: '100%', borderRadius: '16px' }}>
            
            <Row style={{ marginBottom: 16 }}>
              <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleGoBack} style={{ paddingLeft: 0 }}>
                Back
              </Button>
            </Row>

            <Row justify="space-between" align="top" gutter={[16, 16]}>
              <Col>
                <Title level={2} style={{ marginBottom: 8 }}>{session.title}</Title>
                <StatusTag status={session.status} />
              </Col>
              
              <Col>
                {renderActionButtons()}
              </Col>
            </Row>

            <Divider />

            <Row gutter={[32, 24]}>
              <Col xs={24} md={16}>
                <Title level={4}>Description</Title>
                <Paragraph>{session.description || 'No description provided.'}</Paragraph>

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
                    ) : <Text type="secondary">Unknown</Text>}
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
                  ) : <Text type="secondary">All instruments welcome!</Text>}
                </Space>
              </Col>
              
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