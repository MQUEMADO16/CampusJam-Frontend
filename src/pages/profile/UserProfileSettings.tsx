import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Divider,
  Row,
  Col,
  Spin,
  Space,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';

import { useAuth } from '../../context/auth.context';
import { userService } from '../../services/user.service';
import { TUser } from '../../types';

import AccessDenied from '../AccessDenied';

import { INSTRUMENT_OPTIONS, GENRE_OPTIONS, SKILL_LEVEL_OPTIONS } from '../../constants/appData';

const { Title, Text } = Typography;

type UpdateFormData = {
  name: string;
  email: string;
  bio: string;
  instruments: string[];
  genres: string[];
  skillLevel: TUser['profile']['skillLevel'];
};

const UserProfileSettings: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { 
    user: currentUser, 
    isLoading: authIsLoading, 
    token, 
    login 
  } = useAuth();
  
  const [isSaving, setIsSaving] = useState(false);

  // --- Handle Auth Loading State ---
  if (authIsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // --- Handle Access Denied ---
  if (!currentUser) {
    return <AccessDenied />;
  }

  // --- Handle Form Submission ---
  const onFinish = async (values: UpdateFormData) => {
    setIsSaving(true);
    try {
      const updateData = {
        name: values.name,
        email: values.email,
        profile: {
          bio: values.bio,
          instruments: values.instruments,
          genres: values.genres,
          skillLevel: values.skillLevel,
        },
      };

      const response = await userService.updateUser(currentUser._id, updateData);

      // --- Update Global Auth Context ---
      if (response.data.user && token) {
        login(response.data.user, token);
      }
      
      message.success('Profile updated successfully!');
      navigate(`/profile/${currentUser._id}`);

    } catch (error) {
      let msg = 'Failed to update profile.';
      if (isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      message.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Set Initial Values for the Form ---
  const initialFormValues = {
    name: currentUser.name,
    email: currentUser.email,
    bio: currentUser.profile.bio,
    instruments: currentUser.profile.instruments,
    genres: currentUser.profile.genres,
    skillLevel: currentUser.profile.skillLevel,
  };

  return (
    <Row justify="center" style={{ padding: '16px 0' }}>
      <Col xs={24} md={20} lg={16} xl={12}>
        <Card style={{ width: '100%', borderRadius: '16px' }}>
          <Title level={2}>Edit Your Profile</Title>
          <Text type="secondary">
            Update your account details and musician profile.
          </Text>
          <Divider />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialFormValues}
            requiredMark="optional"
          >
            <Title level={4} style={{ marginBottom: 16 }}>Account</Title>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Enter a valid email' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>Musician Profile</Title>
            <Form.Item 
              name="bio" 
              label="About Me (Bio)"
              style={{ marginBottom: 16 }}
            >
              <Input.TextArea rows={3} placeholder="Tell everyone a bit about yourself..." />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="instruments"
                  label="Instruments"
                  rules={[{ required: true, message: 'Select at least one' }]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Select instruments"
                    options={INSTRUMENT_OPTIONS}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="genres"
                  label="Favorite Genres"
                  rules={[{ required: true, message: 'Select at least one' }]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Select genres"
                    options={GENRE_OPTIONS}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="skillLevel"
              label="Skill Level"
              rules={[{ required: true, message: 'Select your level' }]}
              style={{ marginBottom: 8 }}
            >
              <Select
                placeholder="Choose one"
                options={SKILL_LEVEL_OPTIONS}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSaving}
                >
                  Save Changes
                </Button>
                <Button htmlType="button" onClick={() => navigate(-1)}>
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

export default UserProfileSettings;