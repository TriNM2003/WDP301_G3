import React from 'react'
import { Button, Card, Carousel, Col, Collapse, Row, Space } from 'antd'
import Title from 'antd/es/typography/Title'
import { ArrowRightOutlined, GoogleCircleFilled, GoogleOutlined, GooglePlusCircleFilled, GooglePlusOutlined, MailOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
function Welcome() {
  return (
     <Row style={{ margin: "0 0 5% 0" }}>
        <Col span={10} justify='center' align='center'  style={{"text-shadow":" 0 0 8px rgba(255, 255, 255, 0.4)",background: "linear-gradient(90deg, #70A1FF, #A4D7F5,#FDDCEC, #A6C1EE)"}}>
          <Title level={1} style={{ marginTop: "10%", width: "65%"}}>🛠 Manage your works with SkrumIO</Title>
            <p  style={{ "font-style":"italic", width: "65%" }}>"Simplify task tracking, enhance team collaboration, and integrate effortlessly with tools like Git and Jira. Start optimizing your workflow today!"</p>
        </Col>
        <Col align='center' span={14} style={{ background: " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../wellcome-bg.jpg') no-repeat center center fixed ", "background-size": "100%", "background-blend-mode": "multiply" }}>
          <Title level={3} style={{ color: "white", margin: "3%" }} >Begin your journey today</Title>

          <Space direction="vertical" style={{ width: "50%", margin: "3% 0" }}>
            <Button type="primary" size="large" block style={{ margin: "2% 0" }}  >
              <Title level={4} style={{ color: "white", margin: "0" }}>Sign up</Title>
            </Button>

            <Button color="danger" variant="outlined" size="large" block>
              <Title level={4} style={{ margin: "0" }}><GooglePlusCircleFilled style={{ color: "red" }} /> Continue with Google</Title>

            </Button>
          </Space>

          <p style={{ fontSize: "12px", display: "block", margin: "5% 0 0 0", color: "white" }}>
            SkrumIO helps teams organize tasks, streamline communication, and track progress effortlessly.
          </p>
          <p style={{ fontSize: "12px", display: "block", margin: "0 0 3% 0", color: "white" }}>
            Join thousands of professionals optimizing their workflow today!
          </p>
        </Col>
      </Row> 
  )
}

export default Welcome
