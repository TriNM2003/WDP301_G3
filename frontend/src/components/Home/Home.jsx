import React from 'react'
import { Button, Card, Carousel, Col, Collapse, Row, Space } from 'antd'
import Title from 'antd/es/typography/Title'
import { ArrowRightOutlined, GoogleCircleFilled, GoogleOutlined, GooglePlusCircleFilled, GooglePlusOutlined, MailOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
function Home() {
  return (
    <Row  justify="space-around"  style={{height:"55vh", margin: "0 0 5% 0" , background: " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../wellcome-bg.jpg') no-repeat center center fixed ", "background-size": "100%", "background-blend-mode": "multiply" }}>
        <Col span={15} align="start">
          <Title level={1} style={{ color: "white", margin:"5% 5% 0 5%" }}>Welcome back, HaoTran 🔥</Title>
          <Title level={5} type='warning' style={{ margin:"0 5% 5% 5%" }}>Let's continue the work and achieve your goals! 🚀</Title>
          <Row align="middle" style={{border:"1px solid white", margin:"0 5%", padding:"1% 3%"}}>
              <Col span={18}  >
                  <Title level={4} style={{color:"white", margin:"0"}}>🖥️ Site</Title>
                  <p style={{color:"white", margin:"0"}}>Sitename</p>
              </Col>
              <Col align="end" span={4} >
                  <Button icon={<ArrowRightOutlined />} iconPosition='end' color='cyan' variant='solid' style={{border:"0"}}>Go to site</Button>
              </Col>
          </Row>
        </Col>

      </Row>
  )
}

export default Home
