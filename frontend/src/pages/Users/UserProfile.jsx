
import React from 'react';
import { useState, useEffect } from 'react';
import { Card, Avatar, Button, Row, Col } from 'antd';
import { MailOutlined, PhoneOutlined, SolutionOutlined, ClusterOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
const UserProfile = () => {
  const [user, setUser] = useState({});
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
    <div style={{ margin: '0 auto' }}>
      {/* Profile Cover */}
      <div>
        <img
          src="https://static.vecteezy.com/system/resources/previews/004/243/021/non_2x/abstract-template-background-white-and-bright-blue-squares-overlapping-with-halftone-and-texture-free-vector.jpg"
          alt="profile-cover"
          style={{ width: '100%', height: 200, objectFit: 'cover' }}
        />
      </div>
      
      <Row gutter={[16, 16]} style={{ marginTop: -70, textAlign: 'center' }}>
        <Col span={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar size={150} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR81iX4Mo49Z3oCPSx-GtgiMAkdDop2uVmVvw&s" style={{ border: '4px solid white' }} />
          <h2 style={{ marginTop: 10 }}>{user.username}</h2>
        </Col>
      </Row>
      <Outlet />


    </div>
  );
};

export default UserProfile;
