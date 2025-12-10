import React from 'react';
import { Modal, Typography, Button, Row, Col, Card } from 'antd';
import {
  PlusCircleOutlined,
  SearchOutlined,
  TeamOutlined,
  SmileOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="submit" type="primary" size="large" onClick={onClose} block>
          Let's Jam!
        </Button>,
      ]}
      centered
      width={600}
      styles={{ body: { padding: '20px 0' } }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <SmileOutlined style={{ fontSize: '48px', color: '#D10A50', marginBottom: '16px' }} />
        <Title level={2} style={{ margin: 0 }}>Welcome to CampusJam!</Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Connect with musicians on campus and start jamming.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card bordered={false} style={{ textAlign: 'center', background: '#fafafa', height: '100%' }}>
            <PlusCircleOutlined style={{ fontSize: '28px', color: '#1677ff', marginBottom: '12px' }} />
            <Title level={5}>Create</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              Host your own jam session.
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ textAlign: 'center', background: '#fafafa', height: '100%' }}>
            <SearchOutlined style={{ fontSize: '28px', color: '#52c41a', marginBottom: '12px' }} />
            <Title level={5}>Find</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              Browse upcoming sessions.
            </Text>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ textAlign: 'center', background: '#fafafa', height: '100%' }}>
            <TeamOutlined style={{ fontSize: '28px', color: '#722ed1', marginBottom: '12px' }} />
            <Title level={5}>Join</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              RSVP and sync to Google Calendar!
            </Text>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default WelcomeModal;