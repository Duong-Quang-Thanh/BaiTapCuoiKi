import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Tag, Modal, Drawer, Form, Select, Input, message, Space, Statistic, Row, Col, Tabs } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<any>({});
  const [statistics, setStatistics] = useState<any>(null);

  const API_URL = 'http://localhost:8000';

  const statusMap: any = {
    pending: { color: 'blue', text: 'Chờ duyệt' },
    approved: { color: 'green', text: 'Được duyệt' },
    rejected: { color: 'red', text: 'Từ chối' }
  };

  // Fetch applications
  useEffect(() => {
    fetchApplications();
    fetchStatistics();
  }, [filters]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.batch_id) params.append('batch_id', filters.batch_id);
      if (filters.university_id) params.append('university_id', filters.university_id);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(`${API_URL}/admin/applications?${params.toString()}`);
      setApplications(response.data);
    } catch (error) {
      message.error('Lỗi tải danh sách hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/statistics`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Lỗi tải thống kê');
    }
  };

  // Handle view detail
  const handleViewDetail = async (app: any) => {
    try {
      const response = await axios.get(`${API_URL}/admin/applications/${app.id}`);
      setSelectedApp(response.data);
      setShowDrawer(true);
      form.setFieldsValue({
        status: response.data.status,
        note: response.data.note
      });
    } catch (error) {
      message.error('Lỗi tải chi tiết hồ sơ');
    }
  };

  // Handle update application
  const handleUpdateApplication = async (values: any) => {
    try {
      await axios.patch(`${API_URL}/admin/applications/${selectedApp.id}/status`, {
        status: values.status,
        note: values.note
      });
      message.success('Cập nhật hồ sơ thành công');
      setShowDrawer(false);
      fetchApplications();
      fetchStatistics();
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Lỗi cập nhật hồ sơ');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60
    },
    {
      title: 'Học sinh',
      key: 'user_name',
      render: (_: any, record: any) => (
        <div>
          <div>{record.user_name}</div>
          <small>{record.user_email}</small>
        </div>
      )
    },
    {
      title: 'Trường',
      dataIndex: 'university_name',
      key: 'university_name'
    },
    {
      title: 'Ngành',
      dataIndex: 'major_name',
      key: 'major_name'
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => score.toFixed(1)
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusMap[status]?.color || 'default'}>
          {statusMap[status]?.text || status}
        </Tag>
      ),
      filters: [
        { text: 'Chờ duyệt', value: 'pending' },
        { text: 'Được duyệt', value: 'approved' },
        { text: 'Từ chối', value: 'rejected' }
      ],
      onFilter: (value: any) => setFilters({ ...filters, status: value })
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Quản Lý Hồ Sơ Tuyển Sinh</h1>

      {/* Statistics */}
      {statistics && (
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
      )}

      {/* Applications Table */}
      <Card title="Danh sách hồ sơ">
        <Table
          columns={columns}
          dataSource={applications}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title="Chi tiết hồ sơ"
        placement="right"
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        width={600}
      >
        {selectedApp && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateApplication}
          >
            <h3>Thông tin chung</h3>
            <Form.Item label="Học sinh">
              <Input value={selectedApp.user_name} disabled />
            </Form.Item>
            <Form.Item label="Email">
              <Input value={selectedApp.user_email} disabled />
            </Form.Item>
            <Form.Item label="Điện thoại">
              <Input value={selectedApp.user_phone} disabled />
            </Form.Item>
            <Form.Item label="Trường">
              <Input value={selectedApp.university_name} disabled />
            </Form.Item>
            <Form.Item label="Ngành">
              <Input value={selectedApp.major_name} disabled />
            </Form.Item>
            <Form.Item label="Điểm">
              <Input value={selectedApp.score.toFixed(1)} disabled />
            </Form.Item>
            <Form.Item label="Đợt xét tuyển">
              <Input value={selectedApp.batch_name} disabled />
            </Form.Item>

            <h3>Xử lý hồ sơ</h3>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select
                placeholder="Chọn trạng thái"
                options={[
                  { value: 'pending', label: 'Chờ duyệt' },
                  { value: 'approved', label: 'Được duyệt' },
                  { value: 'rejected', label: 'Từ chối' }
                ]}
              />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={3} placeholder="Ghi chú khi duyệt/từ chối" />
            </Form.Item>

            <h3>Tài liệu đính kèm ({selectedApp.documents?.length || 0})</h3>
            {selectedApp.documents && selectedApp.documents.length > 0 ? (
              <ul>
                {selectedApp.documents.map((doc: any) => (
                  <li key={doc.id}>
                    {doc.document_type}: {doc.file_name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có tài liệu</p>
            )}

            <Space style={{ marginTop: '20px' }}>
              <Button onClick={() => setShowDrawer(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu thay đổi
              </Button>
            </Space>
          </Form>
        )}
      </Drawer>
    </div>
  );
};

export default AdminApplications;
