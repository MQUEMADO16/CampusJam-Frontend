import React, { useState, useEffect, useMemo } from 'react';
import {
  List,
  Spin,
  Typography,
  Alert,
  Empty,
  Button,
  Card,
  Row,
  Col,
  Input,
  Select,
  Radio,
  Space,
  Table,
  Tag,
} from 'antd';
import { isAxiosError } from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

// Import services, components, and constants
import { sessionService, TSessionFeed } from '../../services/session.service';
import SessionCard from '../../components/features/SessionCard';
import {
  INSTRUMENT_OPTIONS,
  GENRE_OPTIONS,
  SKILL_LEVEL_OPTIONS,
} from '../../constants/appData'; // Import constants for filters

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Define filter state shape
interface SessionFilters {
  search: string;
  genres: string[];
  instruments: string[];
  skills: string[];
}

/**
 * The main public sessions dashboard page.
 * Fetches all sessions and allows for client-side filtering
 * and switching between card and table views.
 */
const Dashboard: React.FC = () => {
  const [allSessions, setAllSessions] = useState<TSessionFeed[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<TSessionFeed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [filters, setFilters] = useState<SessionFilters>({
    search: '',
    genres: [],
    instruments: [],
    skills: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllSessions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await sessionService.getAllPublicSessions();
        setAllSessions(response.data);
        setFilteredSessions(response.data);
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        if (isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load sessions.');
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllSessions();
  }, []);

  useEffect(() => {
    let sessions = [...allSessions];
    const searchLower = filters.search.toLowerCase();

    if (filters.search) {
      sessions = sessions.filter(
        (session) =>
          session.title.toLowerCase().includes(searchLower) ||
          (session.description &&
            session.description.toLowerCase().includes(searchLower)) ||
          session.host.name.toLowerCase().includes(searchLower)
      );
    }

    if (filters.genres.length > 0) {
      sessions = sessions.filter(
        (session) =>
          session.genre && filters.genres.includes(session.genre)
      );
    }

    if (filters.instruments.length > 0) {
      sessions = sessions.filter((session) =>
        filters.instruments.every((inst) =>
          session.instrumentsNeeded.includes(inst)
        )
      );
    }

    if (filters.skills.length > 0) {
      sessions = sessions.filter(
        (session) =>
          session.skillLevel && filters.skills.includes(session.skillLevel)
      );
    }

    setFilteredSessions(sessions);
  }, [filters, allSessions]);

  const handleFilterChange = (
    key: keyof SessionFilters,
    value: string | string[]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      genres: [],
      instruments: [],
      skills: [],
    });
  };

  const tableColumns: ColumnsType<TSessionFeed> = [
    {
      title: 'Session',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, session) => (
        <Link to={`/sessions/${session._id}`}>
          <Text strong style={{ color: '#1677ff' }}>{title}</Text>
        </Link>
      ),
    },
    {
      title: 'Host',
      dataIndex: 'host',
      key: 'host',
      render: (host: TSessionFeed['host']) => (
        <Link to={`/profile/${host?._id}`}>{host?.name || 'N/A'}</Link>
      ),
      responsive: ['sm'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Scheduled') color = 'blue';
        if (status === 'Ongoing') color = 'green';
        if (status === 'Cancelled') color = 'red';
        return <Tag color={color}>{status || 'Scheduled'}</Tag>;
      },
    },
    {
      title: 'When',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime: string) => new Date(startTime).toLocaleString(),
      responsive: ['md'],
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      responsive: ['lg'],
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, session) => (
        <Link to={`/sessions/${session._id}`}>
          <Button type="link" size="small">View</Button>
        </Link>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  const customEmptyView = (
    <Empty
      description={
        <Title level={4} type="secondary">
          No jam sessions found.
        </Title>
      }
    >
      <Button type="primary" onClick={() => navigate('/sessions/create')}>
        Create a Session
      </Button>
    </Empty>
  );

  return (
    <Card style={{ borderRadius: '16px' }}>
      
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: '24px' }}
      >
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Public Jam Sessions
          </Title>
        </Col>
        <Col>
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <Radio.Button value="card">Card View</Radio.Button>
            <Radio.Button value="table">Table View</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      <Card style={{ marginBottom: '24px', border: 'none', boxShadow: 'none'}}>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Search
              placeholder="Search by title, host, or description"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Filter by genre"
              value={filters.genres}
              onChange={(value) => handleFilterChange('genres', value)}
              options={GENRE_OPTIONS}
            />
          </Col>
          <Col xs={12} md={5}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Filter by instruments"
              value={filters.instruments}
              onChange={(value) => handleFilterChange('instruments', value)}
              options={INSTRUMENT_OPTIONS}
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Filter by skill level"
              value={filters.skills}
              onChange={(value) => handleFilterChange('skills', value)}
              options={SKILL_LEVEL_OPTIONS}
            />
          </Col>
          <Col xs={12} md={3} style={{ textAlign: 'right' }}>
            <Button onClick={clearFilters}>Clear</Button>
          </Col>
        </Row>
      </Card>
      
      {viewMode === 'card' ? (
        <List
          dataSource={filteredSessions}
          grid={{
            gutter: 24,
            xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 4,
          }}
          locale={{ emptyText: customEmptyView }}
          renderItem={(session) => (
            <List.Item>
              <SessionCard session={session} />
            </List.Item>
          )}
        />
      ) : (
        <Table
          dataSource={filteredSessions}
          columns={tableColumns}
          rowKey="_id"
          locale={{ emptyText: customEmptyView }}
          pagination={{ pageSize: 10, showSizeChanger: false }}
        />
      )}
    </Card>
  );
};

export default Dashboard;