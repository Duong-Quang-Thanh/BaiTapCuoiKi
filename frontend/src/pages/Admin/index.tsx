import { Table, Tag } from 'antd';

export default function AdminPage() {
  return (
    <Table
      columns={[
        { title: 'Họ tên', dataIndex: 'name' },
        { title: 'Trạng thái', dataIndex: 'status', render: (v) => <Tag>{v}</Tag> },
      ]}
      dataSource={[]}
    />
  );
}