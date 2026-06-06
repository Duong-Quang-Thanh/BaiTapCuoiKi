import {
  Form,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
} from 'antd';

import {
  UploadOutlined,
} from '@ant-design/icons';

import { useState } from 'react';

import API from '@/services/api';

export default function Student() {
  const [filePath, setFilePath] =
    useState('');

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
          'name',
        )}
      </h2>

      <Form
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Trường"
          name="university_name"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ngành"
          name="major_name"
        >
          <Input />
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
          <Upload {...uploadProps}>
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