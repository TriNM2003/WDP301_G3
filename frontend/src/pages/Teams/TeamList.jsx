import React, { useState } from "react";
import { Card, Avatar, Button, List, Typography, Layout, Menu, Tooltip, Input, Empty, Dropdown } from "antd";
import { RightOutlined, UnorderedListOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CreateTeam from "../../components/Teams/CreateTeam"; // Component tạo team

const { Text, Title } = Typography;
const { Sider, Content } = Layout;

const currentUserId = "u1"; // Giả sử ID tài khoản hiện tại là "u1"

// Danh sách team mẫu
const teams = [
    {
        id: "1",
        teamName: "Frontend Devs",
        teamLeader: { id: "u1", name: "Alice Johnson", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
        teamMembers: [
            { id: "u2", name: "Bob Smith", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
            { id: "u3", name: "Charlie Brown", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        ],
        site: { id: "s1", name: "Site A" },
        createdAt: "2024-01-15T10:00:00Z",
    },
    {
        id: "2",
        teamName: "Backend Engineers",
        teamLeader: { id: "u4", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        teamMembers: [
            { id: "u5", name: "Emily Green", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            { id: "u6", name: "Frank Martin", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        ],
        site: { id: "s2", name: "Site B" },
        createdAt: "2024-02-01T08:30:00Z",
    },
    {
        id: "2",
        teamName: "Backend Engineers",
        teamLeader: { id: "u4", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        teamMembers: [
            { id: "u5", name: "Emily Green", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            { id: "u6", name: "Frank Martin", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        ],
        site: { id: "s2", name: "Site B" },
        createdAt: "2024-02-01T08:30:00Z",
    },
    {
        id: "2",
        teamName: "Backend Engineers",
        teamLeader: { id: "u4", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        teamMembers: [
            { id: "u5", name: "Emily Green", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            { id: "u6", name: "Frank Martin", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        ],
        site: { id: "s2", name: "Site B" },
        createdAt: "2024-02-01T08:30:00Z",
    },
    {
        id: "2",
        teamName: "Backend Engineers",
        teamLeader: { id: "u4", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        teamMembers: [
            { id: "u5", name: "Emily Green", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            { id: "u6", name: "Frank Martin", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        ],
        site: { id: "s2", name: "Site B" },
        createdAt: "2024-02-01T08:30:00Z",
    },
    {
        id: "2",
        teamName: "Backend Engineers",
        teamLeader: { id: "u4", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        teamMembers: [
            { id: "u5", name: "Emily Green", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            { id: "u6", name: "Frank Martin", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        ],
        site: { id: "s2", name: "Site B" },
        createdAt: "2024-02-01T08:30:00Z",
    },
    {
        id: "2",
        teamName: "Backend Engineers",
        teamLeader: { id: "u4", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        teamMembers: [
            { id: "u5", name: "Emily Green", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            { id: "u6", name: "Frank Martin", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        ],
        site: { id: "s2", name: "Site B" },
        createdAt: "2024-02-01T08:30:00Z",
    },
    {
        id: "2",
        teamName: "Backend Engineers",
        teamLeader: { id: "u4", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        teamMembers: [
            { id: "u5", name: "Emily Green", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            { id: "u6", name: "Frank Martin", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        ],
        site: { id: "s2", name: "Site B" },
        createdAt: "2024-02-01T08:30:00Z",
    },
    {
        id: "2",
        teamName: "Backend Engineers",
        teamLeader: { id: "u4", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        teamMembers: [
            { id: "u5", name: "Emily Green", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            { id: "u6", name: "Frank Martin", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        ],
        site: { id: "s2", name: "Site B" },
        createdAt: "2024-02-01T08:30:00Z",
    },
    {
        id: "2",
        teamName: "Backend Engineers",
        teamLeader: { id: "u4", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        teamMembers: [
            { id: "u5", name: "Emily Green", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            { id: "u6", name: "Frank Martin", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        ],
        site: { id: "s2", name: "Site B" },
        createdAt: "2024-02-01T08:30:00Z",
    },

    {
        id: "2",
        teamName: "Backend Engineers",
        teamLeader: { id: "u4", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
        teamMembers: [
            { id: "u5", name: "Emily Green", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
            { id: "u6", name: "Frank Martin", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        ],
        site: { id: "s2", name: "Site B" },
        createdAt: "2024-02-01T08:30:00Z",
    },


];

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

const TeamList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const teamsPerPage = 8;
    const [searchQuery, setSearchQuery] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState("name-asc"); // Mặc định lọc theo tên A-Z

    const handlePageChange = (page) => setCurrentPage(page);
    const handleSearch = () => {
        setSearchQuery(inputValue);
        setCurrentPage(1);
    };
    const handleKeyPress = (event) => {
        if (event.key === "Enter") handleSearch();
    };
    const handleCreateTeam = (values) => {
        console.log("New Team Data:", values);
        setShowCreateModal(false);
    };

    // Sắp xếp danh sách team theo bộ lọc
    const sortedTeams = [...teams].sort((a, b) => {
        if (filter === "name-asc") return a.teamName.localeCompare(b.teamName);
        if (filter === "name-desc") return b.teamName.localeCompare(a.teamName);
        if (filter === "created-newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (filter === "created-oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        return 0;
    });

    // Lọc danh sách team theo tìm kiếm
    const filteredTeams = searchQuery
        ? sortedTeams.filter((team) => team.teamName.toLowerCase().includes(searchQuery.toLowerCase()))
        : sortedTeams;

    const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);
    const startIndex = (currentPage - 1) * teamsPerPage;
    const displayedTeams = filteredTeams.slice(startIndex, startIndex + teamsPerPage);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider width={200} theme="light">
                <Menu mode="inline" defaultSelectedKeys={["all"]}>
                    <Menu.Item key="all" icon={<UnorderedListOutlined />}>Teams</Menu.Item>
                </Menu>
            </Sider>

            <Layout>
                <Content style={{ padding: "20px", textAlign: "left" }}>
                    {/* Thanh tìm kiếm và lọc */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        padding: "0 20px",
                        marginTop: "20px",
                        position: "relative"
                    }}>

                        <div style={{ width: "200px" }}></div>

                        {/* Thanh tìm kiếm */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            background: "#ffffff",
                            padding: "8px",
                            borderRadius: "25px",
                            width: "600px",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)"
                        }}>
                            <Input
                                placeholder="Search by team name..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{
                                    flex: 1,
                                    border: "none",
                                    background: "transparent",
                                    boxShadow: "none",
                                    outline: "none",
                                }}
                            />

                            {/* Dropdown Filter */}
                            <Dropdown
                                overlay={
                                    <Menu onClick={(e) => setFilter(e.key)}>
                                        <Menu.Item key="name-asc">Name A-Z</Menu.Item>
                                        <Menu.Item key="name-desc">Name Z-A</Menu.Item>
                                        <Menu.Item key="created-newest">Newest Created</Menu.Item>
                                        <Menu.Item key="created-oldest">Oldest Created</Menu.Item>
                                    </Menu>
                                }
                                trigger={["click"]}
                            >
                                <Button
                                    icon={<FilterOutlined />}
                                    style={{
                                        color: "#2f54eb",
                                        border: "none",
                                        background: "#f0f0f0",
                                        borderRadius: "20px",
                                        marginRight: "8px",
                                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        transition: "all 0.3s ease-in-out",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#efdbff")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                                >
                                    FILTER
                                </Button>
                            </Dropdown>

                            {/* Nút tìm kiếm */}
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                onClick={handleSearch}
                                style={{
                                    borderRadius: "20px",
                                    background: "#2f54eb",
                                    border: "none",
                                    color: "white",
                                    transition: "all 0.3s ease-in-out",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#722ed1")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#2f54eb")}
                            >
                                FIND
                            </Button>
                        </div>

                        {/* Nút tạo Team */}
                        <Button
                            type="primary"
                            style={{
                                backgroundColor: "#2f54eb",
                                border: "none",
                                transition: "all 0.3s ease-in-out",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#722ed1")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#2f54eb")}
                            onClick={() => setShowCreateModal(true)}
                        >
                            Create Team
                        </Button>

                        {/* Modal tạo Team */}
                        <CreateTeam
                            visible={showCreateModal}
                            onCreate={handleCreateTeam}
                            onCancel={() => setShowCreateModal(false)}
                        />

                    </div>

                    {/* Danh sách Teams */}
                    {filteredTeams.length === 0 ? (
                        <Empty description="No teams found" style={{ marginTop: "20px" }} />
                    ) : (
                        <>
                            {!searchQuery && (
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Title level={5} style={{ marginTop: "10px" }}>All Teams</Title>
                                </div>
                            )}

                            <List
                                grid={{ gutter: 48, column: 4 }}
                                dataSource={displayedTeams}
                                style={{ marginTop: searchQuery ? "20px" : "0px" }}
                                renderItem={(team) => (
                                    <List.Item>
                                        <Card
                                            className="team-card"
                                            hoverable
                                            cover={
                                                <div
                                                    className="team-card-bg"
                                                    style={{
                                                        background: "#f5f5f5", // Đổi nền xám nhẹ thay vì ảnh
                                                        height: "150px",
                                                        width: "95%",
                                                        margin: "5px auto 0px",
                                                        borderRadius: "5px 5px 0 0",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "20px",
                                                        fontWeight: "bold",
                                                        color: "#1890ff",
                                                    }}
                                                >
                                                    {team.teamName}
                                                </div>
                                            }
                                            bodyStyle={{ padding: "7px" }}
                                        >
                                            <Title level={5} style={{ margin: "0", textAlign: "left" }}>
                                                {team.teamName}
                                            </Title>

                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "15px 0" }}>
                                                {/* Team Leader & Members */}
                                                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                                    <Text type="secondary" style={{ fontSize: "12px" }}>Members</Text>
                                                    <Text type="secondary" style={{ fontSize: "12px" }}>Leader</Text>
                                                </div>

                                                {/* Wrapper chứa màu nền, bao bọc cả hai avatar */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "space-between",
                                                        backgroundColor: "#F5F5F5",
                                                        padding: "1px 0px",
                                                        borderRadius: "25px",
                                                        width: "100%",
                                                        marginTop: "4px"
                                                    }}
                                                >
                                                    {/* Team Avatars */}
                                                    <Avatar.Group maxCount={3}>
                                                        {team.teamMembers.map((member) => (
                                                            <Tooltip key={member.id} title={member.name}>
                                                                <Avatar src={member.avatar} />
                                                            </Tooltip>
                                                        ))}
                                                    </Avatar.Group>

                                                    {/* Team Leader Avatar */}
                                                    <Tooltip title={team.teamLeader.name}>
                                                        <Avatar src={team.teamLeader.avatar} />
                                                    </Tooltip>
                                                </div>
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", paddingTop: "7px" }}>
                                                <Text type="secondary">Team Created</Text>
                                                <Text type="secondary">{formatDate(team.createdAt)}</Text>
                                            </div>

                                            <Button
                                                type="link"
                                                style={{
                                                    marginTop: "10px",
                                                    padding: "5px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    backgroundColor: "#f0f5ff",
                                                }}
                                                onClick={() => navigate(`/team/${team.id}`)}
                                            >
                                                Go to team{" "}
                                                <RightOutlined style={{ fontSize: "14px", position: "relative", top: "2px" }} />
                                            </Button>

                                        </Card>
                                    </List.Item>
                                )}
                            />
                            {totalPages > 1 && (
                                <div style={{ textAlign: "center", marginTop: "20px" }}>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <Button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            type={currentPage === i + 1 ? "primary" : "default"}
                                            style={{ margin: "0 5px" }}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}
                                </div>

                            )}
                        </>
                    )}

                </Content>
            </Layout>
        </Layout>
    );
};

export default TeamList;
