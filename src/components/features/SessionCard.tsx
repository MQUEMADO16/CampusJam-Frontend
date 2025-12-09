import React from 'react';
import { Card, Typography, Button, Tag, Space } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CustomerServiceOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TSessionFeed } from '../../services/session.service';

const { Text, Title } = Typography;

interface SessionCardProps {
  session: TSessionFeed;
}

const styles = {
  card: {
    width: '100%',
    borderRadius: '16px',
    border: '1px solid #f0f0f0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    position: 'relative' as const, 
  },
  body: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    gap: '24px',
  },
  statusTag: {
    position: 'absolute' as const,
    top: '24px',
    right: '24px',
    margin: 0,
    border: 'none',
    zIndex: 10,
  },
  headerGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    // Large padding right so the text never overlaps the absolute positioned Status tag
    paddingRight: '80px', 
  },
  titleLink: {
    color: 'inherit',
    display: 'block',
    textDecoration: 'none',
  },
  hostRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '4px',
  },
  sectionLabel: {
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    color: '#8c8c8c',
  },
  infoText: {
    fontSize: '0.95rem',
    lineHeight: 1.5,
    display: 'block',
    whiteSpace: 'normal' as const, // Ensures text wraps and shows everything
  },
  tagGroup: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
  },
  button: {
    borderRadius: '8px',
    fontWeight: 600,
    height: '42px',
    background: 'linear-gradient(to right, #D10A50, #402579)',
    border: 'none',
    marginTop: 'auto',
  },
};

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const {
    _id,
    title,
    host,
    startTime,
    location,
    genre,
    instrumentsNeeded,
    status,
  } = session;

  const genreList = genre ? genre.split(',').map((g) => g.trim()) : [];

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Scheduled': return 'blue';
      case 'Ongoing': return 'green';
      case 'Finished': return 'default';
      case 'Cancelled': return 'red';
      default: return 'blue';
    }
  };

  return (
    <Card hoverable style={styles.card} bodyStyle={styles.body}>
      
      {/* --- STATUS TAG (Absolute) --- */}
      <Tag color={getStatusColor(status || 'Scheduled')} style={styles.statusTag}>
        {status || 'Scheduled'}
      </Tag>

      {/* --- HEADER GROUP --- */}
      <div style={styles.headerGroup}>
        {/* Title: No shortening, full wrap allowed */}
        <Link to={`/sessions/${_id}`} style={styles.titleLink}>
            <Title 
              level={4} 
              style={{ 
                margin: 0, 
                fontWeight: 700, 
                lineHeight: 1.3,
                wordWrap: 'break-word',
                whiteSpace: 'normal'
              }}
            >
              {title}
            </Title>
        </Link>

        {/* Host Name */}
        <div style={styles.hostRow}>
          <Text type="secondary" style={{ fontSize: '0.9rem' }}>
            <UserOutlined style={{ marginRight: '6px' }} />
            Hosted by <Link to={`/profile/${host?._id}`} style={{ color: 'inherit', fontWeight: 600 }}>{host?.name || 'Unknown'}</Link>
          </Text>
        </div>
      </div>

      {/* --- INFO: Date & Location --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Date */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ width: '24px', display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
            <CalendarOutlined style={{ color: '#D10A50', fontSize: '18px' }} />
          </div>
          <div>
            <Text style={styles.sectionLabel}>Date</Text>
            <Text strong style={styles.infoText}>
              {new Date(startTime).toLocaleDateString(undefined, { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </div>
        </div>

        {/* Location - Full text allowed */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ width: '24px', display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
             <EnvironmentOutlined style={{ color: '#402579', fontSize: '18px' }} />
          </div>
          <div>
            <Text style={styles.sectionLabel}>Location</Text>
            <Text strong style={styles.infoText}>
              {location || 'To Be Determined'}
            </Text>
          </div>
        </div>
      </div>

      {/* --- TAGS SECTION --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
        {/* Genres */}
        <div>
          <Space size={8} align="center" style={{ marginBottom: '8px' }}>
            <CustomerServiceOutlined style={{ color: '#8c8c8c' }} />
            <Text type="secondary" style={{ fontSize: '0.85rem' }}>Genres</Text>
          </Space>
          <div style={styles.tagGroup}>
            {genreList.length > 0 ? (
              genreList.map((g) => (
                <Tag key={g} bordered={false} color="magenta" style={{ borderRadius: '12px', margin: 0 }}>
                  {g}
                </Tag>
              ))
            ) : (
              <Tag bordered={false} style={{ margin: 0 }}>Any Genre</Tag>
            )}
          </div>
        </div>

        {/* Instruments */}
        <div>
          <Space size={8} align="center" style={{ marginBottom: '8px' }}>
            <SoundOutlined style={{ color: '#8c8c8c' }} />
            <Text type="secondary" style={{ fontSize: '0.85rem' }}>Looking For</Text>
          </Space>
          <div style={styles.tagGroup}>
            {instrumentsNeeded.length > 0 ? (
              instrumentsNeeded.map((inst) => (
                <Tag key={inst} bordered={false} color="purple" style={{ borderRadius: '12px', margin: 0 }}>
                  {inst}
                </Tag>
              ))
            ) : (
              <Tag bordered={false} style={{ margin: 0 }}>Open Jam</Tag>
            )}
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTON --- */}
      <Link to={`/sessions/${_id}`} style={{ display: 'block', marginTop: '12px' }}>
        <Button type="primary" block size="large" style={styles.button}>
          View Session
        </Button>
      </Link>
    </Card>
  );
};

export default SessionCard;