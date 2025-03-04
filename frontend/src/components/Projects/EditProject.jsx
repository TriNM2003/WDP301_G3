import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Row, Col, Typography, Dropdown, Breadcrumb, Avatar, Upload, Select, Modal, message } from "antd";
import { EllipsisOutlined, UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const axios = require('axios');
const { Title } = Typography;


const EditProject = () => {
    const [loading, setLoading] = useState(false);
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [confirmProjectName, setConfirmProjectName] = useState("");
    const [projectName, setProjectName] = useState("");
    const [projectAvatar, setProjectAvatar] = useState("")
    const [form, setForm] = useState({
        projectName: '',
        projectAvatar: '',
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Xử lý chọn ảnh và hiển thị ngay lập tức
    const handleFileChange = ({ file }) => {
        const fileReader = new FileReader();
        fileReader.onload = () => setImagePreview(fileReader.result);
        fileReader.readAsDataURL(file);
        setSelectedFile(file);
    };

    // Xử lý lưu thông tin user
    const handleSave = async () => {
        const formData = new FormData();
        formData.append("projectName", form.projectName);

        if (selectedFile) {
            formData.append("projectAvatar", selectedFile);  // Gửi file ảnh
        }

        axios.put('http://localhost:9999/projects/project-setting', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log(response.data);
                message.open({ content: 'Project updated successfully!', duration: 2, type: 'success' });
                setImagePreview(response.data.projectAvatar);  // Cập nhật ảnh Cloudinary
                setTimeout(window.location.reload(), 3000);
            })
            .catch(error => {
                message.error(error.response?.data?.message);
            });
    };


    const handleDeleteProject = () => {
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = () => {
        if (confirmProjectName === projectName) {
            setIsDeleteModalVisible(false);
            message.success(`Project "${projectName}" has been deleted.`);
            setConfirmProjectName("");
        } else {
            message.error("Project name does not match!");
        }
    };

    return (
        <div style={{ padding: "24px", minHeight: "100%" }}>
            <Row justify="space-between" align="middle" style={{ margin: "0 100px 20px" }}>
                {/* Breadcrumb */}
                <Col>
                    <Breadcrumb>
                        <Breadcrumb.Item><Link to="/site/project">Projects</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/site/project/project-setting">Project Setting</Link></Breadcrumb.Item>
                    </Breadcrumb>
                    <Row>
                        <Title level={3}>Project Setting</Title>
                    </Row>
                </Col>

                {/* More Options Button */}
                <Col>
                    <Dropdown
                        overlay={
                            <Button
                                type="primary"
                                danger
                                style={{
                                    width: "100%",
                                    maxWidth: "180px",
                                    height: "45px",
                                    fontSize: "16px",
                                    borderRadius: "6px",
                                    display: showDeactivate ? "block" : "none",
                                }}
                                onClick={handleDeleteProject}
                            >
                                Move to trash
                            </Button>
                        }
                        trigger={["click"]}
                        onOpenChange={(visible) => setShowDeactivate(visible)}
                    >
                        <Button shape="rectangle" icon={<EllipsisOutlined />} style={{ marginBottom: "10px" }} />
                    </Dropdown>
                </Col>
            </Row>

            <Row justify="center">
                <Col xs={24} sm={16} md={12}>
                    <Card style={{ padding: "0 100px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
                        <Row justify="center" style={{ marginBottom: '20px' }}>
                            <Avatar size={100} style={{ borderRadius: '0' }} src={imagePreview || "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/"} />
                        </Row>
                        <Form.Item label="Project Avatar">
                            <Upload
                                showUploadList={false}
                                beforeUpload={() => false}  // Ngăn tải lên tự động
                                onChange={handleFileChange}
                            >
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>
                        <Form layout="vertical">
                            <Form.Item label="Project Name">
                                <Input name="projectName" value={form.projectName} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item label="Project Manager">
                                <Select defaultValue="lucy" style={{ width: '100%', textAlign: 'left' }} options={[
                                    { value: 'jack', label: 'Jack', disabled: true },
                                    { value: 'lucy', label: 'Lucy', disabled: true },
                                    { value: 'Yiminghe', label: 'yiminghe', disabled: true },
                                    { value: 'disabled', label: 'Disabled', disabled: true },
                                ]} />
                            </Form.Item>

                            <Form.Item style={{ textAlign: "left" }}>
                                <Button type="primary" htmlType="submit" onClick={handleSave} loading={loading} style={{
                                    width: "100%",
                                    borderRadius: "0",
                                    fontSize: "16px",
                                    padding: "10px",
                                }}>
                                    Save Change
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            {/* Delete Confirmation Modal */}
            <Modal
                title={
                    <span>
                        <ExclamationCircleOutlined style={{ color: "red", fontSize: "24px", marginRight: "10px" }} />
                        Confirm Site Deactivation
                    </span>
                }
                open={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>Cancel</Button>,
                    <Button key="confirm" type="primary" danger onClick={handleConfirmDelete}>Delete</Button>
                ]}
            >
                <p>To confirm deletion, please type the project name: <strong>{projectName}</strong></p>
                <Input
                    placeholder="Enter project name"
                    value={confirmProjectName}
                    onChange={(e) => setConfirmProjectName(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default EditProject;