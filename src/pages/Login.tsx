import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { keyframes } from '@emotion/react'; // For animations

const { Title, Text } = Typography;

// Keyframe animation for the card
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Login: React.FC = () => {
  const [form] = Form.useForm();

  const handleFinish = async (values: any) => {
    try {
      const res = await axios.post("http://localhost:5000/api/login", values);
      console.log("Login success:", res.data);

      message.success("Login successful!");
      localStorage.setItem("token", res.data.token);

      window.location.href = "/sessions";
    } catch (err: any) {
      console.error("Login error:", err.response?.data || err.message);
      message.error(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // Enhanced background: subtle gradient for a modern feel
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        // Optional: Background image for more character
        // backgroundImage: 'url("https://source.unsplash.com/random/1920x1080/?campus,music")',
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
      }}
    >
      <Card
        style={{
          width: 400, // Slightly wider card
          borderRadius: 16, // More rounded corners
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)', // Stronger, softer shadow
          padding: '20px 30px', // More internal padding
          border: 'none', // Remove default border
          animation: `${fadeIn} 0.6s ease-out forwards`, // Apply fade-in animation
          overflow: 'hidden', // Ensures no content overflows rounded corners
        }}
        // Optionally, add a subtle border on hover for interactivity
        hoverable
      >
        <div style={{ textAlign: "center", marginBottom: 30 }}> {/* Increased margin-bottom */}
          {/* Using Ant Design's Title component for consistent styling */}
          <Title level={2} style={{ color: '#333', marginBottom: 8 }}>CampusJam Login</Title> {/* Slightly larger title */}
          <Text type="secondary" style={{ fontSize: '15px' }}> {/* Slightly larger text */}
            Sign in to continue to the jam.
          </Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label={<label style={{ fontWeight: 'bold', color: '#555' }}>Email</label>} // Bold label
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} // Subtle icon color
              placeholder="Your email address"
              size="large"
              style={{ borderRadius: 8 }} // Rounded input fields
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<label style={{ fontWeight: 'bold', color: '#555' }}>Password</label>} // Bold label
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} // Subtle icon color
              placeholder="Your password"
              size="large"
              style={{ borderRadius: 8 }} // Rounded input fields
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 20 }}> {/* Adjusted button margin */}
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              style={{
                borderRadius: 8, // Rounded button
                height: 45, // Taller button
                fontSize: '16px', // Larger font
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)', // Gradient button
                border: 'none',
                boxShadow: '0 4px 15px rgba(0, 118, 255, 0.3)', // Button shadow
              }}
            >
              Log In
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center", marginTop: 15 }}>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Don’t have an account? {' '}
              <a href="/signup" style={{ color: '#2575fc', fontWeight: 'bold' }}>Register Now</a> {/* Styled link */}
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
