import React, { useState, useContext} from "react";
import { Card, Avatar, Button, List, Typography, Layout, Menu, Tooltip, Input, Empty, Dropdown } from "antd";
import { RightOutlined, UnorderedListOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CreateTeam from "../../components/Teams/CreateTeam"; // Component tạo team
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const { Text, Title } = Typography;
const { Sider, Content } = Layout;

// Giả sử ID tài khoản hiện tại là "u1"

// Danh sách team mẫu


const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

const TeamList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const teamsPerPage = 8;
    const [searchQuery, setSearchQuery] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState("created-newest"); // Mặc định lọc theo tên A-Z
    const { teams } = useContext(AppContext);





    // filter team in site      
    if (!Array.isArray(teams))  {
        return <div style ={{ textAlign: "center" , margin: "200px" }}>Loading teams ...</div>;
    }

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
        ? sortedTeams.filter((team) => team.teamName.toLowerCase().includes(searchQuery.toLowerCase().trim()))
        : sortedTeams;

    const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);
    const startIndex = (currentPage - 1) * teamsPerPage;
    const displayedTeams = filteredTeams.slice(startIndex, startIndex + teamsPerPage);

    return (

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
                                grid={{ gutter: 70, column: 4 }}
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
                                                        background: `url(${team.teamAvatar}) center/cover no-repeat`,
                                                        height: "130px",
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
                                                    <Avatar.Group maxCount={2}>
                                                        {team.teamMembers?.filter(member => member.roles.includes("teamMember")).map((member) => (
                                                            
                                                            <Tooltip key={member._id?._id} title={member._id?.username || "Unknown User"} 
                                                            >
                                                                <Avatar src={member._id.userAvatar } />
                                                            </Tooltip>
                                                            
                                                        ))}
                                                    </Avatar.Group>


                                                    {/* Team Leader Avatar */}
                                                    {team.teamMembers
                                                        .filter(member => member.roles.includes("teamLeader"))
                                                        .map(leader => (
                                                            <Tooltip key={leader._id._id} title={leader._id.username}>
                                                                <Avatar src={leader._id.userAvatar} />
                                                            </Tooltip>
                                                        ))}

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
                                                onClick={() => navigate(`/site/teams/${team.teamSlug}`)}

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

    );
};

export default TeamList;
