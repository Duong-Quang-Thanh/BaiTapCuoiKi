import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Tabs, Select, message, Spin, Table } from 'antd';
import axios from 'axios';

interface AdminStatisticsProps {
  data?: any;
}

const AdminStatistics: React.FC<AdminStatisticsProps> = ({ data: propsData }) => {
  const [statistics, setStatistics] = useState<any>(propsData || null);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);

  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    // If data is passed as prop, don't fetch
    if (propsData) {
      setStatistics(propsData);
      return;
    }
    fetchBatches();
    fetchStatistics();
  }, [selectedBatch, propsData]);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/batches`);
      setBatches(response.data);
    } catch (error) {
      message.error('Lỗi tải danh sách đợt');
    }
  };

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedBatch) {
        params.append('batch_id', selectedBatch.toString());
      }
      const response = await axios.get(`${API_URL}/admin/statistics?${params.toString()}`);
      setStatistics(response.data);
    } catch (error) {
      message.error('Lỗi tải thống kê');
    } finally {
      setLoading(false);
    }
  };

  const universityData = statistics
    ? Object.entries(statistics.applications_by_university || {}).map(([name, count]: any) => ({
        key: name,
        university: name,
        count
      }))
    : [];

  const majorData = statistics
    ? Object.entries(statistics.applications_by_major || {}).map(([name, count]: any) => ({
        key: name,
        major: name,
        count
      }))
    : [];

  const statusData = statistics ? [
    { key: 'pending', status: 'Chờ duyệt', count: statistics.pending_count },
    { key: 'approved', status: 'Được duyệt', count: statistics.approved_count },
    { key: 'rejected', status: 'Từ chối', count: statistics.rejected_count }
  ] : [];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Thống Kê Tuyển Sinh</h1>

      {/* Filter */}
      <Card style={{ marginBottom: '20px' }}>
        <Select
          placeholder="Chọn đợt xét tuyển"
          style={{ width: '300px' }}
          onChange={(value) => setSelectedBatch(value || null)}
          options={[
            { value: null, label: 'Tất cả đợt' },
            ...batches.map(batch => ({
              value: batch.id,
              label: batch.name
            }))
          ]}
        />
      </Card>

      <Spin spinning={loading}>
        {statistics && (
          <>
            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: '30px' }}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Tổng hồ sơ"
                    value={statistics.total_applications}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Chờ duyệt"
                    value={statistics.pending_count}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Được duyệt"
                    value={statistics.approved_count}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Từ chối"
                    value={statistics.rejected_count}
                    valueStyle={{ color: '#f5222d' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Tables */}
            <Tabs
              items={[
                {
                  key: 'status',
                  label: 'Thống kê trạng thái',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          {
                            title: 'Trạng thái',
                            dataIndex: 'status',
                            key: 'status'
                          },
                          {
                            title: 'Số lượng hồ sơ',
                            dataIndex: 'count',
                            key: 'count'
                          }
                        ]}
                        dataSource={statusData}
                        pagination={false}
                      />
                    </Card>
                  )
                },
                {
                  key: 'university',
                  label: 'Hồ sơ theo trường',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          {
                            title: 'Trường',
                            dataIndex: 'university',
                            key: 'university'
                          },
                          {
                            title: 'Số lượng hồ sơ',
                            dataIndex: 'count',
                            key: 'count'
                          }
                        ]}
                        dataSource={universityData}
                        pagination={false}
                      />
                    </Card>
                  )
                },
                {
                  key: 'major',
                  label: 'Hồ sơ theo ngành',
                  children: (
                    <Card>
                      <Table
                        columns={[
                          {
                            title: 'Ngành',
                            dataIndex: 'major',
                            key: 'major'
                          },
                          {
                            title: 'Số lượng hồ sơ',
                            dataIndex: 'count',
                            key: 'count'
                          }
                        ]}
                        dataSource={majorData}
                        pagination={false}
                      />
                    </Card>
                  )
                }
              ]}
            />
          </>
        )}
      </Spin>
    </div>
  );
};

export default AdminStatistics;