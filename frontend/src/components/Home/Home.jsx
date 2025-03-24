import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Carousel, Col, Collapse, Flex, Form, Input, message, Modal, Row, Space, Tooltip } from 'antd'
import Title from 'antd/es/typography/Title'
import { ArrowRightOutlined, EditOutlined, ExclamationCircleOutlined, GoogleCircleFilled, GoogleOutlined, GooglePlusCircleFilled, GooglePlusOutlined, LineChartOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import authAxios from '../../utils/authAxios'
import FormItemLabel from 'antd/es/form/FormItemLabel'
import FormItem from 'antd/es/form/FormItem'
function Home() {
  const { user, site, siteAPI } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  async function handleOpen() {
    setIsModalOpen(true);
  }
  async function handleCancel(){
    setIsModalOpen(false);
    form.resetFields();

  }

  async function handleContactAdministrator(values){
    try {
      setLoading(true);
      const emailSubject = "Request for a new site";
    const emailBody = `
      <div>
      <p style="text-align: left, ; margin-left: 2%"> <b>Dear Admin,</b> </p>
      <p style="text-align: left, ; margin-left: 7%">
        I am <b style="color:red">${user?.username}</b>, email: ${user?.email} I hope this email finds you well. <br />
        I would like to request the creation of a new site called <b style="color:blue">${values?.siteName}</b> on SkrumIO to manage issues on future projects.
      </p>
      <p style="text-align: right; margin-right: 10%">
         <b>Best regards,</b><br />
        <b style="color:red">${user?.username}</b>
      </p>
      <p style="text-align: center; color: gray; margin-top: 7%">
         This email was sent using Skrumio site creation request system
      </p>
    </div>
    `;
    const result = await authAxios.post(`${siteAPI}/request-site`, {emailSubject, emailBody});
    handleCancel();
    message.success(result.data, 2);
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false);
    }
    
  }

  return (
    <Row justify="space-around" style={{ height: "55vh", margin: "0 0 5% 0", background: " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../images/homepage/wellcome-bg.jpg') no-repeat center center fixed ", "background-size": "100%", "background-blend-mode": "multiply" }}>
      <Col span={15} align="start">
        <Title level={1} style={{ color: "white", margin: "5% 5% 0 5%" }}>Welcome back, {user?.username} 🔥</Title>
        <Title level={5} type='warning' style={{ margin: "0 5% 5% 5%" }}>Let's continue the work and achieve your goals! 🚀</Title>
        {site?._id && user?.roles?.some(role => role.roleName != "admin") ? (<Row align="middle" style={{ border: "1px solid white", margin: "0 5%", padding: "1% 3%" }}>
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
            user?.roles?.some(role => role.roleName != "admin") ?
            <Row align="middle" style={{ border: "1px solid white", margin: "0 5%", padding: "1% 3%" }}>
              <Col span={18}>
                <Title level={4} style={{ color: "white", margin: "0" }}>Dont have a site?</Title>
              </Col>
              <Col align="end" span={4}>
                  <Button icon={<PhoneOutlined />} onClick={handleOpen} loading={loading}> Contact Administrator</Button>
              </Col>
            </Row> : <></>
          )
        }

        {/* request site modal */}
      <Modal title="Requesting site creation" open={isModalOpen} onCancel={handleCancel} footer={false}>
        <Form form={form} onFinish={handleContactAdministrator}>
          <Form.Item label="Site name" name="siteName" rules={[{min: 3, message: "Site name must be at least 3 character"}]}>
              <Input/>
          </Form.Item>
          <div style={{display: 'flex', justifyContent:"right", gap: "2%"}}>
            <Button key="submit" type="primary" loading={loading} htmlType='submit'>
              Submit
            </Button>
            <Button key="back" onClick={handleCancel}>
              Return
            </Button>
          </div>
        </Form>
      </Modal>
        

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
