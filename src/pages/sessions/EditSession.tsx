import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  DatePicker,
  Select,
  Switch,
  message,
  Space,
  Divider,
  Spin,
} from 'antd';
import { isAxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs'; // Ant Design 5 uses dayjs by default

import { sessionService } from '../../services/session.service';
import { TSession } from '../../types';
import { useAuth } from '../../context/auth.context';

// Import your global options
import {
  SKILL_LEVEL_OPTIONS,
  GENRE_OPTIONS,
  INSTRUMENT_OPTIONS,
} from '../../constants/appData';

import AccessDenied from '../AccessDenied'; // Ensure this path is correct
import NotFound from '../NotFound';         // Ensure this path is correct

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// --- Constants & Limits (Reused from CreateSession) ---
const CHAR_LIMS = {
  TITLE: 100,
  DESCRIPTION: 1000,
  LOCATION: 200,
} as const;

const checkMaxFieldLim = (fieldName: string, maxLength: number) => ({
  validator: (_: any, value: string) => {
    if (!value || value.length <= maxLength) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(`${fieldName} cannot exceed ${maxLength} characters`));
  },
});

// Define the shape of the form's values
type EditSessionFormValues = Pick<
  TSession,
  | 'title'
  | 'description'
  | 'location'
  | 'address'
  | 'genre'
  | 'skillLevel'
  | 'instrumentsNeeded'
  | 'isPublic'
  | 'status' // Added status here
> & {
  time: [dayjs.Dayjs, dayjs.Dayjs];
};

const EditSession: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [session, setSession] = useState<TSession | null>(null);
  const [errorType, setErrorType] = useState<'404' | '403' | null>(null);

  // --- 1. Fetch Session Data ---
  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;

      try {
        setIsLoading(true);
        const response = await sessionService.getSessionById(sessionId);
        const fetchedSession = response.data;

        // --- Security Check ---
        // If the current user is NOT the host, deny access.
        if (currentUser && fetchedSession.host._id !== currentUser._id) {
          setErrorType('403');
          return;
        }

        setSession(fetchedSession);

        // --- Populate Form ---
        form.setFieldsValue({
          title: fetchedSession.title,
          description: fetchedSession.description,
          location: fetchedSession.location,
          address: fetchedSession.address,
          genre: fetchedSession.genre,
          skillLevel: fetchedSession.skillLevel,
          instrumentsNeeded: fetchedSession.instrumentsNeeded,
          isPublic: fetchedSession.isPublic,
          status: fetchedSession.status, // Pre-fill status
          // Convert ISO strings to Dayjs objects for Ant Design RangePicker
          time: [
            dayjs(fetchedSession.startTime),
            dayjs(fetchedSession.endTime || fetchedSession.startTime), // Fallback if endTime is missing
          ],
        });

      } catch (error) {
        console.error('Failed to fetch session:', error);
        if (isAxiosError(error) && error.response?.status === 404) {
          setErrorType('404');
        } else {
          message.error('Failed to load session details.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      fetchSession();
    }
  }, [sessionId, currentUser, form]);

  // --- 2. Handle Form Submission ---
  const onFinish = async (values: EditSessionFormValues) => {
    if (!sessionId) return;
    setIsSaving(true);

    const payload = {
      ...values,
      startTime: values.time[0].toISOString(),
      endTime: values.time[1].toISOString(),
    };
    delete (payload as any).time;

    try {
      await sessionService.updateSession(sessionId, payload);
      message.success('Session updated successfully!');
      navigate(`/sessions/${sessionId}`);
    } catch (err) {
      console.error('Failed to update session:', err);
      let errorMsg = 'Failed to update session. Please try again.';
      if (isAxiosError(err)) {
        errorMsg = err.response?.data?.message || errorMsg;
      }
      message.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error('Please correct the errors in the form.');
  };

  // --- Render Logic ---

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (errorType === '403') return <AccessDenied />;
  if (errorType === '404' || !session) return <NotFound />;

  return (
    <Row justify="center" style={{ padding: '24px 0' }}>
      <Col xs={24} md={20} lg={16} xl={12}>
        <Card style={{ borderRadius: '16px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Edit Session
          </Title>
          <Form
            form={form}
            name="edit_session"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            requiredMark={false}
          >
            {/* --- Title --- */}
            <Form.Item
              name="title"
              label="Session Title"
              rules={[
                { required: true, message: 'Please enter a title for your session.' },
                checkMaxFieldLim("Title", CHAR_LIMS.TITLE),
              ]}
            >
              <Input 
                size="large" 
                maxLength={CHAR_LIMS.TITLE} 
              />
            </Form.Item>

            {/* --- Description --- */}
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: 'Please provide a brief description.' },
                checkMaxFieldLim("Description", CHAR_LIMS.DESCRIPTION),
              ]}
            >
              <TextArea 
                rows={4} 
                maxLength={CHAR_LIMS.DESCRIPTION} 
                showCount 
              />
            </Form.Item>

            {/* --- Location & Time --- */}
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="location"
                  label="Location Name"
                  rules={[
                    { required: true, message: 'Where is this happening?' },
                    checkMaxFieldLim("Location", CHAR_LIMS.LOCATION),
                  ]}
                >
                  <Input 
                    size="large" 
                    placeholder="e.g., Campus Quad or Room 201"
                    maxLength={CHAR_LIMS.LOCATION} 
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'Please enter an address.' }]}
                >
                  <Input size="large" placeholder="e.g., 1234 Campus Street" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={24}>
                <Form.Item
                  name="time"
                  label="Start & End Time"
                  rules={[{ required: true, message: 'Please select a start and end time.' }]}
                >
                  <DatePicker.RangePicker
                    showTime={{ format: 'h:mm a', use12Hours: true }}
                    format="MMM D, YYYY h:mm a"
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            
            {/* --- Details --- */}
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="genre"
                  label="Genre"
                  rules={[{ required: true, message: 'Please specify a genre.' }]}
                >
                  <Select
                    size="large"
                    options={GENRE_OPTIONS}
                    showSearch
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="skillLevel"
                  label="Skill Level"
                  rules={[{ required: true, message: 'Please select a skill level.' }]}
                >
                  <Select size="large" options={SKILL_LEVEL_OPTIONS} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="instrumentsNeeded"
              label="Instruments Needed (optional)"
            >
              <Select
                mode="tags"
                size="large"
                options={INSTRUMENT_OPTIONS}
              />
            </Form.Item>

            {/* --- Status & Visibility --- */}
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="status"
                  label="Session Status"
                  rules={[{ required: true, message: 'Status is required' }]}
                >
                  <Select size="large">
                    <Option value="Scheduled">Scheduled</Option>
                    <Option value="Ongoing">Ongoing</Option>
                    <Option value="Finished">Finished</Option>
                    <Option value="Cancelled">Cancelled</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="isPublic"
                  label="Session Visibility"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Public" unCheckedChildren="Private" />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSaving}
                  size="large"
                >
                  Save Changes
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate(`/sessions/${sessionId}`)}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default EditSession;