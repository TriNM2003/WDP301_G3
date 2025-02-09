import React from "react";
import { Layout, Form, Input, Button, Typography, Divider, Modal, Row, Col, Space } from "antd";
import { GoogleOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {grey} from "@ant-design/colors"
const { Title, Text, Link } = Typography;

const Login = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/Login_Background_Image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Modal
        open={true}
        footer={null}
        closable={true}
        width={900}
        centered
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ padding: "30px" }}>
          <Row gutter={10} align={"middle"}>
            <Col span={24} style={{textAlign: 'center', display: 'inline'}}>
              <img
                src="/images/logo-placeholder-image.png"
                alt="SkrumIO Logo"
                style={{ width: 70}}
              />
              <Title>
                SkrumIO
              </Title>
            </Col>
          </Row>

          <Row gutter={24} align="middle">
            {/* Cột bên trái (Google Login) */}
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
                onClick={() => alert("Google Login Clicked")}
              >
                Continue with Google
              </Button>

              <Text style={{ display: "block", marginTop: "10px" }}>
                By signing up, you agree to the{" "}
                <Link href="#">Terms of Service</Link> and acknowledge you’ve
                read our <Link href="#">Privacy Policy</Link>.
              </Text>
            </Col>

            {/* Cột phân chia */}
            <Col span={2}>
              <Divider type="vertical" style={{ height: "100%", background: "#ccc", width: "1px" }} />
            </Col>

            {/* Cột bên phải (Form đăng nhập) */}
            <Col span={11}>
              <Title level={4} style={{ textAlign: "center" }}>
                Log in
              </Title>

              <Form layout="vertical">
                <Form.Item label="Username">
                  <Input 
                  // placeholder="Enter your username" 
                  />
                </Form.Item>

                <Form.Item label="Password">
                  <Input.Password
                    // placeholder="Enter your password"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>

                <Link href="#" style={{ float: "right", marginBottom: 10 }}>
                  Forgot your password?
                </Link>

                <Button
                  type="primary"
                  block
                  style={{
                    backgroundColor: "#ccc",
                    border: "none",
                    cursor: "not-allowed",
                  }}
                  disabled
                >
                  Log in
                </Button>
              </Form>
            </Col>
          </Row>

          {/* Footer */}
          <Divider />
          <div style={{ textAlign: "center"}}>
            <Text type="secondary">
              <Space size="middle">
                <Link href="#">About</Link>
                <Link href="#">Help Center</Link>
                <Link href="#">Terms of Service</Link>
                <Link href="#">Privacy Policy</Link>
                <Link href="#">Cookie Policy</Link>
              </Space>
            </Text>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Login;
