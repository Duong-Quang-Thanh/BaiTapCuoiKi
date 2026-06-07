import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
} from 'antd';

import {
  useState,
  useEffect,
} from 'react';

import {
  getUniversities,
  createUniversity,
  deleteUniversity,
} from '@/services/university';

export default function UniversityPage() {
  const [data, setData] =
    useState<any[]>([]);

  const [open, setOpen] =
    useState(false);

  const [form] =
    Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData =
    async () => {
      const res =
        await getUniversities();

      setData(res.data);
    };

  const handleCreate =
    async (
      values: any,
    ) => {
      await createUniversity(
        values,
      );

      message.success(
        'Thêm trường thành công',
      );

      form.resetFields();

      setOpen(false);

      loadData();
    };

  const handleDelete =
    async (
      id: number,
    ) => {
      await deleteUniversity(
        id,
      );

      message.success(
        'Đã xóa',
      );

      loadData();
    };

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <h2>
        Quản lý Trường
      </h2>

      <Button
        type="primary"
        onClick={() =>
          setOpen(true)
        }
      >
        Thêm trường
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
              'Tên trường',
            dataIndex:
              'name',
          },
          {
            title:
              'Mô tả',
            dataIndex:
              'description',
          },
          {
            title:
              'Thao tác',
            render: (
              _: any,
              row: any,
            ) => (
              <Button
                danger
                onClick={() =>
                  handleDelete(
                    row.id,
                  )
                }
              >
                Xóa
              </Button>
            ),
          },
        ]}
      />

      <Modal
        title="Thêm trường"
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
            handleCreate
          }
        >
          <Form.Item
            name="name"
            label="Tên trường"
            rules={[
              {
                required:
                  true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
          >
            Lưu
          </Button>
        </Form>
      </Modal>
    </div>
  );
}