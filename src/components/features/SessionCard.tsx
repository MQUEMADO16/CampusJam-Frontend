import React from 'react';
import { Card, Avatar, Typography, Button, Tag, Space } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TSessionFeed } from '../../services/session.service';

const { Text, Title } = Typography;

interface SessionCardProps {
  session: TSessionFeed;
}

/**
 * A reusable card component to display a summary of a single jam session.
 * It's a "dumb" component that just receives a session object and displays it.
 */
const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const {
    _id,
    title,
    host,
    startTime,
    location,
    genre,
    instrumentsNeeded,
  } = session;

  const genreList = genre ? genre.split(',').map(g => g.trim()) : [];

  return (
    <Card
      hoverable
      style={{ width: '100%', borderRadius: '16px' }}
      actions={[
        <Link to={`/sessions/${_id}`}>
          <Button type="primary">View Session</Button>
        </Link>,
      ]}
    >
      <Card.Meta
        avatar={
          <Link to={`/profile/${host?._id}`}>
            <Avatar icon={<UserOutlined />} />
          </Link>
        }
        title={
          <Title level={5} ellipsis>
            <Link to={`/sessions/${_id}`} style={{ color: 'inherit' }}>
              {title}
            </Link>
          </Title>
        }
        description={
          <Text type="secondary">
            Hosted by <Link to={`/profile/${host?._id}`}>{host?.name || 'Unknown User'}</Link>
          </Text>
        }
      />

      <div style={{ marginTop: '20px', minHeight: '120px' }}>
        {/* Date */}
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <CalendarOutlined />
            <Text>{new Date(startTime).toLocaleDateString()}</Text>
          </Space>

          {/* Location */}
          <Space>
            <EnvironmentOutlined />
            <Text ellipsis>{location || 'No location specified'}</Text>
          </Space>

          {/* Genre */}
          <Space>
            <CustomerServiceOutlined />
            {genreList.length > 0 ? (
              <Space wrap size={[0, 8]}>
                {genreList.map((g) => (
                  <Tag
                    key={g}
                    style={{
                      backgroundColor: 'rgba(209, 10, 80, 0.1)', // 10% Pink background
                      color: 'rgba(0, 0, 0, 0.88)',             // Default dark text
                      borderColor: '#D10A50',                    // Solid Pink border
                    }}
                  >
                    {g}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Tag
                style={{
                  backgroundColor: 'rgba(209, 10, 80, 0.1)',
                  color: 'rgba(0, 0, 0, 0.88)',
                  borderColor: '#D10A50',
                }}
              >
                Any Genre
              </Tag>
            )}
          </Space>

          {/* Instruments Needed */}
          <div>
            <Text strong>Needs: </Text>
            <Space size={[0, 8]} wrap style={{ marginTop: '8px' }}>
              {instrumentsNeeded.length > 0 ? (
                instrumentsNeeded.map((instrument) => (
                  <Tag
                    key={instrument}
                    style={{
                      backgroundColor: 'rgba(64, 37, 121, 0.1)', // 10% Purple background
                      color: 'rgba(0, 0, 0, 0.88)',             // Default dark text
                      borderColor: '#402579',                    // Solid Purple border
                    }}
                  >
                    {instrument}
                  </Tag>
                ))
              ) : (
                <Text type="secondary" style={{marginLeft: '5px'}}>No specific instruments listed.</Text>
              )}
            </Space>
          </div>
        </Space>
      </div>
    </Card>
  );
};

export default SessionCard;
