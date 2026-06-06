import {
  Table,
  Button,
  Space,
  message,
} from 'antd';

import {
  useEffect,
  useState,
} from 'react';

import API from '@/services/api';

export default function Admin() {
  const [data, setData] =
    useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res =
      await API.get(
        '/applications',
      );

    setData(res.data);
  };

  const approve = async (
    id: number,
  ) => {
    await API.put(
      `/applications/${id}/approve`,
    );

    message.success(
      'Đã duyệt hồ sơ',
    );

    loadData();
  };

  const reject = async (
    id: number,
  ) => {
    await API.put(
      `/applications/${id}/reject`,
    );

    message.success(
      'Đã từ chối hồ sơ',
    );

    loadData();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Trường',
      dataIndex:
        'university_name',
    },
    {
      title: 'Ngành',
      dataIndex: 'major_name',
    },
    {
      title: 'Điểm',
      dataIndex: 'score',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Minh chứng',
      render: (_: any, row: any) => (
        <a
          href={
            'http://127.0.0.1:8001/uploads/' +
            row.document_path
          }
          target="_blank"
        >
          Xem file
        </a>
      ),
    },
    {
      title: 'Thao tác',
      render: (_: any, row: any) => (
        <Space>
          <Button
            type="primary"
            onClick={() =>
              approve(row.id)
            }
          >
            Duyệt
          </Button>

          <Button
            danger
            onClick={() =>
              reject(row.id)
            }
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Dashboard Admin
      </h2>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}