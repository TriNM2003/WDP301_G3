import React, { useState } from "react";
import { Form, Input, Button, Card, Row, Col, Typography, Dropdown, Breadcrumb, Avatar, Upload, Select, Modal, message } from "antd";
import { EllipsisOutlined, UploadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;

const EditProject = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [confirmProjectName, setConfirmProjectName] = useState("");
    const [projectName, setProjectName] = useState("Example Project");

    const handleSubmit = (values) => {
        console.log("Form values:", values);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            console.log("Changes saved!");
        }, 2000);
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
                                Delete Project
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
                            <Avatar size={100} style={{ borderRadius: '0' }} src="https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/" />
                        </Row>
                        <Form.Item>
                            <Upload showUploadList={false} beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>
                        <Form layout="vertical" form={form} onFinish={handleSubmit}>
                            <Form.Item label="Project Name" name="projectName" rules={[{ required: true, message: "This field is required!" }]}>
                                <Input placeholder="Enter project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
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
                                <Button type="primary" htmlType="submit" loading={loading} style={{
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