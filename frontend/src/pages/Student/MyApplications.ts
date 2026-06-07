import { Table } from 'antd';
import { useEffect, useState } from 'react';
import API from '@/services/api';

export default function MyApplications() {
  const [data, setData] =
    useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userId =
      localStorage.getItem(
        'userId'
      );

    const res =
      await API.get(
        `/applications/user/${userId}`
      );

    setData(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Hồ sơ của tôi
      </h2>

      <Table
        rowKey="id"
        dataSource={data}
        columns={[
          {
            title: 'Trường',
            dataIndex:
              'university_name',
          },
          {
            title: 'Ngành',
            dataIndex:
              'major_name',
          },
          {
            title: 'Điểm',
            dataIndex: 'score',
          },
          {
            title:
              'Trạng thái',
            dataIndex:
              'status',
          },
          {
            title: 'Ghi chú',
            dataIndex: 'note',
          },
        ]}
      />
    </div>
  );
}