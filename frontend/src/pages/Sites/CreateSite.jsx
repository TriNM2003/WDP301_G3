import React, { useState } from "react";
import { Layout, Form, Input, Button, Typography, Card, message, Upload } from "antd";
import { LeftOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import authAxios from "../../utils/authAxios";

const { Title, Text } = Typography;

const siteApi = "http://localhost:9999/site";

const CreateSite = () => {
  const [fileList, setFileList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const nav = useNavigate();

  // hien thi avatar sau khi upload
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    // giu lai file cuoi cung
    return e?.fileList.slice(-1);
  };


  const handleAvatarChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Chỉ giữ lại một file duy nhất
  };


  const handleCreateSite = async () => {
    try {
        await form.validateFields();
        const values = form.getFieldsValue();
        const formData = new FormData();
        formData.append("siteName", values.siteName);
        formData.append("siteDescription", values.siteDescription);
        if(fileList[0]){
          formData.append("siteAvatar", fileList[0].originFileObj);
          console.log("has file");
        }
        const response = await authAxios.post(`${siteApi}/create`, formData,{
          headers: { 
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            'Content-Type': 'multipart/form-data'
        }
      }
        );
        
        console.log("response: ", response.data);

        messageApi.open({
            type: 'success',
            content: 'Create site successfully!',
            duration: 2
        }).then(res => nav("/site"))
    } catch (error) {
        messageApi.open({
            type: 'error',
            content: error.response.data.message,
            duration: 2
        })
    }
  };

 
  return (
    <Layout
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/images/sites/create_site_background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "5%"
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
           {/* site name input */}
          <Form.Item label="Site name" name="siteName"
            rules={[
                { required: true, message: "Site name is required!" },
                { min: 3, message: "Site name must be at least 3 character"}
            ]}
            hasFeedback
          >
            <Input
              placeholder="Site name"
            />
          </Form.Item>

            {/* site description input */}
          <Form.Item label="Site description" name="siteDescription"
            hasFeedback
          >
            <Input
              placeholder="Site description"
            />
          </Form.Item>

          {/* site avatar input */}
          <Form.Item label="Avatar" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload listType="picture" 
            beforeUpload={() => false} // Ngăn upload tự động
            onChange={handleAvatarChange} // Giới hạn số file
            >
              {fileList.length < 1 && (
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            )}
            </Upload>
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
