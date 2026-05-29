import { Button, Form, Input } from 'antd';

export default function Login() {
  return (
    <Form layout="vertical">
      <Form.Item label="Email">
        <Input />
      </Form.Item>
      <Form.Item label="Mật khẩu">
        <Input.Password />
      </Form.Item>
      <Button type="primary">Đăng nhập</Button>
    </Form>
  );
}