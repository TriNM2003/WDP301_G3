import React, { useState } from "react";
import { Layout, Form, Input, Button, Typography, Card, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const { Title, Text } = Typography;

const CreateSite = () => {
  const [siteName, setSiteName] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const nav = useNavigate();

  const handleCreateSite = async () => {
    try {
        await form.validateFields();
        messageApi.open({
            type: 'success',
            content: 'Create site successfully!',
            duration: 2
        }).then(res => nav("/site"))
    } catch (error) {
        messageApi.open({
            type: 'error',
            content: error.message,
            duration: 2
        })
    }
  };

  return (
    <Layout
      style={{
        height: "calc(100vh - 64px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/sites/create_site_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
    {contextHolder}
      <Card
        style={{
          width: 800,
          padding: "10px",
          borderRadius: "30px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "left",
        }}
      >
        <Button
          type="link"
          icon={<LeftOutlined />}
          style={{ marginBottom: 10, color: "#333" }}
          onClick={() => nav("/home")}
        >
          Go back
        </Button>

        <Title level={1} style={{ marginBottom: 50, paddingLeft: '100px', paddingRight: '100px', fontWeight: 'normal' }}>
          Create your first site to start managing your projects
        </Title>

        <Form layout="vertical" form={form} onFinish={handleCreateSite} style={{paddingLeft: '100px', paddingRight: '100px'}}>
          <Form.Item label="Site name" name="siteName"
            rules={[
                { required: true, message: "Site name is required!" },
            ]}
            hasFeedback
          >
            <Input
              placeholder="Site name"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              style={{width: '50%'}}
            />
          </Form.Item>

          <Button
            type="primary"
            block
            htmlType="submit"
            style={{
              border: "none",
              height: "40px",
              fontSize: "16px",
              width: '30%'
            }}
          >
            Create site
          </Button>
        </Form>
      </Card>
    </Layout>
  );
};

export default CreateSite;
