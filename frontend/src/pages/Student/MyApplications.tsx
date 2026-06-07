import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Tag, Modal, List, Spin, message, Row, Col, Statistic } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [userId] = useState(1); // Get from auth context in real app

  const API_URL = 'http://localhost:8000';

  const statusMap: any = {
    pending: { color: 'blue', text: 'Chờ duyệt' },
    approved: { color: 'green', text: 'Được duyệt' },
    rejected: { color: 'red', text: 'Từ chối' }
  };

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/applications/user/${userId}`);
        setApplications(response.data);
      } catch (error) {
        message.error('Lỗi tải hồ sơ');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [userId]);

  // Handle view detail
  const handleViewDetail = async (application: any) => {
    try {
      const response = await axios.get(`${API_URL}/admin/applications/${application.id}`);
      setSelectedApp(response.data);
      setShowDetailModal(true);
    } catch (error) {
      message.error('Lỗi tải chi tiết hồ sơ');
    }
  };

  // Handle download document
  const handleDownloadDocument = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `${API_URL}/uploads/${filePath}`;
    link.download = fileName;
    link.click();
  };

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  const columns = [
    {
      title: 'Mã hồ sơ',
      dataIndex: 'id',
      key: 'id',
      width: 80
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
      width: 70,
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
      )
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submitted_date',
      key: 'submitted_date',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleViewDetail(record)}>
          Xem chi tiết
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Hồ Sơ Của Tôi</h1>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng hồ sơ"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Được duyệt"
              value={stats.approved}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Applications Table */}
      <Card title="Danh sách hồ sơ">
        <Table
          columns={columns}
          dataSource={applications}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết hồ sơ"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedApp && (
          <div>
            <h3>Thông tin chung</h3>
            <Table
              dataSource={[
                { key: 'email', label: 'Email', value: selectedApp.user_email },
                { key: 'phone', label: 'Điện thoại', value: selectedApp.user_phone },
                { key: 'batch', label: 'Đợt tuyển sinh', value: selectedApp.batch_name },
                { key: 'university', label: 'Trường', value: selectedApp.university_name },
                { key: 'major', label: 'Ngành', value: selectedApp.major_name },
                { key: 'score', label: 'Điểm', value: selectedApp.score.toFixed(1) },
                {
                  key: 'status',
                  label: 'Trạng thái',
                  value: (
                    <Tag color={statusMap[selectedApp.status]?.color}>
                      {statusMap[selectedApp.status]?.text}
                    </Tag>
                  )
                },
                { key: 'note', label: 'Ghi chú', value: selectedApp.note || '-' }
              ]}
              columns={[
                { dataIndex: 'label', key: 'label', width: 150 },
                { dataIndex: 'value', key: 'value' }
              ]}
              pagination={false}
              bordered
            />

            <h3 style={{ marginTop: '30px' }}>Tài liệu đính kèm</h3>
            {selectedApp.documents && selectedApp.documents.length > 0 ? (
              <List
                dataSource={selectedApp.documents}
                renderItem={(doc: any) => (
                  <List.Item>
                    <List.Item.Meta
                      title={doc.document_type}
                      description={`Tệp: ${doc.file_name}`}
                    />
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownloadDocument(doc.file_path, doc.file_name)}
                    >
                      Tải xuống
                    </Button>
                  </List.Item>
                )}
              />
            ) : (
              <p>Không có tài liệu</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyApplications;