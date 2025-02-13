import React from 'react'
import { Button, Card, Carousel, Col, Collapse, Row, Space } from 'antd'
import Title from 'antd/es/typography/Title'
import { ArrowRightOutlined, GoogleCircleFilled, GoogleOutlined, GooglePlusCircleFilled, GooglePlusOutlined, MailOutlined } from '@ant-design/icons'
import { Link, Outlet } from 'react-router-dom'
import Welcome from '../../components/Home/Welcome'
import Home from '../../components/Home/Home'
function HomePage() {
  return (
    <div>
      
      <Outlet/>
      {/* <Row>
        <Col span={24}>
          <Title level={3} style={{ textAlign: "center" }}>Frequently Asked Questions</Title>
          <Collapse defaultActiveKey={["1"]}  accordion={true} ghost size='large'>
            <Collapse.Panel header="What is SkrumIO?" key="1" showArrow={false} >
              <p>SkrumIO is an agile project management tool that helps teams track work efficiently.</p>
            </Collapse.Panel>
            <Collapse.Panel header="How does task management work?" key="2" showArrow={false} >
              <p>You can create, assign, and track tasks, ensuring smooth workflow execution.</p>
            </Collapse.Panel>
            <Collapse.Panel header="Can I integrate SkrumIO with other tools?" key="3" showArrow={false}  >
              <p>Yes! SkrumIO supports integration with GitHub, Jira, and Slack for seamless collaboration.</p>
            </Collapse.Panel>
          </Collapse>
        </Col>
      </Row> */}
      <Row gutter={[24, 24]} justify="space-around" style={{ margin: "2% 0 5% 0" }}>
        <Col span={24} align="center">
          <Title level={2}>⚡ Plan and manage projects efficiently</Title>
          <Title style={{ width: "60%" }} level={5} italic type='secondary'>From small teams to enterprise collaboration, Skrumio helps break down complex projects into manageable tasks. Organize work, track progress, set milestones, and collaborate seamlessly to achieve success.</Title>
        </Col>
        <Col sm={12} md={5} align="start">
          <Card
            hoverable
            style={{
              borderRadius: "5  px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              background: "#fff",
              height: "55vh"
            }}
            cover={<img src="../images/homepage/adv_1.jpg" style={{height: "20vh"}} />}
          >
            <Title level={4}>Align teams with clear goals</Title>
            <p style={{ color: "#555" }}>Ensure everyone stays on the same page with well-defined objectives, structured workflows, and transparent communication.</p>
            <br />
            <a href="#" style={{ color: "#00A862", fontWeight: "bold", display: "block" }}>
              Try →
            </a>
          </Card>
        </Col>
        <Col sm={12} md={5} align="start">
          <Card
            hoverable
            style={{
              borderRadius: "5  px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              background: "#fff",
              height: "55vh"
            }}
            cover={<img src="../images/homepage/adv_2.jpg" style={{height: "20vh"}} />}
          >
            <Title level={4}>Track work your way</Title>
            <p style={{ color: "#555" }}>Customize task views, manage priorities, and adapt workflows to suit your team’s needs for maximum efficiency.</p>
            <br />
            <a href="#" style={{ color: "#00A862", fontWeight: "bold", display: "block" }}>
              Try →
            </a>
          </Card>
        </Col>
        <Col sm={12} md={5} align="start">
          <Card
            hoverable
            style={{
              borderRadius: "5  px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              background: "#fff",
              height: "55vh"
            }}
            cover={<img src="../images/homepage/adv_3.jpg" style={{height: "20vh"}} />}
          >
            <Title level={4}>Stay connected with real-time updates</Title>
            <p style={{ color: "#555" }}>Receive instant notifications on task changes, project progress, and team activities to keep everything on track.</p>
            <br />
            <a href="#" style={{ color: "#00A862", fontWeight: "bold", display: "block" }}>
              Try →
            </a>
          </Card>
        </Col>
        <Col sm={12} md={5} align="start">
          <Card
            hoverable
            style={{
              borderRadius: "5  px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              background: "#fff",
              height: "55vh"
            }}
            cover={<img src="../images/homepage/adv_4.jpg" style={{height: "20vh"}} />}
          >
            <Title level={4}>Optimize with powerful insights</Title>
            <p style={{ color: "#555" }}>Monitor performance, analyze trends, and generate detailed reports to make data-driven decisions and improve productivity.</p>
            <br />
            <a href="/login" style={{ color: "#00A862", fontWeight: "bold", display: "block" }}>
              Try →
            </a>
          </Card>
        </Col>




      </Row>
      <Row>
        <Col span={24}>
          <Carousel style={{ margin: "3%" }} autoplay autoplaySpeed={2000} infinite={true} dotPosition="right">
            <div >
              <Title level={3} style={{ color: "white", height: "50vh", background: " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../images/homepage/carousel_1.jpg') no-repeat center center fixed ", "background-size": "100%", "background-blend-mode": "multiply" }} >

              </Title>
            </div>
            <div>
              <Title level={3} style={{ color: "white", height: "50vh", background: " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../images/homepage/carousel_2.jpg') no-repeat center center fixed ", "background-size": "100%", "background-blend-mode": "multiply" }}  >

              </Title>
            </div>
            <div>
              <Title level={3} style={{ color: "white", height: "50vh", background: " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../images/homepage/carousel_3.jpg') no-repeat center center fixed ", "background-size": "100%", "background-blend-mode": "multiply" }}  >

              </Title>
            </div>
            <div>
              <Title level={3} style={{ color: "white", height: "50vh", background: " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../images/homepage/carousel_4.jpg') no-repeat center center fixed ", "background-size": "100%", "background-blend-mode": "multiply" }}  >

              </Title>
            </div>
          </Carousel></Col>
      </Row>
    </div>
  )
}

export default HomePage
