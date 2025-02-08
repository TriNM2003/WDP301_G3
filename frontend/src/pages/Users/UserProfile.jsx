import React from 'react';
import { Card, Avatar, Button, Row, Col } from 'antd';
import { MailOutlined, PhoneOutlined, SolutionOutlined, ClusterOutlined } from '@ant-design/icons';

const UserProfile = () => {
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
          <h2 style={{ marginTop: 10 }}>John A</h2>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={6}>
          <Card style={{ margin: '0 50px', border: '1px solid grey', textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center' }}>About</h3>
            <Row style={{ marginBottom: 10 }}>
              <Col span={9} style={{ textAlign: 'center'}}>
                <SolutionOutlined style={{ fontSize: '30px' }} />
              </Col>
              <Col span={15}>Student</Col>
            </Row>
            <Row>
              <Col span={9} style={{ textAlign: 'center' }}>
                <ClusterOutlined style={{ fontSize: '30px' }} />
              </Col>
              <Col span={15}>IT Department</Col>
            </Row>
            <h3 style={{ textAlign: 'center' }}>Contact</h3>
            <Row style={{ marginBottom: 10 }}>
              <Col span={9} style={{ textAlign: 'center' }}>
                <MailOutlined style={{ fontSize: '30px' }} />
              </Col>
              <Col span={15}><a href="mailto:johna@gmail.com">johna@gmail.com</a></Col>
            </Row>
            <Row>
              <Col span={9} style={{ textAlign: 'center' }}>
                <PhoneOutlined style={{ fontSize: '30px' }} />
              </Col>
              <Col span={15}>07453423454</Col>
            </Row>
          </Card>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Button type="primary">Edit profile</Button>
            </div>
        </Col>
        <Col span={18}>
          <Card title="Project you worked in" style={{ margin: '0 50px', border: '1px solid grey' }}>
            <Row gutter={[16, 16]}>
              {[...Array(6)].map((_, index) => (
                <Col span={12} key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar size={50} style={{ backgroundColor: '#1890ff', marginRight: 10 }}>
                    📊
                  </Avatar>
                  <span>Block Game</span>
                </Col>
              ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Button type="primary">View all projects</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
