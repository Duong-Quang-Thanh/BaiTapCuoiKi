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

import Statistics from './Statistics';
import API from '@/services/api';

export default function Admin() {
  const [data, setData] =
    useState<any[]>([]);

  const [stats, setStats] =
    useState<any>({
      approved: 0,
      rejected: 0,
      pending: 0,
      total: 0,
    });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res =
        await API.get(
          '/applications',
        );

      setData(res.data);

      const statRes =
        await API.get(
          '/admin/statistics',
        );

      setStats(statRes.data);
    } catch (error) {
      console.error(error);

      message.error(
        'Không thể tải dữ liệu',
      );
    }
  };

  const approve = async (
    id: number,
  ) => {
    try {
      await API.put(
        `/applications/${id}/approve`,
      );

      message.success(
        'Đã duyệt hồ sơ',
      );

      loadData();
    } catch {
      message.error(
        'Lỗi duyệt hồ sơ',
      );
    }
  };

  const reject = async (
    id: number,
  ) => {
    try {
      await API.put(
        `/applications/${id}/reject`,
      );

      message.success(
        'Đã từ chối hồ sơ',
      );

      loadData();
    } catch {
      message.error(
        'Lỗi từ chối hồ sơ',
      );
    }
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
      dataIndex:
        'major_name',
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
      render: (
        _: any,
        row: any,
      ) => (
        <a
          href={
            'http://127.0.0.1:8001/uploads/' +
            row.document_path
          }
          target="_blank"
          rel="noreferrer"
        >
          Xem file
        </a>
      ),
    },
    {
      title: 'Thao tác',
      render: (
        _: any,
        row: any,
      ) => (
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
    <div
      style={{
        padding: 20,
      }}
    >
      <h2>
        Dashboard Admin
      </h2>

      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          gap: 10,
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            window.open(
              'http://127.0.0.1:8001/admin/export'
            );
          }}
        >
          Xuất Excel
        </Button>

        <Button
          onClick={() => {
            window.location.href =
              '/admin/universities';
          }}
        >
          Quản lý Trường
        </Button>
      </div>

      <Statistics
        data={stats}
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}