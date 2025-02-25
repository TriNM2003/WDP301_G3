import React, { useState, useEffect } from 'react';
import { Card, Avatar, Row, Col } from 'antd';
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
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Profile Cover */}
      <div style={{ width: '100%' }}>
        <img
          src="https://static.vecteezy.com/system/resources/previews/004/243/021/non_2x/abstract-template-background-white-and-bright-blue-squares-overlapping-with-halftone-and-texture-free-vector.jpg"
          alt="profile-cover"
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
        />
      </div>

      {/* Profile Section */}
      <Row gutter={[16, 16]} style={{ marginTop: '-70px', textAlign: 'center', width: '100%', }}>
        <Col xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            size={150}
            src={user.userAvatar || 'https://www.w3schools.com/howto/img_avatar.png'}
            style={{ border: '4px solid white' }}
          />
          <h2 style={{ marginTop: 10 }}>{user.username}</h2>
        </Col>
      </Row>

      {/* Nội dung bên dưới */}
      <div style={{ width: '100%', padding: '20px', flexGrow: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default UserProfile;