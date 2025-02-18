import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Row, Col, Typography, Modal } from 'antd';
import { MailOutlined, PhoneOutlined, RocketOutlined, CalendarOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Text } = Typography;

const ViewProfile = () => {
  const [user, setUser] = useState({});
  const projects = [
    { id: 1, name: 'WDP301_G3', icon: '🖥️', platform: 'Skrumio', color: '#ff5722' },
    { id: 2, name: 'SDN302_G3', icon: '👥', platform: 'Skrumio', color: '#ff5722' },
    { id: 3, name: 'EXE3', icon: '👥', platform: 'Skrumio', color: '#ff5722' },
    { id: 4, name: 'MMA', icon: '👥', platform: 'Skrumio', color: '#ff5722' },
    { id: 5, name: 'PRN', icon: '👥', platform: 'Skrumio', color: '#ff5722' },
    { id: 6, name: 'PRM', icon: '👥', platform: 'Skrumio', color: '#ff5722' },
    { id: 6, name: 'PRM', icon: '👥', platform: 'Skrumio', color: '#ff5722' },
    { id: 6, name: 'PRM', icon: '👥', platform: 'Skrumio', color: '#ff5722' }
  ];
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:9999/users/user-profile', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
      .then(res => setUser(res.data))
      .catch(error => console.log(error.response?.data?.message));
  }, []);

  return (
    <Row gutter={[16, 16]} justify="center">
      {/* Card About - Hiển thị thông tin cá nhân */}
      <Col xs={24} sm={24} md={10} lg={7}>
        <Card 
          style={{ 
            margin: '20px', 
            border: '1px solid grey', 
            textAlign: 'left', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
            transition: 'box-shadow 0.3s ease' 
          }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'}
        >
          <h2 style={{ textAlign: 'center' }}>About</h2>
          <Row style={{ marginBottom: 10 }}>
            <Col span={6} style={{ textAlign: 'center' }}>
              <UserOutlined style={{ fontSize: '25px' }} />
            </Col>
            <Col span={18}><div style={{ fontSize: "17px" }}>{user.fullName || "No information"}</div></Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={6} style={{ textAlign: 'center' }}>
              <EnvironmentOutlined style={{ fontSize: '25px' }} />
            </Col>
            <Col span={18}><div style={{ fontSize: "17px" }}>{user.address || "No information"}</div></Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={6} style={{ textAlign: 'center' }}>
              <CalendarOutlined style={{ fontSize: '25px' }} />
            </Col>
            <Col span={18}><div style={{ fontSize: "17px" }}>{user.dob ? new Date(user.dob).toISOString().split('T')[0] : "No information"}</div></Col>
          </Row>
          <h2 style={{ textAlign: 'center' }}>Contact</h2>
          <Row style={{ marginBottom: 10 }}>
            <Col span={6} style={{ textAlign: 'center' }}>
              <MailOutlined style={{ fontSize: '25px' }} />
            </Col>
            <Col span={18}><a style={{ fontSize: "17px" }} href={`mailto:${user.email}`}>{user.email || "No information"}</a></Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
            <Col span={6} style={{ textAlign: 'center' }}>
              <PhoneOutlined style={{ fontSize: '25px' }} />
            </Col>
            <Col span={18}><div style={{ fontSize: "17px" }}>{user.phoneNumber || "No information"}</div></Col>
          </Row>
        </Card>
      </Col>

      {/* Card Projects */}
      <Col xs={24} sm={24} md={14} lg={17}>
      <Card 
          title="Projects You Worked In"
          style={{ margin: '20px', border: '1px solid grey', background: '#f9f9f9', height: '400px', overflow: 'hidden' }}
          onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'}
        >
          <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '10px' }}>
            <Row gutter={[16, 16]} style={{ margin: 0 }}>
              {projects.map((project) => (
                <Col xs={24} sm={24} md={12} lg={12} key={project.id}>
                  <Row  
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '15px', 
                      border: '1px solid #e0e0e0', 
                      borderRadius: '8px', 
                      background: 'white', 
                      marginBottom: '10px',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                    onClick={() => alert(`Clicked on ${project.name}`)}
                  >
                    <Col span={4}>
                      <RocketOutlined style={{ fontSize: '18px', color: '#1890ff' }} />
                    </Col>
                    <Col span={4}>
                      <Avatar size={40} shape="square" style={{ backgroundColor: project.color }}>{project.icon}</Avatar>
                    </Col>
                    <Col span={16}>
                      <Text strong>{project.platform}</Text>
                      <br />
                      <Text style={{ fontWeight: 'bold', color: '#1890ff', fontSize: '16px' }}>{project.name}</Text>
    
                </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </Col>

    </Row>
  );
}

export default ViewProfile;