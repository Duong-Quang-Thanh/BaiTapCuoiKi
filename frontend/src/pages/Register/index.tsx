import { Form, Input, Button } from 'antd';

export default function Register() {
  return (
    <Form layout="vertical">
      <Form.Item label="Họ tên"><Input /></Form.Item>
      <Form.Item label="Email"><Input /></Form.Item>
      <Form.Item label="Mật khẩu"><Input.Password /></Form.Item>
      <Button type="primary">Đăng ký</Button>
    </Form>
  );
}