import React from 'react';
import { Card, Avatar, Button, Row, Col } from 'antd';
import { MailOutlined, PhoneOutlined, SolutionOutlined, ClusterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const ViewProfile = () => {
    return(<Row gutter={16}>
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
              <Button type="primary"><Link to={"/profile/edit-profile"}>Edit profile</Link></Button>
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
      );
}

export default ViewProfile;