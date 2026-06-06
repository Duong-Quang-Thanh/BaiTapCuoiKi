import { Button, Form, Input, message } from 'antd';
import API from '@/services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await API.post('/auth/login', values);

      localStorage.setItem(
        'token',
        res.data.access_token,
      );

      localStorage.setItem(
        'role',
        res.data.role,
      );

      localStorage.setItem(
        'name',
        res.data.full_name,
      );

      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err: any) {
      message.error(
        err?.response?.data?.detail ||
          'Đăng nhập thất bại',
      );
    }
  };

  return (
    <div
      style={{
        width: 400,
        margin: '100px auto',
      }}
    >
      <h2>Đăng nhập</h2>

      <Form onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Nhập email',
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Nhập mật khẩu',
            },
          ]}
        >
          <Input.Password placeholder="Mật khẩu" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
        >
          Đăng nhập
        </Button>
      </Form>
    </div>
  );
}