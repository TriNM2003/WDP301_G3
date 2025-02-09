import React from "react";
import { Layout, Form, Input, Button, Typography, Divider, Row, Col, Space } from "antd";
import { GoogleOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const { Title, Text, Link } = Typography;

const Register = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/Register_Background_Image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "15px",
          maxWidth: "850px",
          width: "100%",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Row gutter={32} align="middle">
          {/* Cột bên trái - Form đăng ký */}
          <Col span={14}>
            <Title level={2} style={{ marginBottom: 10 }}>
              Create an account
            </Title>
            <Text>
              Already have an account? <Link href="#">Log in</Link>
            </Text>

            <Form layout="vertical" style={{ marginTop: 20 }}>
              <Form.Item label="Username">
                <Input 
                // placeholder="Enter your username" 
                />
              </Form.Item>

              <Form.Item label="Email address">
                <Input type="email" 
                // placeholder="Enter your email" 
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

              <Form.Item label="Re-enter password">
                <Input.Password
                  // placeholder="Re-enter your password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Button
                type="primary"
                block
                style={{
                  backgroundColor: "#ccc",
                  border: "none",
                  cursor: "not-allowed",
                  height: "45px",
                  fontSize: "16px",
                  borderRadius: "25px",
                }}
                disabled
              >
                Register
              </Button>
            </Form>
          </Col>

          {/* Cột phân chia */}
          <Col span={1}>
            <Divider type="vertical" style={{ height: "100%", background: "#ccc", width: "1px" }} />
          </Col>

          {/* Cột bên phải - Đăng ký với Google */}
          <Col span={9} style={{ textAlign: "center" }}>
            <Divider>Or</Divider>

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
                height: "45px",
                border: "1px solid #ccc",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
              }}
              icon={<GoogleOutlined style={{ fontSize: "20px", marginRight: "10px" }} />}
              onClick={() => alert("Google Signup Clicked")}
            >
              Sign up with Google
            </Button>

            <Text style={{ display: "block", marginTop: "10px" }}>
              By signing up, you agree to the{" "}
              <Link href="#">Terms of Service</Link> and acknowledge you’ve read
              our <Link href="#">Privacy Policy</Link>.
            </Text>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Register;
