import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
  Select,
} from 'antd';

import {
  UploadOutlined,
} from '@ant-design/icons';

import {
  useState,
  useEffect,
} from 'react';

import API from '@/services/api';

export default function Student() {
  const [filePath, setFilePath] =
    useState('');

  const [
    universities,
    setUniversities,
  ] = useState<any[]>([]);

  const [
    majors,
    setMajors,
  ] = useState<any[]>([]);

  useEffect(() => {
    loadUniversities();
  }, []);

  const loadUniversities =
    async () => {
      try {
        const res =
          await API.get(
            '/universities'
          );

        setUniversities(
          res.data
        );
      } catch {
        message.error(
          'Không tải được danh sách trường'
        );
      }
    };

  const loadMajors =
    async (
      universityId: number
    ) => {
      try {
        const res =
          await API.get(
            `/majors/university/${universityId}`
          );

        setMajors(
          res.data
        );
      } catch {
        message.error(
          'Không tải được ngành'
        );
      }
    };

  const uploadProps = {
    customRequest: async (
      options: any,
    ) => {
      const formData =
        new FormData();

      formData.append(
        'file',
        options.file,
      );

      const res =
        await API.post(
          '/applications/upload',
          formData,
        );

      setFilePath(
        res.data.file_path,
      );

      message.success(
        'Upload thành công',
      );
    },
  };

  const onFinish = async (
    values: any,
  ) => {
    try {
      await API.post(
        '/applications',
        {
          ...values,
          user_id: Number(
            localStorage.getItem(
              'userId'
            )
          ),
          document_path:
            filePath,
        },
      );

      message.success(
        'Nộp hồ sơ thành công',
      );
    } catch {
      message.error(
        'Lỗi nộp hồ sơ',
      );
    }
  };

  return (
    <div
      style={{
        width: 700,
        margin: '30px auto',
      }}
    >
      <h2>
        Xin chào{' '}
        {localStorage.getItem(
          'name'
        )}
      </h2>

      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          gap: 10,
        }}
      >
        <Button
          onClick={() => {
            window.location.href =
              '/student/applications';
          }}
        >
          Hồ sơ của tôi
        </Button>

        <Button
          danger
          onClick={() => {
            localStorage.clear();

            window.location.href =
              '/login';
          }}
        >
          Đăng xuất
        </Button>
      </div>

      <Form
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Trường"
          name="university_name"
        >
          <Select
            placeholder="Chọn trường"
            options={universities.map(
              (u: any) => ({
                label: u.name,
                value: u.name,
                id: u.id,
              })
            )}
            onChange={(
              _,
              option: any
            ) => {
              loadMajors(
                option.id
              );
            }}
          />
        </Form.Item>

        <Form.Item
          label="Ngành"
          name="major_name"
        >
          <Select
            placeholder="Chọn ngành"
            options={majors.map(
              (m: any) => ({
                label: m.name,
                value: m.name,
              })
            )}
          />
        </Form.Item>

        <Form.Item
          label="Điểm xét tuyển"
          name="score"
        >
          <InputNumber
            style={{
              width: '100%',
            }}
          />
        </Form.Item>

        <Form.Item
          label="Ghi chú"
          name="note"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Minh chứng">
          <Upload
            {...uploadProps}
          >
            <Button
              icon={
                <UploadOutlined />
              }
            >
              Upload PDF/JPG
            </Button>
          </Upload>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
        >
          Nộp hồ sơ
        </Button>
      </Form>
    </div>
  );
}