import React from "react";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";

const { Text } = Typography;

const INSTRUMENTS = [
  "Guitar",
  "Bass",
  "Drums",
  "Piano/Keys",
  "Vocals",
  "Violin",
  "Saxophone",
  "Trumpet",
];

const GENRES = [
  "Rock",
  "Jazz",
  "Pop",
  "Hip-Hop",
  "Classical",
  "Metal",
  "Blues",
  "EDM",
  "Country",
];

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;

function isUnderAgeLimit(date: Date, minYears = 13): boolean {
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - minYears);
  return date > cutoff;
}

const SignUpForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = () => {
    // Show AntD success message
    message.success("Account created successfully!");

    // Reset all form fields
    form.resetFields();
  };

  return (
    <Form
      layout="vertical"
      form={form}
      name="signup"
      onFinish={onFinish}
      onFinishFailed={() => {}}
      scrollToFirstError
      requiredMark="optional"
      initialValues={{ subscriptionTier: "basic" }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: "Please enter your name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="john@example.com" inputMode="email" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              {
                pattern: PASSWORD_RULE,
                message: "Min 8 chars, with upper, lower, number & symbol.",
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Create a strong password" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-enter password" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Date of Birth"
            name="dateOfBirth"
            rules={[{ required: true, message: "Please select your DOB" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(moment) =>
                moment ? isUnderAgeLimit(moment.toDate(), 13) : false
              }
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Subscription Tier"
            name="subscriptionTier"
            rules={[{ required: true, message: "Select a tier" }]}
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
            rules={[{ required: true, message: "Please select at least one instrument" }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select instruments"
              options={INSTRUMENTS.map((i) => ({ value: i, label: i }))}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Favorite Genres"
            name="genres"
            rules={[{ required: true, message: "Please select at least one genre" }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select genres"
              options={GENRES.map((g) => ({ value: g, label: g }))}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Skill Level"
            name="skillLevel"
            rules={[{ required: true, message: "Select your level" }]}
          >
            <Select
              placeholder="Choose one"
              options={[
                { value: "Beginner", label: "Beginner" },
                { value: "Intermediate", label: "Intermediate" },
                { value: "Advanced", label: "Advanced" },
              ]}
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
                    : Promise.reject(new Error("You must accept the Terms & Privacy")),
              },
            ]}
          >
            <Checkbox>
              I agree to the{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                Privacy Policy
              </a>
              .
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Space>
          <Button htmlType="button" onClick={() => form.resetFields()}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            Create Account
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;
