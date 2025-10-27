import React from "react";
import { Card, Col, Row, Typography, Divider } from "antd";

const { Title, Text } = Typography;

const Splash: React.FC = () => {
  return (
    <Row justify="center" style={{ padding: "32px 16px" }}>
      <Col xs={24} sm={22} md={18} lg={16} xl={12} xxl={10}>
        <Card>
          <Title level={2} style={{ marginBottom: 0 }}>
            Welcome to CampusJam!
          </Title>
          <Text type="secondary">
            Discover, create, and join jam sessions with students across campus.
          </Text>

          <Divider />

          <Text>
            Dive into the rhythm of collaboration. Explore music, meet new
            people, and start your next jam today!
          </Text>
        </Card>
      </Col>
    </Row>
  );
};

export default Splash;