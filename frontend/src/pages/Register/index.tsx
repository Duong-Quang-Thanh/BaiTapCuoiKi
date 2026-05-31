import { Form, Input, Button, message } from 'antd';
import API from '@/services/api';

export default function Register() {
  const onFinish = async (values: any) => {
    try {
      await API.post('/auth/register', values);
      message.success('Đăng ký thành công');
    } catch {
      message.error('Lỗi đăng ký');
    }
  };

  return (
    <div style={{ width: 500, margin: '50px auto' }}>
      <h2>Đăng ký tài khoản</h2>

      <Form onFinish={onFinish}>
        <Form.Item name="full_name">
          <Input placeholder="Họ tên" />
        </Form.Item>

        <Form.Item name="email">
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item name="phone">
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item name="password">
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Đăng ký
        </Button>
      </Form>
    </div>
  );
}