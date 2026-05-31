import { Button, Form, Input, InputNumber, message } from 'antd';
import API from '@/services/api';

export default function StudentPage() {
  const onFinish = async (values: any) => {
    try {
      await API.post('/applications', values);

      message.success('Nộp hồ sơ thành công');
    } catch {
      message.error('Lỗi nộp hồ sơ');
    }
  };

  return (
    <div style={{ width: 600, margin: '40px auto' }}>
      <h2>Nộp hồ sơ xét tuyển</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="user_id" label="Mã sinh viên">
          <Input />
        </Form.Item>

        <Form.Item name="university_id" label="Trường">
          <Input />
        </Form.Item>

        <Form.Item name="major_id" label="Ngành">
          <Input />
        </Form.Item>

        <Form.Item name="score" label="Điểm">
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Nộp hồ sơ
        </Button>
      </Form>
    </div>
  );
}