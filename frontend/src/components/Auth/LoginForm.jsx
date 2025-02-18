import React, {useContext, useEffect, useState} from 'react'
import {Form, Input, Button, Typography, Divider, Modal, Row, Col, message, Flex } from "antd";
import { GoogleOutlined, EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined } from "@ant-design/icons";
import { blue, gray } from "@ant-design/colors";
import axios from "axios";
import {AppContext} from "../../context/AppContext";
import { useNavigate } from 'react-router-dom';


const { Title, Text, Link } = Typography;

const LoginForm = () => {
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setUser, authAPI} = useContext(AppContext);

    const loginAPI = `${authAPI}/login`;
    const googleLoginAPI = `${authAPI}/loginByGoogle`;


    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if(token){
        const username = urlParams.get("username");
        const email = urlParams.get("email");
        const password = urlParams.get("password");
        const status = urlParams.get("status");
        console.log(token, username, email, password, status);
        // xoa info tren thanh saerch
        window.history.replaceState({}, document.title, "/auth/login");

        if (status === 'deactivated') {
          messageApi.open({
            type: "warning",
            content: "Your account is deactivated!",
            duration: 3
          })
        } else if (status === 'inactive') {
          messageApi.open({
            type: "warning",
            content: "Your account is not activated! Please active your account",
            duration: 3
          })
        } else if(status === 'active'){
          messageApi.open({
            type: "success",
            content: "Login by Google successfully! Redirecting to homepage...",
            duration: 3
          }).then(() => nav('/home'));
        }else{
          messageApi.open({
            type: "error",
            content: "Cancel google login!",
            duration: 3
          })
        }

      
      }
    }, [messageApi, nav])

  const handleLogin = async () => {
    try {
        setLoading(true);
        const req = {
            username: username,
            password: password
        }
        const res = await axios.post(loginAPI, req, {withCredentials: true});
        return res.data
    } catch (error) {
      if (error.response?.status === 403) { 
        localStorage.setItem("activationToken", error.response.data.token);
        message.warning("Your account has not been activated. You need to activate it to access the system.");
        setTimeout(() => {
            nav('/active-account'); 
        }, 1000);
      }
        setTimeout(() => {
            setLoading(false);
            messageApi.open({
              type: "error",
              content: error.response.data.message,
            });
          }, 1000);
        setLoading(false);
        throw new Error("Login error: ", error);
    }
  };

  const handleLoginByGoogle = async () => {
    window.open(googleLoginAPI, "_self");
  }


  const submitForm = async (option) => {
    try {
        //login by username and password
        if(option === 'normal'){
            const loginResult = await handleLogin();
            switch(loginResult.user.status){
                case 'inactive':
                    setTimeout(() => {
                        setLoading(false);
                        messageApi.open({
                          type: "warning",
                          content: "Your account is not activated! Please active your account",
                        });
                      }, 2000);
                      break;
                case 'deactivate':
                    setTimeout(() => {
                        setLoading(false);
                        messageApi.open({
                          type: "warning",
                          content: "Your account is deactivated!",
                        });
                      }, 2000);
                      break;
               default:
                if(loginResult.accessToken){
                    messageApi.open({
                        type: "success",
                        content: "Login successfully! Redirecting to homepage...",
                        duration: 2
                    }).then(() => {
                        localStorage.setItem("accessToken", loginResult.accessToken);
                        localStorage.setItem("accessTokenExp", loginResult.accessTokenExp);
                        localStorage.setItem("userId", loginResult.user.id);
                        setUser(loginResult.user);
                        setLoading(false);
                        nav('/home')
                    });
                }else{
                    setTimeout(() => {
                        setLoading(false);
                        messageApi.open({
                          type: "error",
                          content: "Token not found!",
                        });
                      }, 1000);
                }
                break;
            }
        }else if(option === 'google'){
            handleLoginByGoogle();
        }
         
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <div>
        {contextHolder} {/* Hiển thị thông báo */}
      <Modal
        open={true}
        footer={null}
        closable={false}
        width={900}
        centered
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ padding: "30px" }}>
          <Row gutter={10} align="middle">
            <Col span={24} style={{ textAlign: "center", display: "inline" }}>
              <img
                src="/images/logo-placeholder-image.png"
                alt="SkrumIO Logo"
                style={{ width: 70 }}
              />
              <Title>SkrumIO</Title>
            </Col>
          </Row>

          <Row gutter={24} align="middle">

            {/* Cột bên trái (Form đăng nhập) */}
            <Col span={11}>
              <Title level={4} style={{ textAlign: "center" }}>
                Log in
              </Title>

              <Form layout="vertical">
                <Form.Item label="Username">
                  <Input placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)}/>
                </Form.Item>

                <Form.Item label="Password">
                  <Input.Password
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                {/* Nút Log in với hiệu ứng loading */}
                <Button
                  type="primary"
                  block
                  style={{
                    backgroundColor: loading ? blue[4] : blue[6],
                    color: gray[13],
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => submitForm('normal')}
                  disabled={loading}
                >
                  {loading ? <LoadingOutlined spin /> : "Log in"}
                </Button>

                <Flex gap="middle" justify='space-between' style={{marginTop: 10}}>
                  <Link href="/auth/register">
                    Don't have an account?
                  </Link>
                  <Link href="/forgot-password" >
                    Forgot your password?
                  </Link>
                </Flex>
              </Form>
            </Col>
            

            {/* Cột phân chia */}
            <Col span={2}>
              <Divider type="vertical" style={{ height: "100%", background: "#ccc", width: "1px" }} />
            </Col>

            {/* Cột bên phải (Google Login) */}
            <Col span={11} style={{ textAlign: "center" }}>
              <Divider>Or</Divider>

              {/* Nút Google Custom */}
              <Button
                style={{
                  width: "100%",
                  backgroundColor: "#fff",
                  color: "#000",
                  borderRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  height: "40px",
                  border: "1px solid #ccc",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                }}
                icon={<GoogleOutlined style={{ fontSize: "20px", marginLeft: "10px", color: "#FF0000" }} />}
                onClick={() => submitForm('google')}
              >
                Continue with Google
              </Button>

            </Col>

          </Row>
        </div>
      </Modal>
    </div>
  )
}

export default LoginForm