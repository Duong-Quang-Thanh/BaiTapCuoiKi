import { Form, Input, Button, message } from 'antd';
import API from '@/services/api';

export default function Register() {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const res = await API.post('/auth/register', {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      message.success('Đăng ký thành công');
      form.resetFields();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.detail || 'Lỗi đăng ký';
      message.error(errorMsg);
      console.error('Registration error:', err?.response?.data);
    }
  };

  return (
    <div style={{ width: 500, margin: '50px auto' }}>
      <h2>Đăng ký tài khoản</h2>

      <Form form={form} onFinish={onFinish}>
        <Form.Item 
          name="full_name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
        >
          <Input placeholder="Họ tên" />
        </Form.Item>

        <Form.Item 
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item 
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input placeholder="Số điện thoại" />
        </Form.Item>

        <Form.Item 
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Đăng ký
        </Button>
      </Form>
    </div>
  );
}