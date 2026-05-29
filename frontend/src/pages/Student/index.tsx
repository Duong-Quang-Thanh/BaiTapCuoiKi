import { Form, InputNumber, Select, Upload, Button } from 'antd';

export default function StudentPage() {
  return (
    <Form layout="vertical">
      <Form.Item label="Trường">
        <Select />
      </Form.Item>

      <Form.Item label="Ngành">
        <Select />
      </Form.Item>

      <Form.Item label="Điểm thi">
        <InputNumber />
      </Form.Item>

      <Form.Item label="Minh chứng">
        <Upload />
      </Form.Item>

      <Button type="primary">Nộp hồ sơ</Button>
    </Form>
  );
}