import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Row, Col, Typography, Avatar, Upload, Modal, message, Dropdown } from "antd";
import { UploadOutlined, ExclamationCircleOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

const { Title, Text } = Typography;

const EditProject = () => {
    const  projectId  = "67c6ce54eca28a980463e475";
    const  siteId = "65d2f1a4e1a0b6f79dabcdef"
    const navigate = useNavigate();
    const [showDeactivate, setShowDeactivate] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [confirmProjectName, setConfirmProjectName] = useState("");
    const [loading, setLoading] = useState(false);
    const [projectData, setProjectData] = useState({
        projectName: '',
        projectAvatar: '',
        projectManager: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchProjectData();
    }, []);

    const fetchProjectData = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/sites/${siteId}/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            });
            const { projectName, projectAvatar, projectMember, projectStatus } = response.data;

            // Nếu project đã bị archived, chuyển hướng người dùng
            if (projectStatus === "archived") {
                message.error("This project has been moved to trash!");
                navigate("/site/team");
                return;
            }

            const manager = projectMember.find(member => member.roles.includes('projectManager'));

            setProjectData({
                projectName,
                projectAvatar,
                projectManager: manager ? manager._id.username : "Unknown",
                projectStatus
            });

            setImagePreview(projectAvatar);
        } catch (error) {
            console.error("Error fetching project data:", error);
            message.error("Failed to load project data.");
        }
    };

    const handleChange = (e) => {
        setProjectData({ ...projectData, [e.target.name]: e.target.value });
    };

    const handleFileChange = ({ file }) => {
        const fileReader = new FileReader();
        fileReader.onload = () => setImagePreview(fileReader.result);
        fileReader.readAsDataURL(file);
        setSelectedFile(file);
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("projectName", projectData.projectName);
        if (selectedFile) {
            formData.append("projectAvatar", selectedFile);
        }

        try {
            const response = await axios.put(`http://localhost:9999/sites/${siteId}/projects/${projectId}/project-setting`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            message.success("Project updated successfully!");
            setImagePreview(response.data.projectAvatar);
        } catch (error) {
            console.error("Error updating project:", error);
            message.error("Failed to update project.");
        }
    };
    const handleRemoveToTrash = async () => {
        if (confirmProjectName !== projectData.projectName) {
            message.error("Project name does not match.");
            return;
        }
        try {
            await axios.put(`http://localhost:9999/sites/${siteId}/projects/${projectId}/remove-to-trash`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });
            message.success("Project moved to trash!");
            navigate("/site/team");
        } catch (error) {
            console.error("Error moving project to trash:", error);
            message.error("Failed to move project to trash.");
        }
    };


    return (
        <div style={{ padding: "24px", minHeight: "100%" }}>
            <Row justify="space-between" align="middle" style={{ margin: "0 100px 20px" }}>
                <Col>
                    <Link to="/site/project">Projects</Link> / <Link to={`/site/project/${projectId}/settings`}>Project Setting</Link>
                    <Title level={3}>Project Setting</Title>
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
                                onClick={() => setIsDeleteModalVisible(true)}
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
                            <Avatar size={100} src={imagePreview || "default.jpg"} />
                        </Row>
                        <Form.Item >
                            <Upload showUploadList={false} beforeUpload={() => false} onChange={handleFileChange}>
                                <Button icon={<UploadOutlined />}>Upload Image</Button>
                            </Upload>
                        </Form.Item>

                        <Form layout="vertical">
                            <Form.Item label="Project Name">
                                <Input name="projectName" value={projectData.projectName} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item label="Project Manager">
                                <div style={{ backgroundColor: '#f0f0f0', padding: '8px', borderRadius: '6px', textAlign:'left' }}>
                                <Text>{projectData.projectManager}</Text>
                                </div>
                                
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" onClick={handleSave} loading={loading} style={{ width: "100%" }}>
                                    Save Changes
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
                        Confirm Remove to Trash
                    </span>
                }
                open={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>Cancel</Button>,
                    <Button key="confirm" type="primary" danger onClick={handleRemoveToTrash}>
                        Confirm
                    </Button>
                ]}
            >
                <p>Are you sure you want to move this project to trash?</p>
                <p>To confirm, type the project name: <strong>{projectData.projectName}</strong></p>
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