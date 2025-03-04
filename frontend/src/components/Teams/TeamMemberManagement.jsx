import React, { useState, useEffect } from "react";
import { Layout, Input, Button, Table, Row, Col, Typography, Dropdown, Avatar, Tag, Modal, Select, Breadcrumb, message } from "antd";
import { SearchOutlined, FilterOutlined, PlusOutlined, MoreOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Column } = Table;
const { Title } = Typography;
const { Option } = Select;

const TeamMemberManagement = () => {
    const [searchText, setSearchText] = useState("");
    const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
    const [isKickMemberModalVisible, setIsKickMemberModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [members, setMembers] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [foundUser, setFoundUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);
    const [selectedRole, setSelectedRole] = useState("teamMember");
    const [loadingKick, setLoadingKick] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        try {
            const response = await axios.get("http://localhost:9999/team/team-members", {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });

            if (Array.isArray(response.data)) {
                setMembers(response.data.filter(member => member.role === "teamMember"));
            } else {
                setMembers([]);
                console.error("Invalid data format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching team members:", error);
            setMembers([]);
        }
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const showKickMemberModal = (record) => {
        console.log("Selected User for Kick:", record);
        setSelectedUser(record);
        setIsKickMemberModalVisible(true);
    };

    const handleKickMember = async () => {
        const userId = selectedUser?._id || selectedUser?.key; // Đảm bảo lấy đúng _id
    
        if (!userId) {
            console.error("User ID is missing:", selectedUser);
            message.error("Error: User ID is missing");
            return;
        }
    
        console.log("Sending Kick API Request with:", { userId });
    
        try {
            const response = await axios.post(
                "http://localhost:9999/team/kick-team-member",
                { userId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
    
            console.log("Kick Member Response:", response.data);
            message.success(`Successfully removed ${selectedUser.username} from the team`);
            setIsKickMemberModalVisible(false);
            fetchTeamMembers(); // Cập nhật danh sách
        } catch (error) {
            console.error("Kick Member Error:", error.response ? error.response.data : error);
            message.error(error.response?.data?.message || "Failed to remove user.");
        }
    };


    const handleAddMember = async () => {
        if (!searchUser) {
            message.error("Please enter a username or email.");
            return;
        }
        try {
            await axios.post(
                "http://localhost:9999/team//add-team-member",
                { username: searchUser, email: searchUser, role: selectedRole },
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
            message.success("User added successfully!");
            setIsAddMemberModalVisible(false);
            fetchTeamMembers();
        } catch (error) {
            console.error("Error adding team member:", error);
            message.error(error.response?.data?.message || "Failed to add user.");
        }
    };


    return (
        <Layout style={{ padding: "24px", minHeight: "100%", background: "white" }}>
            <Breadcrumb>
                <Breadcrumb.Item><Link>Team</Link></Breadcrumb.Item>
                <Breadcrumb.Item><Link>Team member</Link></Breadcrumb.Item>
            </Breadcrumb>

            <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                <Col>

                    <Title level={3}> Team Member{" "}

                    </Title>
                </Col>
            </Row>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                <Col>
                    <Title level={3}>All member <span style={{ color: "#999" }}>{members.length}</span></Title>
                </Col>
                <Col>
                    <Input
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        style={{ width: 250, marginRight: "10px" }}
                        value={searchText}
                        onChange={handleSearch}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddMemberModalVisible(true)}>Add member</Button>
                </Col>
            </Row>

            {/* Table */}
            <Table
                dataSource={Array.isArray(members) ? members.map(member => ({
                    key: member._id,  // Đặt key là _id để Table hoạt động tốt hơn
                    _id: member._id,
                    avatar: member.userAvatar || "default.jpg",
                    username: member.username || "Unknown",
                    email: member.email || "Unknown",
                    access: [member.role] || ["member"],
                    fullName: member.fullName || "Unknown",
                    dateAdded: new Date(member.dateAdded).toDateString()
                })) : []}
                pagination={{ pageSize: 5 }}
                rowClassName={() => "custom-table-row"}
                style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #d9d9d9", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
            >
                <Column
                    title="Member"
                    key="username"
                    sorter={(a, b) => a.username.localeCompare(b.username)}
                    render={(text, record) => (
                        <Row align="middle">
                            <Avatar src={record.avatar} size={40} style={{ marginRight: "10px" }} />
                            <div>
                                <div style={{ fontWeight: "bold" }}>{record.username}</div>
                                <div style={{ color: "#888" }}>{record.email}</div>
                            </div>
                        </Row>
                    )}
                />
                <Column title="Full Name" dataIndex="fullName" key="fullName" sorter={(a, b) => a.fullName.localeCompare(b.fullName)} />
                <Column
                    title="Role"
                    key="access"
                    render={(text, record) => (
                        <Tag color={record.access[0] === "teamMember" ? "blue" : "purple"}>
                            {record.access[0]}
                        </Tag>
                    )}
                />
                <Column title="Date added" dataIndex="dateAdded" key="dateAdded" sorter={(a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)} />
                <Column
                    title="Action"
                    key="actions"
                    render={(text, record) => (
                        <Dropdown
                            overlay={<Button danger onClick={() => showKickMemberModal(record)}>Kick Member</Button>}
                            trigger={["click"]}
                        >
                            <Button icon={<MoreOutlined />} type="text" />
                        </Dropdown>
                    )}
                />
            </Table>

            {/* Modal: Add Member */}
            <Modal
                title="Add Member to Team"
                open={isAddMemberModalVisible}
                onCancel={() => setIsAddMemberModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsAddMemberModalVisible(false)}>Cancel</Button>,
                    <Button key="ok" type="primary" onClick={handleAddMember}>Add</Button>
                ]}
            >
                <div style={{ marginBottom: "10px" }}>Enter Username or Email</div>
                <Input value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="Enter username or email" />
                <div style={{ marginBottom: "10px", marginTop: "10px" }}>Role</div>
                <Select value={selectedRole} onChange={setSelectedRole} style={{ width: "100%" }}>
                    <Option value="teamMember">Member</Option>
                </Select>
            </Modal>

            {/* Modal: Kick Member */}
            <Modal
                title={
                    <span>
                        <ExclamationCircleOutlined style={{ color: "red", fontSize: "24px", marginRight: "10px" }} />
                        Confirm Kick Member
                    </span>
                }
                open={isKickMemberModalVisible}
                onCancel={() => setIsKickMemberModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsKickMemberModalVisible(false)}>Cancel</Button>,
                    <Button key="confirm" type="primary" danger loading={loadingKick} onClick={handleKickMember}>Confirm</Button>
                ]}
            >
                <p>Are you sure you want to remove <strong>{selectedUser?.username}</strong> from the team?</p>
            </Modal>
        </Layout>
    );
};

export default TeamMemberManagement;