import React from 'react';
import { Card, Avatar, Typography, Button, Tag, Space } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TSessionFeed } from '../../services/session.service';

const { Text, Title } = Typography;

interface SessionCardProps {
  session: TSessionFeed;
}

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

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start', 
    gap: '8px',               
    width: '100%',
  };

  const iconStyle: React.CSSProperties = {
    marginTop: '4px',       
    color: 'rgba(0,0,0,0.45)',
    flexShrink: 0,          
    fontSize: '16px'
  };

  return (
    <Card
      hoverable
      style={{ 
        width: '100%', 
        borderRadius: '16px', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
      bodyStyle={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column' 
      }}
      actions={[
        <Link to={`/sessions/${_id}`}>
          <Button type="primary">View Session</Button>
        </Link>,
      ]}
    >
      <div style={{ flex: 1 }}> {/* Wraps content to ensure it spaces correctly */}
        <Card.Meta
          avatar={
            <Link to={`/profile/${host?._id}`}>
              <Avatar icon={<UserOutlined />} />
            </Link>
          }
          title={
            <Title level={5}>
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

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Date */}
          <div style={rowStyle}>
            <CalendarOutlined style={iconStyle} />
            <Text style={{ flex: 1, whiteSpace: 'nowrap' }}>
              {new Date(startTime).toLocaleDateString()}
            </Text>
          </div>

          {/* Location */}
          <div style={rowStyle}>
            <EnvironmentOutlined style={iconStyle} />
            <Text style={{ flex: 1 }}>
              {location || 'No location specified'}
            </Text>
          </div>

          {/* Genre */}
          <div style={rowStyle}>
            <CustomerServiceOutlined style={iconStyle} /> 
            <div style={{ flex: 1 }}>
              {genreList.length > 0 ? (
                <Space wrap size={[0, 8]}>
                  {genreList.map((g) => (
                    <Tag
                      key={g}
                      style={{
                        marginRight: 0,
                        backgroundColor: 'rgba(209, 10, 80, 0.1)', 
                        color: 'rgba(0, 0, 0, 0.88)',             
                        borderColor: '#D10A50',                    
                      }}
                    >
                      {g}
                    </Tag>
                  ))}
                </Space>
              ) : (
                <Tag>Any Genre</Tag>
              )}
            </div>
          </div>

          {/* Instruments Needed */}
          <div style={rowStyle}>
            <TeamOutlined style={iconStyle} />
            <div style={{ flex: 1 }}>
              {instrumentsNeeded.length > 0 ? (
                  <Space size={[0, 8]} wrap>
                    {instrumentsNeeded.map((instrument) => (
                      <Tag
                        key={instrument}
                        style={{
                          marginRight: 0,
                          backgroundColor: 'rgba(64, 37, 121, 0.1)', 
                          color: 'rgba(0, 0, 0, 0.88)',             
                          borderColor: '#402579',                    
                        }}
                      >
                        {instrument}
                      </Tag>
                    ))}
                  </Space>
                ) : (
                  <Text type="secondary">No specific instruments listed.</Text>
                )}
            </div>
          </div>

        </div>
      </div>
    </Card>
  );
};

export default SessionCard;