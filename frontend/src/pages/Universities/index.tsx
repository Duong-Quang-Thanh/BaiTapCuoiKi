import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, message } from 'antd';
import { getUniversities } from '../../services/university';
import { getMajorsByUniversity } from '../../services/major';
import { University } from '../../services/university';
import { Major } from '../../services/major';
import './index.css';

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [majorsByUniversity, setMajorsByUniversity] = useState<Record<number, Major[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch universities
        const unis = await getUniversities();
        setUniversities(unis);

        // Fetch majors for each university
        const majorsMap: Record<number, Major[]> = {};
        for (const uni of unis) {
          const majors = await getMajorsByUniversity(uni.id);
          majorsMap[uni.id] = majors;
        }
        setMajorsByUniversity(majorsMap);
        message.success('Đã tải dữ liệu trường và ngành học!');
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <div className="universities-container" style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Danh sách trường và ngành học</h1>
      
      <Row gutter={[24, 24]}>
        {universities.map((university) => (
          <Col xs={24} sm={24} md={12} lg={8} key={university.id}>
            <Card 
              title={university.name}
              bordered
              hoverable
              style={{ 
                minHeight: '400px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div>
                <h4 style={{ marginBottom: '15px' }}>Ngành học:</h4>
                <ul style={{ paddingLeft: '20px' }}>
                  {majorsByUniversity[university.id]?.map((major) => (
                    <li key={major.id} style={{ marginBottom: '10px' }}>
                      {major.name}
                    </li>
                  )) || <li>Không có ngành học</li>}
                </ul>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {universities.length === 0 && (
        <Card>
          <p style={{ textAlign: 'center', color: '#999' }}>
            Không tìm thấy dữ liệu trường học
          </p>
        </Card>
      )}
    </div>
  );
}
