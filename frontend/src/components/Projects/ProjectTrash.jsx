import React, { useState, useEffect, useContext } from "react";
import { Table, Input, Button, Dropdown, Modal, Typography, Avatar, Breadcrumb, Col, Row, message } from "antd";
import { MoreOutlined, SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { AppContext } from '../../context/AppContext'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;

const ProjectTrash = () => {
    const [projects, setProjects] = useState([]);
    const { showNotification, siteAPI, site, accessToken, user } = useContext(AppContext);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState("");
    const [searchText, setSearchText] = useState("");
    const [confirmProjectName, setConfirmProjectName] = useState("");
    const [hasAccess, setHasAccess] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (site._id && accessToken) {
            fetchProjects();
        }

    }, [site, accessToken]);

    const fetchProjects = async () => {
        try {
            const response = await axios.get(`http://localhost:9999/sites/${site._id}/projects/trash`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            });

            const processedProjects = response.data.map(project => {
                const manager = project.projectMember?.find(member => member.roles.includes("projectManager")) || null;

                return {
                    ...project,
                    projectManager: manager && manager._id ? manager._id.username : "Unknown",
                    isUserManager: manager && manager._id && manager._id._id === user._id // Kiểm tra nếu user là projectManager
                };
            });

            // Kiểm tra user có role gì trong site
            const userInSite = site.siteMember.find(member => member._id === user._id);
            const userSiteRoles = userInSite ? userInSite.roles : [];

            // Nếu user là siteOwner, hiển thị tất cả project
            if (userSiteRoles.includes("siteOwner")) {
                setProjects(processedProjects);
                return;
            }

            // Nếu user là projectManager, chỉ hiển thị các project mà họ quản lý
            const userManagedProjects = processedProjects.filter(project => project.isUserManager);

            if (userManagedProjects.length > 0) {
                setProjects(userManagedProjects);
                return;
            }

            // Nếu user không có quyền, ẩn bảng và hiển thị "Nothing to see"
            setHasAccess(false);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const showModal = (record, type) => {
        setSelectedProject(record);
        setModalType(type);
        setIsModalVisible(true);
        setConfirmProjectName("");
    };

    const handleConfirm = async () => {
        if (!selectedProject) return;
        try {
            if (modalType === "Restore") {
                await axios.put(`http://localhost:9999/sites/${site._id}/projects/${selectedProject._id}/restore`, {}, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                });
                message.success(`Project "${selectedProject.projectName}" has been restored successfully.`);
                showNotification("success", "Project Restored", `Project "${selectedProject.projectName}" has been restored successfully.`);
            } else if (modalType === "Delete") {
                if (confirmProjectName !== selectedProject.projectName) {
                    alert("Project name does not match!");
                    return;
                }
                await axios.delete(`http://localhost:9999/sites/${site._id}/projects/${selectedProject._id}/delete`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                });
                message.success(`Project "${selectedProject.projectName}" has been deleted permanently.`);
                showNotification("success", "Project Deleted", `Project "${selectedProject.projectName}" has been deleted permanently.`);
            }
            setIsModalVisible(false);
            fetchProjects();
        } catch (error) {
            console.error(`Error performing ${modalType.toLowerCase()} project:`, error);
        }
    };

    const filteredProjects = projects.filter((project) =>
        project.projectName.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "Project Avatar",
            dataIndex: "projectAvatar",
            key: "avatar",
            render: (avatar) => (
                <Avatar src={avatar !== "default.jpg" ? avatar : "https://via.placeholder.com/40"} />
            )
        },
        {
            title: "Name",
            dataIndex: "projectName",
            key: "name",
            sorter: (a, b) => a.projectName.localeCompare(b.projectName),
            render: (text) => <strong>{text}</strong>
        },
        {
            title: "Project Manager",
            dataIndex: "projectManager",
            key: "projectManager",
            sorter: (a, b) => a.projectManager.localeCompare(b.projectManager),
            render: (manager) => manager || "Unknown"
        },
        {
            title: "Moved to Trash",
            dataIndex: "updatedAt",
            key: "updatedAt",
            sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: "Actions",
            key: "actions",
            render: (text, record) => (
                <Dropdown
                    overlay={
                        <div style={{ background: "white", padding: "10px", borderRadius: "5px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                            {record.isUserManager && (
                                <div style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "5px" }}>
                                    <Button type="link" onClick={() => showModal(record, "Restore")}>Restore Project</Button>
                                </div>
                            )}
                            <div style={{ paddingTop: "5px" }}>
                                <Button type="link" danger onClick={() => showModal(record, "Delete")}>Delete Project</Button>
                            </div>
                        </div>
                    }
                    trigger={["click"]}
                >
                    <Button icon={<MoreOutlined />} type="text" />
                </Dropdown>
            )
        }
    ];

    return (
        <div style={{ padding: "24px", minHeight: "100%", background: "white" }}>
            <Breadcrumb>
                <Breadcrumb.Item><Link to="/projects">Project</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Project Trash</Breadcrumb.Item>
            </Breadcrumb>

            <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                <Col><Title level={3}>Project Trash</Title></Col>
            </Row>
            {hasAccess ? (
                <>
                    <Input
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        style={{ width: 250, marginBottom: "16px" }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    <Table
                        style={{ border: '1px solid #d9d9d9', borderRadius: '5px', boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                        dataSource={filteredProjects}
                        columns={columns}
                        pagination={{ pageSize: 6 }}
                        rowKey="_id"
                    />
                </>
            ) : (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <Title level={1} style={{ color: "#bbb" }}>Nothing to see</Title>
                </div>
            )}

            <Modal
                title={
                    <span>
                        <ExclamationCircleOutlined style={{ color: modalType === "Delete" ? "red" : "#1890ff", fontSize: "24px", marginRight: "10px" }} />
                        {modalType} Project
                    </span>
                }
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>Cancel</Button>,
                    modalType === "Delete" && (
                        <Button key="confirm" type="primary" danger onClick={handleConfirm} disabled={confirmProjectName !== selectedProject?.projectName}>
                            Confirm Delete
                        </Button>
                    ),
                    modalType === "Restore" && (
                        <Button key="confirm" type="primary" onClick={handleConfirm}>
                            Confirm Restore
                        </Button>
                    )
                ]}
            >
                <p>Are you sure you want to {modalType.toLowerCase()} <strong>{selectedProject?.projectName}</strong>?</p>

                {modalType === "Delete" && (
                    <>
                        <p>To confirm, type the project name below:</p>
                        <Input
                            placeholder="Enter project name"
                            value={confirmProjectName}
                            onChange={(e) => setConfirmProjectName(e.target.value)}
                        />
                    </>
                )}
            </Modal>
        </div>
    );
};

export default ProjectTrash;