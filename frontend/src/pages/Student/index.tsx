import React from 'react';
import { Card, Row, Col, Button, Statistic, Space } from 'antd';
import { FormOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';
import { history } from 'umi';

const Student: React.FC = () => {
  const studentName = localStorage.getItem('name') || 'Học sinh';

  return (
    <div style={{ padding: '20px' }}>
      <h1>Xin chào {studentName}</h1>
      <p>Chào mừng đến Cổng Tuyển Sinh Trực Tuyến</p>

      <Row gutter={16} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => history.push('/student/application-form')}
            style={{ textAlign: 'center' }}
          >
            <FormOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            <h3>Nộp Hồ Sơ Mới</h3>
            <p>Tạo một hồ sơ tuyển sinh mới</p>
            <Button type="primary">Nộp Hồ Sơ</Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => history.push('/student/applications')}
            style={{ textAlign: 'center' }}
          >
            <FileTextOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            <h3>Hồ Sơ Của Tôi</h3>
            <p>Xem danh sách các hồ sơ đã nộp</p>
            <Button type="primary">Xem Hồ Sơ</Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => history.push('/universities')}
            style={{ textAlign: 'center' }}
          >
            <BookOutlined style={{ fontSize: '48px', color: '#faad14' }} />
            <h3>Danh Sách Trường</h3>
            <p>Khám phá các trường và ngành học</p>
            <Button type="primary">Xem Danh Sách</Button>
          </Card>
        </Col>
      </Row>

      <Card title="Hướng dẫn sử dụng">
        <ol>
          <li>Xem danh sách các trường đại học và ngành học</li>
          <li>Chọn trường, ngành và tổ hợp xét tuyển phù hợp</li>
          <li>Nhập điểm xét tuyển của bạn</li>
          <li>Tải các tài liệu yêu cầu (CCCD, học bạ, v.v.)</li>
          <li>Nộp hồ sơ và theo dõi trạng thái</li>
        </ol>
      </Card>
    </div>
  );
};

export default Student;