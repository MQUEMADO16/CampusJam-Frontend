import React from "react";
import { Card, Col, Row, Typography, Divider } from "antd";
import SignUpForm from "../components/features/SignUpForm";

const { Title, Text } = Typography;

const SignUp: React.FC = () => {
  return (
    <Row justify="center" style={{ padding: "32px 16px" }}>
      <Col xs={24} sm={22} md={18} lg={16} xl={12} xxl={10}>
        <Card>
          <Title level={2} style={{ marginBottom: 0 }}>
            Create your account
          </Title>
          <Text type="secondary">
            Join CampusJam to create and discover jam sessions.
          </Text>

          <Divider />
          <SignUpForm />
        </Card>
      </Col>
    </Row>
  );
};

export default SignUp;
