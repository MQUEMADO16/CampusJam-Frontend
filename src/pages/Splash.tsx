import React from "react";
import { Button, Row, Col, Typography, Space } from "antd";

const { Title, Text } = Typography;

const Splash: React.FC = () => {
  return (
    <div
      style={{
        backgroundImage:
          "url('https://images.stockcake.com/public/b/1/e/b1ea5d56-b8cc-44ea-8b9c-4a7c7f99d4f2_large/autumn-university-campus-stockcake.jpg')", // temp
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        position: "relative",
      }}
    >
      {/* dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1,
        }}
      />

      <Row justify="center" style={{ zIndex: 2 }}>
        <Col xs={22} sm={20} md={16} lg={12}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={1} style={{ color: "white", fontWeight: 700 }}>
              YOUR CAMPUS MUSIC SCENE, CONNECTED
            </Title>
            <Text
              style={{
                backgroundColor: "#b3005e",
                padding: "8px 16px",
                borderRadius: "6px",
                fontWeight: 500,
              }}
            >
              Find your sound. Connect with campus musicians.
            </Text>

            <Button
              type="primary"
              size="large"
              shape="round"
              style={{
                backgroundColor: "#b3005e",
                borderColor: "#b3005e",
                marginTop: 16,
              }}
            >
              Join Today →
            </Button>
          </Space>
        </Col>
      </Row>

      {/* footer bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: "#9b0059",
          padding: "8px 0",
          color: "white",
          fontWeight: 500,
          textAlign: "center",
          fontSize: "0.9rem",
        }}
      >
        “Bringing Students Together, One Jam at a Time.”
      </div>
    </div>
  );
};

export default Splash;