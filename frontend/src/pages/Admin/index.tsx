import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'antd';
import API from '@/services/api';

export default function AdminPage() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await API.get('/admin/dashboard');
    setData(res.data);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Dashboard quản trị</h2>

      <Row gutter={16}>
        <Col span={6}>
          <Card title="Tổng hồ sơ">
            {data.total_applications}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Đã duyệt">
            {data.approved}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Từ chối">
            {data.rejected}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Chờ duyệt">
            {data.pending}
          </Card>
        </Col>
      </Row>
    </div>
  );
}