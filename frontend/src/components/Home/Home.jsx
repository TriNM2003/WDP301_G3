import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Carousel, Col, Collapse, Row, Space } from 'antd'
import Title from 'antd/es/typography/Title'
import { ArrowRightOutlined, GoogleCircleFilled, GoogleOutlined, GooglePlusCircleFilled, GooglePlusOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
function Home() {
  const {user, site} = useContext(AppContext);
  const navigate = useNavigate();
  const [siteAccess, setSiteAccess] = useState("active");
  const checkSiteAccess = () => {
    if(site?.siteStatus === "deactivated"){
      setSiteAccess("deactivated")
      // return false;
    }else if(user?.roles?.some(role => role.roleName === "admin")){
      setSiteAccess("admin")
      // return false;
    }
  }
  useEffect(() => {
    checkSiteAccess();
  }, [site, user])
  
  return (
    <Row  justify="space-around"  style={{height:"55vh", margin: "0 0 5% 0" , background: " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../images/homepage/wellcome-bg.jpg') no-repeat center center fixed ", "background-size": "100%", "background-blend-mode": "multiply" }}>
        <Col span={15} align="start">
        {siteAccess === "active" ? 
          <>
          <Title level={1} style={{ color: "white", margin:"5% 5% 0 5%" }}>Welcome back, {user?.username} 🔥</Title>
          <Title level={5} type='warning' style={{ margin:"0 5% 5% 5%" }}>Let's continue the work and achieve your goals! 🚀</Title>
          <Row align="middle" style={{border:"1px solid white", margin:"0 5%", padding:"1% 3%"}}>
              <Col span={18}>
                    <Title level={4} style={{color:"white", margin:"0"}}>🖥️ Site</Title>
                    <p style={{color:"white", margin:"0"}}>{site.siteName}</p>
                </Col>
                <Col align="end" span={4} >
                    <Button onClick={()=>{navigate("/site")}} icon={<ArrowRightOutlined />} iconPosition='end' color='cyan' variant='solid' style={{border:"0"}}>Go to site</Button>
                </Col>

          </Row>
          </>
          : (siteAccess === "admin" ? 

            <>
            <Title level={1} style={{ color: "white", textAlign: 'center', margin:"5% 5% 0 5%" }}>Admin cannot access site</Title>
            <Title level={2} style={{ color: "white", textAlign: 'center', margin:"5% 5% 0 5%" }}>Click on profile in top right to start managing sites</Title>
            </>
            :
            <Title level={1} style={{ color: "white", textAlign: 'center', margin:"5% 5% 0 5%" }}>Site is deactivated</Title>
          )
          
        }

              
        </Col>

      </Row>
  )
}

export default Home
