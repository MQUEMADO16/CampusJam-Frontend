import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  message,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { userService } from '../../services/user.service';
import { TCreateUserData } from '../../types';
import moment, { Moment } from 'moment';

import {
  INSTRUMENT_OPTIONS,
  GENRE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
} from '../../constants/appData';

import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';

interface MuiDatePickerWrapperProps {
  value?: Moment;
  onChange?: (value: Moment | null) => void;
  shouldDisableDate: (date: Dayjs) => boolean;
}

const AntdMuiDatePicker: React.FC<MuiDatePickerWrapperProps> = ({
  value,
  onChange,
  shouldDisableDate,
}) => {
  const dayjsValue = value ? dayjs(value.toDate()) : null;

  const handleChange = (newValue: Dayjs | null) => {
    if (onChange) {
      onChange(newValue ? moment(newValue.toDate()) : null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        label="Date of Birth"
        value={dayjsValue}
        onChange={handleChange}
        shouldDisableDate={shouldDisableDate}
        views={['year', 'month', 'day']}
        openTo="year"
        slotProps={{
          textField: {
            fullWidth: true,
            variant: 'outlined',
            size: 'small', // This (40px) matches antd size="large"
          },
          popper: {
            style: { zIndex: 9999 },
          },
        }}
      />
    </LocalizationProvider>
  );
};

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

function isUnderAgeLimit(date: Date, minYears = 13): boolean {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - minYears);
  return date > cutoff;
}

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  dateOfBirth: Moment;
  subscriptionTier: 'basic' | 'pro';
  instruments: string[];
  genres: string[];
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  acceptTerms: boolean;
}

const SignUpForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: SignUpFormValues) => {
    setLoading(true);

    const userData: TCreateUserData = {
      name: values.name,
      email: values.email,
      password: values.password,
      dateOfBirth: values.dateOfBirth.toISOString(),
      subscription: {
        tier: values.subscriptionTier,
      },
      profile: {
        instruments: values.instruments,
        genres: values.genres,
        skillLevel: values.skillLevel,
      },
    };

    try {
      form.setFields([{ name: 'email', errors: [] }]);

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

      const isDuplicateEmail =
        errorMessage.toLowerCase().includes('user already exists') ||
        errorMessage.toLowerCase().includes('email already in use');

      if (isDuplicateEmail) {
        form.setFields([
          {
            name: 'email',
            errors: ['This email is already registered. Please log in or use a different email.'],
          },
        ]);
      } else {
        message.error(errorMessage);
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      form={form}
      name="signup"
      onFinish={onFinish}
      onFinishFailed={() => {
        message.error('Please correct the errors in the form.');
      }}
      scrollToFirstError
      requiredMark="optional"
      initialValues={{ subscriptionTier: 'basic' }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input placeholder="John Doe" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input placeholder="john@example.com" inputMode="email" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              {
                pattern: PASSWORD_RULE,
                message: 'Min 8 chars, with upper, lower, number & symbol.',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Create a strong password" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-enter password" size="large" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="dateOfBirth"
            rules={[{ required: true, message: 'Please select your DOB' }]}
            style={{ marginTop: '8px' }}
          >
            <AntdMuiDatePicker
              shouldDisableDate={(dayjsObj) =>
                dayjsObj ? isUnderAgeLimit(dayjsObj.toDate(), 13) : false
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Subscription Tier"
            name="subscriptionTier"
            rules={[{ required: true, message: 'Select a tier' }]}
          >
            <Radio.Group>
              <Radio.Button value="basic">Basic</Radio.Button>
              <Radio.Button value="premium">Premium</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Primary Instruments"
            name="instruments"
            rules={[{ required: true, message: 'Please select at least one instrument' }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select instruments"
              options={INSTRUMENT_OPTIONS}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Favorite Genres"
            name="genres"
            rules={[{ required: true, message: 'Please select at least one genre' }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select genres"
              options={GENRE_OPTIONS}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Skill Level"
            name="skillLevel"
            rules={[{ required: true, message: 'Select your level' }]}
          >
            <Select
              placeholder="Choose one"
              options={SKILL_LEVEL_OPTIONS}
              size="large"
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="acceptTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, v) =>
                  v
                    ? Promise.resolve()
                    : Promise.reject(new Error('You must accept the Terms & Privacy')),
              },
            ]}
          >
            <Checkbox>
              I agree to the{' '}
              <a href="/terms" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
              .
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                Create Account
              </Button>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                Reset
              </Button>
            </Space>
          </Col>
          <Col>
            <Button
              htmlType="button"
              danger
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;