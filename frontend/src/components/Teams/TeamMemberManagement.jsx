import React, { useState, useEffect, useContext } from "react";
import { Layout, Input, Button, Table, Row, Col, Typography, Dropdown, Avatar, Tag, Modal, Select, Breadcrumb, message, Spin, AutoComplete } from "antd";
import { SearchOutlined, FilterOutlined, PlusOutlined, MoreOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from '../../context/AppContext'


const { Column } = Table;
const { Title } = Typography;
const { Option } = Select;


const TeamMemberManagement = () => {
    const { showNotification, siteAPI, site, accessToken, user } = useContext(AppContext);
    const [searchText, setSearchText] = useState("");
    const [teamId, setTeamId] = useState(null);
    const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
    const [isKickMemberModalVisible, setIsKickMemberModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [members, setMembers] = useState([]);
    const [searchUser, setSearchUser] = useState("");
    const [selectedRole, setSelectedRole] = useState("teamMember");
    const [loadingAdd, setLoadingAdd] = useState(false);
    const [loadingKick, setLoadingKick] = useState(false);
    const [isLeader, setIsLeader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [siteMembers, setSiteMembers] = useState([]);
    const [filteredMembers, setFilteredMembers] = useState([]);
    const { teamSlug } = useParams();
    const nav = useNavigate();

    useEffect(() => {
        if (site._id && accessToken) {
            fetchTeamIdBySlug();
            fetchSiteMembers();
        }
    }, [site, accessToken, teamSlug]);

    // 🔹 Fetch team ID bằng slug
    const fetchTeamIdBySlug = async () => {
        try {
            const response = await axios.get(`${siteAPI}/${site._id}/teams/get-teams-in-site`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const teams = response.data;
            if (!teams || teams.length === 0) {
                message.error("No teams found!");
                return;
            }

            const team = teams.find(t => t.teamSlug === teamSlug);
            if (!team) {
                message.error("Team not found!");
                nav('/site');
                return;
            }

            setTeamId(team._id);
            fetchTeamMembers(team._id);
        } catch (error) {
            console.error("Error fetching teams:", error);
            message.error("Failed to fetch teams.");
        }
    };

    const fetchSiteMembers = async () => {
        try {
            const response = await axios.get(`${siteAPI}/${site._id}/get-site-members`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setSiteMembers(response.data || []);
        } catch (error) {
            console.error("Error fetching site members:", error);
            message.error("Failed to fetch site members.");
        }
    };

    // Hàm này chạy khi user nhập vào AutoComplete
    const handleSearchUser = (value) => {
        if (!value) {
            setFilteredMembers([]);
            return;
        }

        const filtered = siteMembers
            .map(member => member._id)
            .filter(user => user.username.toLowerCase().includes(value.toLowerCase()) ||
                (user.fullName && user.fullName.toLowerCase().includes(value.toLowerCase())))
            .map(user => ({
                value: user.username,
                label: (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={user.userAvatar} size="small" style={{ marginRight: 8 }} />
                        <span>{user.fullName || user.username} ({user.email})</span>
                    </div>
                ),
            }));

        setFilteredMembers(filtered);
    };

    // 🔹 Fetch thành viên của team bằng `teamId`
    const fetchTeamMembers = async (teamId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${siteAPI}/${site._id}/teams/${teamId}/team-members`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (Array.isArray(response.data)) {
                setMembers(response.data);

                const currentUser = response.data.find(member => member._id === user?._id);
                setIsLeader(currentUser?.role === "teamLeader");

                if (!currentUser || currentUser.role !== "teamLeader") {
                    message.warning("You are not a team leader. Access is restricted!");
                    nav('/site');
                }
            } else {
                setMembers([]);
            }
        } catch (error) {
            console.error("Error fetching team members:", error);
            message.error("Failed to load team members.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        if (value) {
            setMembers(members.filter(member =>
                member.username.toLowerCase().includes(value) ||
                member.email.toLowerCase().includes(value) ||
                member.fullName.toLowerCase().includes(value)
            ));
        } else {
            fetchTeamMembers(teamId);
        }
    };

    const showKickMemberModal = (record) => {
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
        setLoadingKick(true);
        try {
            const response = await axios.post(
                `http://localhost:9999/sites/${site._id}/teams/${teamId}/kick-team-member`,
                { userId },
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
            );
            message.success(`Successfully removed ${selectedUser.username} from the team`);
            showNotification(`Team update`, `Team Leader just kicked a team member out of the project.`);
            setIsKickMemberModalVisible(false);
            fetchTeamMembers(teamId); // Cập nhật danh sách
        } catch (error) {
            console.error("Kick Member Error:", error.response ? error.response.data : error);
            message.error(error.response?.data?.message || "Failed to remove user.");
        } finally {
            setLoadingKick(false);
        }
    };


    const handleAddMember = async () => {
        if (!searchUser) {
            message.error("Please select a member.");
            return;
        }

        // 🔹 Kiểm tra xem thành viên đã có trong team chưa
        const isAlreadyInTeam = members.some(member => member.username === searchUser);
        if (isAlreadyInTeam) {
            message.warning(`${searchUser} is already in the team.`);
            return;
        }

        setLoadingAdd(true);
        try {
            await axios.post(
                `${siteAPI}/${site._id}/teams/${teamId}/add-team-member`,
                { username: searchUser, role: selectedRole },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            message.success(`Successfully added ${searchUser} to the team`);
            showNotification(`Team update`, `Team Leader just added a new team member to the project.`);

            setIsAddMemberModalVisible(false);
            setSearchUser(""); // Reset input sau khi thêm thành viên thành công
            setFilteredMembers([]);
            fetchTeamMembers(teamId); // Cập nhật danh sách thành viên trong team
        } catch (error) {
            console.error("Error adding team member:", error);
            message.error(error.response?.data?.message || "Failed to add user.");
        } finally {
            setLoadingAdd(false);
        }
    };

    if (loading) return <Spin tip="Loading..." style={{ display: "block", marginTop: 50 }} />;

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
                {isLeader && (
                    <Col>
                        <Input
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            style={{ width: 250, marginRight: "10px" }}
                            value={searchText}
                            onChange={handleSearch}
                        />
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddMemberModalVisible(true)}>
                            Add Member
                        </Button>
                    </Col>
                )}
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
                {isLeader && (
                    <Column
                        title="Action"
                        key="actions"
                        render={(text, record) => (
                            record.access[0] !== "teamLeader" && (
                                <Dropdown
                                    overlay={
                                        <div style={{ background: "white", padding: "10px", borderRadius: "5px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)" }}>
                                            <Button type="link" danger onClick={() => showKickMemberModal(record)}>
                                                Kick Member
                                            </Button>
                                        </div>
                                    }
                                    trigger={["click"]}
                                >
                                    <Button icon={<MoreOutlined />} type="text" />
                                </Dropdown>
                            )
                        )}
                    />
                )}
            </Table>

            {/* Modal: Add Member */}
            <Modal
                title="Add Member to Team"
                open={isAddMemberModalVisible}
                onCancel={() => {
                    setIsAddMemberModalVisible(false);
                    setSearchUser(""); // Reset input khi đóng modal
                    setFilteredMembers([]);
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setIsAddMemberModalVisible(false);
                        setSearchUser(""); // Reset input khi bấm Cancel
                        setFilteredMembers([]);
                    }}>
                        Cancel
                    </Button>,
                    <Button key="ok" type="primary" loading={loadingAdd} onClick={handleAddMember}>
                        Add
                    </Button>
                ]}
            >
                <div style={{ marginBottom: "10px" }}>Enter Username</div>
                <AutoComplete
                    style={{ width: "100%" }}
                    options={filteredMembers} // Danh sách gợi ý
                    onSearch={(value) => {
                        setSearchUser(value);  // ✅ Cập nhật giá trị nhập vào
                        handleSearchUser(value);
                    }}
                    onChange={(value) => setSearchUser(value)}  // ✅ Cập nhật khi nhập chữ
                    onSelect={(value) => setSearchUser(value)}  // ✅ Cập nhật khi chọn từ gợi ý
                    value={searchUser}  // ✅ Đảm bảo input hiển thị giá trị hiện tại
                    placeholder="Enter username"
                    allowClear
                />

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