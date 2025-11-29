import React, { useState } from 'react';
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
} from 'antd';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

import { sessionService } from '../../services/session.service';
import { TSession } from '../../types';
import { useAuth } from '../../context/auth.context';

import {
  SKILL_LEVEL_OPTIONS,
  GENRE_OPTIONS,
  INSTRUMENT_OPTIONS,
} from '../../constants/appData'

const { Title } = Typography;
const { TextArea } = Input;

// Define the shape of the form's values
type CreateSessionFormValues = Pick<
  TSession,
  | 'title'
  | 'description'
  | 'location'
  | 'address'    
  | 'genre'
  | 'skillLevel'
  | 'instrumentsNeeded'
  | 'isPublic'
> & {
  time: [any, any]; 
};

const CreateSession: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const onFinish = async (values: CreateSessionFormValues) => {
    if (!currentUser) {
      message.error('You must be logged in to create a session.');
      return;
    }

    setIsLoading(true);
    
    const payload = {
      ...values,
      startTime: values.time[0].toISOString(),
      endTime: values.time[1].toISOString(),
      host: currentUser,
    };
    delete (payload as any).time;

    try {
      const response = await sessionService.createSession(payload);
      
      message.success('Jam session created successfully!');
      
      navigate(`/sessions/${response.data.session._id}`);

    } catch (err) {
      console.error('Failed to create session:', err);
      let errorMsg = 'Failed to create session. Please try again.';
      if (isAxiosError(err)) {
        errorMsg = err.response?.data?.message || errorMsg;
      }
      message.error(errorMsg);
      setIsLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Form validation failed:', errorInfo);
    message.error('Please correct the errors in the form.');
  };

  return (
    <Row justify="center" style={{ padding: '24px 0' }}>
      <Col xs={24} md={20} lg={16} xl={12}>
        <Card style={{ borderRadius: '16px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Create a New Jam Session
          </Title>
          <Form
            form={form}
            name="create_session"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            requiredMark={false}
          >
            <Form.Item
              name="title"
              label="Session Title"
              rules={[{ required: true, message: 'Please enter a title for your session.' }]}
            >
              <Input size="large" placeholder="e.g., Acoustic Study Break" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please provide a brief description.' }]}
            >
              <TextArea rows={4} placeholder="What's the vibe? What songs are you playing?" />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="location"
                  label="Location"
                  rules={[{ required: true, message: 'Where is this happening?' }]}
                >
                  <Input size="large" placeholder="e.g., Campus Quad or Room 201" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'What?' }]}
                >
                  <Input size="large" placeholder="e.g., 1234 Campus Street, City, State USA" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
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
            
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="genre"
                  label="Genre"
                  rules={[{ required: true, message: 'Please specify a genre.' }]}
                >
                  {/* --- CHANGED --- */}
                  <Select
                    size="large"
                    placeholder="e.g., Indie, Jazz, Hip-Hop"
                    options={GENRE_OPTIONS}
                    showSearch
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="skillLevel"
                  label="Skill Level"
                  initialValue="Beginner"
                  rules={[{ required: true, message: 'Please select a skill level.' }]}
                >
                  {/* --- CHANGED --- */}
                  <Select size="large" options={SKILL_LEVEL_OPTIONS} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="instrumentsNeeded"
              label="Instruments Needed (optional)"
              tooltip="Select from the list or type your own and press Enter."
            >
              {/* --- CHANGED --- */}
              <Select
                mode="tags"
                size="large"
                placeholder="e.g., Drums, Bass Guitar, Vocals"
                tokenSeparators={[',']}
                options={INSTRUMENT_OPTIONS}
              />
            </Form.Item>

            <Form.Item
              name="isPublic"
              label="Session Visibility"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch checkedChildren="Public" unCheckedChildren="Private" />
            </Form.Item>

            <Divider />

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  size="large"
                >
                  Create Session
                </Button>
                <Button
                  size="large"
                  onClick={() => navigate(-1)}
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

export default CreateSession;