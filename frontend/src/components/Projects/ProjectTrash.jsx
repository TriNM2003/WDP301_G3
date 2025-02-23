import React, { useState } from "react";
import { Table, Input, Button, Dropdown, Modal, Typography, Avatar, Select, Breadcrumb, Col, Row } from "antd";
import { MoreOutlined, SearchOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Option } = Select;

const ProjectTrash = () => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalType, setModalType] = useState("");
    const [searchText, setSearchText] = useState("");

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const showModal = (record, type) => {
        setSelectedProject(record);
        setModalType(type);
        setIsModalVisible(true);
    };

    const handleConfirm = () => {
        console.log(`${modalType} project: ${selectedProject.name}`);
        setIsModalVisible(false);
    };

    const data = [
        {
            key: "1",
            name: "Test-1",
            removeBy: "Digger",
            projectManager: { name: "Trigger", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/" },
            movedOn: "Jan 07, 2025",
            deletedIn: "In 17 days"
        },
        {
            key: "2",
            name: "TestProject",
            removeBy: "Miner",
            projectManager: { name: "Trigger", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/" },
            movedOn: "Jan 13, 2025",
            deletedIn: "In 24 days"
        },
        {
            key: "3",
            name: "Go to market sample",
            removeBy: "Business",
            projectManager: { name: "Slider", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/" },
            movedOn: "Jan 13, 2025",
            deletedIn: "In 24 days"
        },
        {
            key: "4",
            name: "WDP",
            removeBy: "Miner",
            projectManager: { name: "Miner", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/" },
            movedOn: "Jan 13, 2025",
            deletedIn: "In 24 days"
        },
        {
            key: "5",
            name: "WDP301",
            removeBy: "Hamburger",
            projectManager: { name: "Hamburger", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/" },
            movedOn: "Jan 13, 2025",
            deletedIn: "In 24 days"
        },
        {
            key: "6",
            name: "Project management",
            removeBy: "Business",
            projectManager: { name: "Licker", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/" },
            movedOn: "Feb 19, 2025",
            deletedIn: "In 60 days"
        }
    ];

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={`https://api.dicebear.com/6.x/initials/svg?seed=${record.name}`} style={{ marginRight: "8px" }} />
                    <span>{text}</span>
                </div>
            )
        },
        {
            title: "Remove by",
            dataIndex: "removeBy",
            key: "removeBy",
            sorter: (a, b) => a.type.localeCompare(b.type)
        },
        {
            title: "Project Manager",
            dataIndex: "projectManager",
            key: "projectManager",
            sorter: (a, b) => a.projectManager.name.localeCompare(b.projectManager.name),
            render: (lead) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar src={lead.avatar} style={{ marginRight: "8px" }} />
                    <span>{lead.name}</span>
                </div>
            )
        },
        {
            title: "Moved to trash on",
            dataIndex: "movedOn",
            key: "movedOn",
            sorter: (a, b) => new Date(a.movedOn) - new Date(b.movedOn)
        },
        {
            title: "Permanently deleting",
            dataIndex: "deletedIn",
            key: "deletedIn"
        },
        {
            title: "",
            key: "actions",
            render: (text, record) => (
                <Dropdown
                    overlay={
                        <div style={{ background: "white", padding: "10px", borderRadius: "5px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                            <div style={{borderBottom: "1px solid #f0f0f0"}}>
                            <Button type="link" onClick={() => showModal(record, "Restore")}>Restore Project</Button>
                            </div>
                            <div>
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
        <div style={{ padding: "24px", minHeight: "100vh", background: "#fafafa" }}>
            {/* Header */}
            <Breadcrumb>
                <Breadcrumb.Item><Link>Project</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link> Project Trash</Link></Breadcrumb.Item>
            </Breadcrumb>

            <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                <Col>
                    <Title level={3}>
                        <ArrowLeftOutlined style={{ marginRight: 8 }} /> Project Trash
                    </Title>
                </Col>
            </Row>

            {/* Search & Filter */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <Input placeholder="Search" prefix={<SearchOutlined />} style={{ width: 250, marginRight: "10px" }} value={searchText} onChange={handleSearch} />
            </div>

            {/* Table */}
            <Table dataSource={data} columns={columns} pagination={{ pageSize: 6 }} />

            {/* Modal Confirm Restore/Delete */}
            <Modal
                title={`${modalType} Project`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>Cancel</Button>,
                    <Button key="confirm" type="primary" danger={modalType === "Delete"} onClick={handleConfirm}>
                        Confirm
                    </Button>
                ]}
            >
                <ExclamationCircleOutlined style={{ color: modalType === "Delete" ? "red" : "#1890ff", fontSize: "24px", marginBottom: "10px" }} />
                <p>Are you sure you want to {modalType.toLowerCase()} <strong>{selectedProject?.name}</strong>?</p>
            </Modal>
        </div>
    );
};

export default ProjectTrash;