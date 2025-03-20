import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Carousel, Col, Collapse, Row, Space, Tooltip } from 'antd'
import Title from 'antd/es/typography/Title'
import { ArrowRightOutlined, EditOutlined, ExclamationCircleOutlined, GoogleCircleFilled, GoogleOutlined, GooglePlusCircleFilled, GooglePlusOutlined, LineChartOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
function Home() {
  const { user, site } = useContext(AppContext);
  const navigate = useNavigate();


  return (
    <Row justify="space-around" style={{ height: "55vh", margin: "0 0 5% 0", background: " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../images/homepage/wellcome-bg.jpg') no-repeat center center fixed ", "background-size": "100%", "background-blend-mode": "multiply" }}>
      <Col span={15} align="start">
        <Title level={1} style={{ color: "white", margin: "5% 5% 0 5%" }}>Welcome back, {user?.username} 🔥</Title>
        <Title level={5} type='warning' style={{ margin: "0 5% 5% 5%" }}>Let's continue the work and achieve your goals! 🚀</Title>
        {site ? (<Row align="middle" style={{ border: "1px solid white", margin: "0 5%", padding: "1% 3%" }}>
          <Col span={18}>
            <Title level={4} style={{ color: "white", margin: "0" }}>🖥️ Site</Title>
            <p style={{ color: "white", margin: "0" }}>{site.siteName}</p>
          </Col>
          <Col align="end" span={4} >
            {site?.siteStatus == "active" &&
              <Button onClick={() => { navigate("/site") }} icon={<ArrowRightOutlined />} iconPosition='end' color='cyan' variant='solid' style={{ border: "0" }}>Go to site</Button>
            }
            {site?.siteStatus == "deactivated" &&
              <Button danger disabled icon={<ExclamationCircleOutlined />}> Site is deactivated</Button>
            }
          </Col>

        </Row>)
          : (
            <Row align="middle" style={{ border: "1px solid white", margin: "0 5%", padding: "1% 3%" }}>
              <Col span={18}>
                <Title level={4} style={{ color: "white", margin: "0" }}>Dont have a site?</Title>
              </Col>
              <Col align="end" span={4}>
                <Tooltip title="Comming soon!">
                  <Button disabled icon={<PhoneOutlined />}> Contact Administrator</Button>
                </Tooltip>
              </Col>
            </Row>
          )
        }
        

        {/* 
        //   : (userer === "admin" ?

        //     <>
        //       <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "3%" }}>
        //         <Title level={1} style={{ color: "white", textAlign: 'center', margin: "10% 5% 2% 5%", width: "100%" }}>Welcome back, Administrator</Title>
        //         <Button onClick={() => { navigate("/admin/manage-sites") }} icon={<EditOutlined />} iconPosition='start' color='cyan' variant='solid'>Manage sites</Button>
        //         <Button onClick={() => { navigate("/admin/dashboard") }} icon={<LineChartOutlined />} iconPosition='start' color='cyan' variant='solid'>Dashboard</Button>
        //       </div>
        //     </>
        //     :
        //     <Title level={1} style={{ color: "white", textAlign: 'center', margin: "5% 5% 0 5%" }}>Site is deactivated</Title>
        //   )

      // } */}


      </Col>

    </Row>
  )
}

export default Home
