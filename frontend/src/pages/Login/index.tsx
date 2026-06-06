import { Button, Form, Input, message } from 'antd';
import API from '@/services/api';

export default function Login() {
  const onFinish = async (values: any) => {
    try {
      const res = await API.post(
  '/auth/login',
  values
);

localStorage.setItem(
  'token',
  res.data.access_token
);

localStorage.setItem(
  'role',
  res.data.role
);

localStorage.setItem(
  'name',
  res.data.full_name
);
      message.success('Đăng nhập thành công');
    } catch {
      message.error('Đăng nhập thất bại');
    }
  };

  return (
    <div style={{ width: 400, margin: '50px auto' }}>
      <h2>Đăng nhập</h2>

      <Form onFinish={onFinish}>
        <Form.Item name="email">
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item name="password">
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Đăng nhập
        </Button>
      </Form>
    </div>
  );
}