import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message, Typography } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';

import { userService } from '../services/user.service';
import { TCreateUserData } from '../types';

const { Text } = Typography;

const SignUpForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles form submission, calls the user service, and manages responses.
   */
  const onFinish = async (values: any) => {
    setLoading(true);
    
    const userData: TCreateUserData = {
      name: values.name,
      email: values.email,
      dateOfBirth: values.dateOfBirth.toISOString(), // Send as ISO string
      password: values.password,
      campus: values.campus || undefined,
    };

    try {
      await userService.createUser(userData);

      message.success('Account created successfully! Please log in.');
      navigate('/login');

    } catch (error) {
      let errorMessage = 'Failed to create account.';
      if (isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your name', whitespace: true }]}
        >
          <Input placeholder="John Doe" size="large" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Enter a valid email address' },
          ]}
        >
          <Input placeholder="john@example.com" size="large" />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
          rules={[{ required: true, message: 'Please select your date of birth' }]}
        >
          {/* AntD DatePicker provides a moment object, .toISOString() converts it */}
          <DatePicker style={{ width: '100%' }} size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter a password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Create a strong password" size="large" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your password" size="large" />
        </Form.Item>

        <Form.Item
          name="campus"
          label="Campus (Optional)"
        >
          <Input placeholder="Your college or university" size="large" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Create Account
          </Button>
        </Form.Item>

        <Text type="secondary" style={{ textAlign: 'center', display: 'block' }}>
          Already have an account? <Link to="/login">Log In</Link>
        </Text>
      </Form>
    </>
  );
};

export default SignUpForm;