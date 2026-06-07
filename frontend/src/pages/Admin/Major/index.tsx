import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  message,
} from 'antd';

import {
  useEffect,
  useState,
} from 'react';

import API from '@/services/api';

export default function Major() {
  const [data, setData] =
    useState<any[]>([]);

  const [open, setOpen] =
    useState(false);

  const [form] =
    Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res =
      await API.get(
        '/majors'
      );

    setData(res.data);
  };

  const createMajor =
    async (
      values: any
    ) => {
      await API.post(
        '/majors',
        values
      );

      message.success(
        'Thêm ngành thành công'
      );

      setOpen(false);

      form.resetFields();

      loadData();
    };

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <h2>
        Quản lý ngành
      </h2>

      <Button
        type="primary"
        onClick={() =>
          setOpen(true)
        }
      >
        Thêm ngành
      </Button>

      <br />
      <br />

      <Table
        rowKey="id"
        dataSource={data}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
          },
          {
            title:
              'University ID',
            dataIndex:
              'university_id',
          },
          {
            title: 'Tên ngành',
            dataIndex: 'name',
          },
        ]}
      />

      <Modal
        title="Thêm ngành"
        open={open}
        footer={null}
        onCancel={() =>
          setOpen(false)
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={
            createMajor
          }
        >
          <Form.Item
            name="university_id"
            label="University ID"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên ngành"
          >
            <Input />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
          >
            Lưu
          </Button>
        </Form>
      </Modal>
    </div>
  );
}