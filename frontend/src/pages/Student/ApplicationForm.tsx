import React, { useState, useEffect } from 'react';
import { Form, Button, Select, Input, InputNumber, Upload, Card, Table, Modal, message, Spin, Row, Col, Steps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const ApplicationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [majors, setMajors] = useState([]);
  const [examCombinations, setExamCombinations] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userId] = useState(1); // Get from auth context in real app

  const API_URL = 'http://localhost:8000';

  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get(`${API_URL}/universities`);
        setUniversities(response.data);
      } catch (error) {
        message.error('Lỗi tải danh sách trường đại học');
      }
    };
    fetchUniversities();
  }, []);

  // Fetch majors when university is selected
  useEffect(() => {
    if (selectedUniversity) {
      const fetchMajors = async () => {
        try {
          const response = await axios.get(`${API_URL}/majors/university/${selectedUniversity}`);
          setMajors(response.data);
          setExamCombinations([]);
        } catch (error) {
          message.error('Lỗi tải danh sách ngành học');
        }
      };
      fetchMajors();
    }
  }, [selectedUniversity]);

  // Fetch exam combinations when major is selected
  useEffect(() => {
    if (selectedMajor) {
      const fetchExamCombinations = async () => {
        try {
          const response = await axios.get(`${API_URL}/exam-combinations/major/${selectedMajor}`);
          setExamCombinations(response.data);
        } catch (error) {
          message.error('Lỗi tải tổ hợp xét tuyển');
        }
      };
      fetchExamCombinations();
    }
  }, [selectedMajor]);

  // Fetch admission batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/batches`);
        setBatches(response.data);
      } catch (error) {
        message.error('Lỗi tải đợt tuyển sinh');
      }
    };
    fetchBatches();
  }, []);

  // Handle file upload
  const handleFileUpload = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/applications/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadedFiles([...uploadedFiles, response.data]);
      message.success('Tải tệp thành công');
    } catch (error) {
      message.error('Lỗi tải tệp');
    }
    return false;
  };

  // Handle form submission
  const onSubmit = async (values: any) => {
    if (uploadedFiles.length === 0) {
      message.error('Vui lòng tải ít nhất một tài liệu');
      return;
    }

    setLoading(true);

    try {
      // Create application
      const appResponse = await axios.post(`${API_URL}/applications/`, {
        user_id: userId,
        batch_id: values.batch_id,
        university_id: selectedUniversity,
        major_id: selectedMajor,
        exam_combination_id: values.exam_combination_id,
        score: values.score
      });

      const applicationId = appResponse.data.id;

      // Upload documents
      for (const file of uploadedFiles) {
        const docFormData = new FormData();
        docFormData.append('application_id', applicationId);
        docFormData.append('document_type', values.document_type || 'other');

        await axios.post(
          `${API_URL}/applications/${applicationId}/documents`,
          docFormData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }

      message.success('Nộp hồ sơ thành công!');
      form.resetFields();
      setUploadedFiles([]);
      setCurrentStep(0);
      window.location.href = '/student';
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Lỗi nộp hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Chọn trường', content: 'step1' },
    { title: 'Chọn ngành', content: 'step2' },
    { title: 'Nhập điểm', content: 'step3' },
    { title: 'Tải tài liệu', content: 'step4' },
    { title: 'Xác nhận', content: 'step5' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Nộp Hồ Sơ Tuyển Sinh</h1>
      
      <Steps current={currentStep} items={steps} style={{ marginBottom: '30px' }} />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
        >
          {/* Step 1: University Selection */}
          {currentStep === 0 && (
            <div>
              <Form.Item
                label="Chọn trường đại học"
                name="university_id"
                rules={[{ required: true, message: 'Vui lòng chọn trường' }]}
              >
                <Select
                  placeholder="Chọn trường"
                  onChange={(value) => {
                    setSelectedUniversity(value);
                    form.setFieldValue('major_id', undefined);
                  }}
                  options={universities.map(uni => ({
                    value: uni.id,
                    label: uni.name
                  }))}
                />
              </Form.Item>
              <Button type="primary" onClick={() => setCurrentStep(1)}>
                Tiếp tục
              </Button>
            </div>
          )}

          {/* Step 2: Major Selection */}
          {currentStep === 1 && (
            <div>
              <Form.Item
                label="Chọn ngành học"
                name="major_id"
                rules={[{ required: true, message: 'Vui lòng chọn ngành' }]}
              >
                <Select
                  placeholder="Chọn ngành"
                  onChange={(value) => setSelectedMajor(value)}
                  options={majors.map(major => ({
                    value: major.id,
                    label: major.name
                  }))}
                />
              </Form.Item>
              <Row gutter={10}>
                <Col>
                  <Button onClick={() => setCurrentStep(0)}>Quay lại</Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => setCurrentStep(2)}>
                    Tiếp tục
                  </Button>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 3: Score & Exam Combination */}
          {currentStep === 2 && (
            <div>
              <Form.Item
                label="Đợt xét tuyển"
                name="batch_id"
                rules={[{ required: true, message: 'Vui lòng chọn đợt' }]}
              >
                <Select
                  placeholder="Chọn đợt xét tuyển"
                  options={batches.map(batch => ({
                    value: batch.id,
                    label: batch.name
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Tổ hợp xét tuyển"
                name="exam_combination_id"
                rules={[{ required: true, message: 'Vui lòng chọn tổ hợp' }]}
              >
                <Select
                  placeholder="Chọn tổ hợp"
                  options={examCombinations.map(combo => ({
                    value: combo.id,
                    label: `${combo.code} - ${combo.description}`
                  }))}
                />
              </Form.Item>

              <Form.Item
                label="Điểm xét tuyển"
                name="score"
                rules={[
                  { required: true, message: 'Vui lòng nhập điểm' },
                  { type: 'number', min: 0, max: 30, message: 'Điểm phải từ 0 đến 30' }
                ]}
              >
                <InputNumber placeholder="Nhập điểm" min={0} max={30} />
              </Form.Item>

              <Row gutter={10}>
                <Col>
                  <Button onClick={() => setCurrentStep(1)}>Quay lại</Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => setCurrentStep(3)}>
                    Tiếp tục
                  </Button>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 4: Document Upload */}
          {currentStep === 3 && (
            <div>
              <Form.Item
                label="Loại tài liệu"
                name="document_type"
              >
                <Select
                  placeholder="Chọn loại tài liệu"
                  options={[
                    { value: 'student_id', label: 'Ảnh CCCD/CMND' },
                    { value: 'transcript', label: 'Học bạ' },
                    { value: 'certificate', label: 'Chứng chỉ' },
                    { value: 'other', label: 'Khác' }
                  ]}
                />
              </Form.Item>

              <Form.Item label="Tải tài liệu (PDF, JPEG, PNG)">
                <Upload
                  accept=".pdf,.jpg,.jpeg,.png"
                  beforeUpload={handleFileUpload}
                  maxCount={5}
                >
                  <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                </Upload>
              </Form.Item>

              {uploadedFiles.length > 0 && (
                <div>
                  <h4>Tài liệu đã tải ({uploadedFiles.length}):</h4>
                  <ul>
                    {uploadedFiles.map((file, idx) => (
                      <li key={idx}>{file.file_name}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Row gutter={10}>
                <Col>
                  <Button onClick={() => setCurrentStep(2)}>Quay lại</Button>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => setCurrentStep(4)}>
                    Tiếp tục
                  </Button>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 4 && (
            <div>
              <h3>Xác nhận thông tin</h3>
              <p><strong>Trường:</strong> {universities.find(u => u.id === selectedUniversity)?.name}</p>
              <p><strong>Ngành:</strong> {majors.find(m => m.id === selectedMajor)?.name}</p>
              <p><strong>Điểm:</strong> {form.getFieldValue('score')}</p>
              <p><strong>Tài liệu:</strong> {uploadedFiles.length} tệp</p>

              <Row gutter={10} style={{ marginTop: '20px' }}>
                <Col>
                  <Button onClick={() => setCurrentStep(3)}>Quay lại</Button>
                </Col>
                <Col>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Nộp hồ sơ
                  </Button>
                </Col>
              </Row>
            </div>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default ApplicationForm;
