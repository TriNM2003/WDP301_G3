import React from 'react';

import { useState, useEffect } from 'react';
import { Card, Avatar, Button, Row, Col, Typography } from 'antd';
import { MailOutlined, PhoneOutlined, RocketOutlined, CalendarOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const { Text } = Typography;

const ViewProfile = () => {


  const [user, setUser] = useState({});
  const projects = [
    { id: 1, name: 'WDP301_G3', icon: '🖥️', platform: 'skrumio', color: '#ff5722' },
    { id: 2, name: 'SDN302_G3', icon: '👥', platform: 'skrumio', color: '#ff5722' },
    { id: 3, name: 'EXE3', icon: '👥', platform: 'skrumio', color: '#ff5722' },
    { id: 4, name: 'MMA', icon: '👥', platform: 'skrumio', color: '#ff5722' },
    { id: 5, name: 'PRN', icon: '👥', platform: 'skrumio', color: '#ff5722' },
    { id: 6, name: 'PRM', icon: '👥', platform: 'skrumio', color: '#ff5722' }
  ];
  useEffect(() => {
    axios.get('http://localhost:9999/users/user-profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(res => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch(error => {
        console.log(error.response?.data?.message);
      });
  }, []);


  return (
  <Row gutter={16}>
    <Col span={6}>
      <Card style={{ margin: '0 45px', border: '1px solid grey', textAlign: 'left' }}>
        <h2 style={{ textAlign: 'center' }}>About</h2>
        <Row style={{ marginBottom: 10 }}>
          <Col span={7} style={{ textAlign: 'center' }}>
            <UserOutlined style={{ fontSize: '25px' }} />
          </Col>
          <Col span={15}><div style={{ fontSize: "17px" }}>{user.fullName}</div></Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col span={7} style={{ textAlign: 'center' }}>
            <EnvironmentOutlined style={{ fontSize: '25px' }} />
          </Col>
          <Col span={15}><div style={{ fontSize: "17px" }}>{user.address}</div></Col>
          </Row>
          <Row style={{ marginBottom: 10 }}>
          <Col span={7} style={{ textAlign: 'center' }}>
            <CalendarOutlined style={{ fontSize: '25px' }} />
          </Col>
          <Col span={15}><div style={{ fontSize: "17px" }}>{user.dob ? new Date(user.dob).toISOString().split('T')[0] : ''}</div></Col>
        </Row>
        <h2 style={{ textAlign: 'center' }}>Contact</h2>
        <Row style={{ marginBottom: 10 }}>
          <Col span={7} style={{ textAlign: 'center' }}>
            <MailOutlined style={{ fontSize: '25px' }} />
          </Col>
          <Col span={15}><a style={{ fontSize: "17px" }} href="mailto:johna@gmail.com">{user.email}</a></Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          <Col span={7} style={{ textAlign: 'center' }}>
            <PhoneOutlined style={{ fontSize: '25px' }} />
          </Col>
          <Col span={15}><div style={{ fontSize: "17px" }}>{user.phoneNumber}</div></Col>
        </Row>
      </Card>
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <Button type="primary">Edit profile</Button>
      </div>
    </Col>
    <Col span={18}>
      <Card title="Project you worked in" style={{ margin: '0 50px', border: '1px solid grey', background: '#f9f9f9' }}>
      <Row gutter={[16, 16]}>
          {projects.map((project) => (
            <Col span={12} key={project.id}>
              <Row style={{ display: 'flex', alignItems: 'center', padding: '15px', border: '1px solid #e0e0e0', borderRadius: '8px', background: 'white', marginBottom: '10px' }}>
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
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button type="primary">View all projects</Button>
        </div>
      </Card>
    </Col>
  </Row>
  );
}

export default ViewProfile;