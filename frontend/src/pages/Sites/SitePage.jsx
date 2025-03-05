import React, { useState } from "react";
import { Card, Avatar, Badge, Button, List, Typography, Layout, Menu, Tooltip, Row, Col, Calendar, Alert, DatePicker } from "antd";
import { ArrowRightOutlined, RightOutlined, UnorderedListOutlined, FilterOutlined, SearchOutlined, LeftOutlined, PlusCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CreateProject from "../../components/Project/CreateProject";
import dayjs from "dayjs";
const { Text, Title } = Typography;
const { Sider, Content, Header } = Layout;

const currentUserId = "u1"; // Giả sử ID tài khoản hiện tại là "u1"

const colors = [
    "magenta", "red", "volcano", "orange", "gold",
    "lime", "green", "cyan", "blue", "geekblue", "purple"
];

const activities = [
    {
        id: "a1",
        activityTitle: "Fe common",
        startDate: "2025-02-23",
        dueDate: "2025-03-4",
        assignee: ["u1"],
        color: "#60A5FA",
        project: {
            projectName: "NJZ 1",
        }
    },
    {
        id: "a2",
        activityTitle: "API Design",
        startDate: "2025-02-24",
        dueDate: "2025-02-28",
        assignee: ["u1"],
        color: "#FBBF24",
        project: {
            projectName: "NJZ 2",
        }
    },
    {
        id: "a3",
        activityTitle: "UI Design",
        startDate: "2025-02-25",
        dueDate: "2025-02-27",
        assignee: ["u1"],
        color: "#F87171",
        project: {
            projectName: "NJZ 3",
        }
    },
    {
        id: "a4",
        activityTitle: "HUHU Design",
        startDate: "2025-02-25",
        dueDate: "2025-03-3",
        assignee: ["u1"],
        color: "#F87171",
        project: {
            projectName: "NJZ 4",
        }
    },


];



const projects = [
    {
        id: "1",
        projectName: "NJZ 1",
        projectAvatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg",
        projectMember: [
            { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2025-02-24T022:15:00Z" },
            { _id: "u2", name: "User2", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-18T08:30:00Z" },
            { _id: "u3", name: "User3", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-18T08:30:00Z" },
            { _id: "u4", name: "User4", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-18T08:30:00Z" },
            { _id: "u5", name: "User5", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-18T08:30:00Z" }
        ],
        pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },

        createdAt: "2024-01-15T10:00:00Z",
    },
    {
        id: "2",
        projectName: "NJZ 2",
        projectAvatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg",
        projectMember: [
            { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2025-02-22T04:34:00Z" }
        ],
        pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },

        createdAt: "2024-01-15T10:00:00Z",
    },
    {
        id: "3",
        projectName: "NJZ 3",
        projectAvatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg",
        projectMember: [
            { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-21T12:30:00Z" }
        ],
        pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        createdAt: "2024-01-15T10:00:00Z",
    },
    {
        id: "4",
        projectName: "NJZ 4",
        projectAvatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg",
        projectMember: [
            { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-19T16:20:00Z" }
        ],

        pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        createdAt: "2024-01-15T10:00:00Z",
    },
    {
        id: "5",
        projectName: "NJZ 5",
        projectAvatar: "#52c41a",
        projectMember: [
            { _id: "u1", name: "User1", avatar: "https://wimg.heraldcorp.com/content/default/2024/06/20/20240620050641_0.jpg", updatedAt: "2024-02-19T16:20:00Z" }
        ],
        pm: { name: "Project Manager", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        createdAt: "2024-01-15T10:00:00Z",
    }

];

const filterActivitiesByWeek = (weekStart, weekEnd) => {
    return activities.filter((activity) => {
        const start = dayjs(activity.startDate);
        const end = dayjs(activity.dueDate);
        return (
            end.isAfter(weekStart) &&
            start.isBefore(weekEnd) &&
            activity.assignee.includes(currentUserId)
        );
    });
};


const getRelativeTime = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const intervals = [
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 }
    ];

    for (let interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
        }
    }
    return "Just now";
};

const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

const ProjectList = () => {
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const currentWeekStart = selectedDate.startOf("week");
    const currentWeekEnd = selectedDate.endOf("week");
    // const [isHovered, setIsHovered] = useState(false);
    const [hoveredProjectId, setIsHovered] = useState(null);

    const handleCreateProject = (values) => {
        console.log("New Project Data:", values);
        setShowCreateModal(false);
    };




    // Hàm lấy màu không trùng lặp
    const getUniqueColor = (() => {
        let usedColors = new Set(); // Lưu trữ màu đã dùng

        return (key) => {
            if (usedColors.size >= colors.length) {
                usedColors.clear(); // Reset nếu hết màu
            }

            let colorIndex = Math.abs([...key].reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
            let color = colors[colorIndex];

            // Nếu màu đã dùng, tìm màu khác
            while (usedColors.has(color)) {
                colorIndex = (colorIndex + 1) % colors.length;
                color = colors[colorIndex];
            }

            usedColors.add(color);
            return color;
        };
    })();

    // Tìm 4 project có thời gian cập nhật gần nhất của tài khoản hiện tại
    const recentProjects = projects
        .filter(project => project.projectMember.some(member => member._id === currentUserId))
        .map(project => ({
            ...project,
            lastUpdated: project.projectMember.find(member => member._id === currentUserId)?.updatedAt || null
        }))
        .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)) // Sắp xếp theo thời gian cập nhật gần nhất
        .slice(0, 4);
    const weekDays = Array.from({ length: 7 }, (_, index) =>
        currentWeekStart.add(index, "day")
    );
    const weeklyActivities = filterActivitiesByWeek(currentWeekStart, currentWeekEnd);
    const activeProjectsCount = projects.filter((project) => {
        // Nếu project.projectStatus không có, coi như active theo mặc định
        return (project.projectStatus || "active") === "active";
    }).length;

    // Tính tổng số activity được assign cho user hiện tại
    const assignedActivitiesCount = activities.filter((activity) => {
        return Array.isArray(activity.assignee) && activity.assignee.includes(currentUserId);
    }).length;

    // Tính số activity sắp hết hạn trong vòng 2 ngày (chỉ tính các activity chưa hết hạn)
    const expiringActivitiesCount = activities.filter((activity) => {
        if (!activity.dueDate) return false;
        const diffDays = dayjs(activity.dueDate).diff(dayjs(), "day");
        // Chỉ tính các activity có hạn từ 0 đến 2 ngày
        return diffDays >= 0 && diffDays <= 2;
    }).length;
    return (
        <Layout style={{ minHeight: "100%" }}>

            <Layout>
                <Content style={{ padding: "20px 10px", textAlign: "left" }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={15}>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{
                                    maxWidth: "100%",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    textAlign: "left",
                                    display: "inline-block",
                                    marginBottom: "20px",
                                    backgroundColor: "#bae7ff"
                                }}>
                                    <Title level={3} style={{ marginBottom: 4 }}>Add Project</Title>
                                    <Text style={{ color: "gray", fontSize: "12px" }}>
                                        Create a new project on SkrumIO. Directory to your local projects.
                                    </Text>
                                    <Button
                                        type="text"
                                        style={{
                                            color: "#ff4d4f",
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "0px",
                                            marginTop: "15px",
                                            textAlign: "left",
                                            width: "210px",
                                            justifyContent: "flex-start",
                                        }}
                                        onClick={() => setShowCreateModal(true)}
                                    >
                                        <PlusCircleFilled style={{ fontSize: "20px", color: "#ff4d4f", marginRight: "6px" }} />
                                        CREATE NEW PROJECT
                                    </Button>
                                    <CreateProject
                                        visible={showCreateModal}
                                        onCreate={handleCreateProject}
                                        onCancel={() => setShowCreateModal(false)}
                                    />
                                </div>
                                <Row gutter={[16, 16]} style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                                    <Col span={8}>
                                        <Card hoverable style={{ textAlign: "center", height: "100px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius: "8px" }}>
                                            <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                                <div style={{ width: "8px", height: "8px", backgroundColor: "#3B82F6", borderRadius: "50%", marginRight: "6px" }}></div>
                                                <Text type="secondary" style={{ fontSize: "12px" }}>Active Projects</Text>
                                            </div>
                                            <Title level={2} style={{ margin: 0, color: "#3B82F6" }}>{activeProjectsCount}</Title>
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card hoverable style={{ textAlign: "center", height: "100px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius: "8px" }}>
                                            <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                                <div style={{ width: "8px", height: "8px", backgroundColor: "#10B981", borderRadius: "50%", marginRight: "6px" }}></div>
                                                <Text type="secondary" style={{ fontSize: "12px" }}>Assigned Activities</Text>
                                            </div>
                                            <Title level={2} style={{ margin: 0, color: "#10B981" }}>{assignedActivitiesCount}</Title>
                                        </Card>
                                    </Col>
                                    <Col span={8}>
                                        <Card hoverable style={{ textAlign: "center", height: "100px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRadius: "8px" }}>
                                            <div style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                                                <div style={{ width: "8px", height: "8px", backgroundColor: "#F97316", borderRadius: "50%", marginRight: "6px" }}></div>
                                                <Text type="secondary" style={{ fontSize: "12px" }}>Expiring Soon</Text>
                                            </div>
                                            <Title level={2} style={{ margin: 0, color: "#F97316" }}>{expiringActivitiesCount}</Title>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Hàng 2: Recent Projects */}
                                <div>
                                    <Title level={5} style={{ marginBottom: "20px", marginTop: "0px" }}>Recent Projects</Title>
                                    <List
                                        grid={{ gutter: 24, column: 4 }}
                                        dataSource={recentProjects}
                                        renderItem={(project) => (
                                            <List.Item>
                                                <Card
                                                    className="project-card"
                                                    hoverable
                                                    style={{ width: "170px" }}
                                                    cover={
                                                        <div
                                                            className="project-card-bg"
                                                            style={{
                                                                background: `url(${project.projectAvatar}) center/cover no-repeat`,
                                                                height: "100px",
                                                                width: "95%",
                                                                margin: "5px auto 0px",
                                                                borderRadius: "5px 5px 0 0",
                                                            }}
                                                        />
                                                    }
                                                    bodyStyle={{ padding: "7px" }}
                                                    onClick={() => navigate(`/project/${project.id}`)}
                                                >
                                                    <Title level={5} style={{ margin: "0", textAlign: "left" }}>
                                                        {project.projectName}
                                                    </Title>
                                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "10px 0" }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                                            <Text type="secondary" style={{ fontSize: "12px" }}>Members</Text>
                                                            <Text type="secondary" style={{ fontSize: "12px" }}>Manager</Text>
                                                        </div>
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
                                                            <Avatar.Group maxCount={2}>
                                                                {project.projectMember.map((member) => (
                                                                    <Tooltip key={member._id} title={member.name}>
                                                                        <Avatar src={member.avatar} />
                                                                    </Tooltip>
                                                                ))}
                                                            </Avatar.Group>
                                                            <Tooltip title={project.pm.name}>
                                                                <Avatar src={project.pm.avatar} />
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                    <Text type="secondary" style={{ fontSize: "12px" }}>
                                                        Last update: {getRelativeTime(project.projectMember[0]?.updatedAt)}
                                                    </Text>
                                                </Card>
                                            </List.Item>
                                        )}
                                    />
                                </div>

                            </div>
                        </Col>

                        <Col xs={24} md={9}>
                            <div style={{ flex: 1 }}>
                                <Card title="Schedule" style={{ borderRadius: 8, padding: 10 }}>
                                    <div style={{ flex: 1 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                background: "#F0F2F5",
                                                padding: "8px 12px",
                                                borderRadius: "8px",
                                                fontWeight: "bold",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            <LeftOutlined
                                                onClick={() => setSelectedDate(selectedDate.subtract(1, "week"))}
                                                style={{ fontSize: "16px", cursor: "pointer", color: "#666" }}
                                            />

                                            {/* DatePicker với text lớn hơn và in đậm */}
                                            <DatePicker
                                                value={selectedDate ? selectedDate : dayjs()}
                                                onChange={(date) => setSelectedDate(date || dayjs())}
                                                format="MMM D, YYYY"
                                                bordered={false}
                                                style={{
                                                    background: "transparent",
                                                    fontWeight: "bold",
                                                    fontSize: "18px",
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                }}
                                            />

                                            <RightOutlined
                                                onClick={() => setSelectedDate(selectedDate.add(1, "week"))}
                                                style={{ fontSize: "16px", cursor: "pointer", color: "#666" }}
                                            />
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(7, 1fr)",
                                            marginBottom: "10px",
                                            border: "1px solid #f0f0f0",
                                            borderRadius: "8px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {weekDays.map((day) => (
                                            <div
                                                key={day.format("YYYY-MM-DD")}
                                                onClick={() => setSelectedDate(day)}
                                                style={{
                                                    padding: "10px",
                                                    textAlign: "center",
                                                    cursor: "pointer",
                                                    background: day.isSame(selectedDate, "day") ? "#bae7ff" : "#fff",
                                                    flex: 1,
                                                }}
                                            >
                                                <Text strong>{day.format("ddd")}</Text>
                                                <br />
                                                <Text>{day.format("D")}</Text>
                                            </div>
                                        ))}
                                    </div>

                                    <div
                                        style={{
                                            position: "relative",
                                            minHeight: "50vh",
                                            gridAutoRows: "min-content",
                                            border: "1px solid #f0f0f0",
                                            borderRadius: "8px",
                                            display: "grid",
                                            gridTemplateColumns: "repeat(7, 1fr)",
                                            gap: "4px",
                                            padding: "10px",
                                            alignContent: "start",
                                        }}
                                    >
                                        {weeklyActivities.length > 0 ? (
                                            weeklyActivities.map((item) => {
                                                const activityStart = dayjs(item.startDate);
                                                const activityEnd = dayjs(item.dueDate);
                                                let startIndex = activityStart.diff(currentWeekStart, "day");
                                                let endIndex = activityEnd.diff(currentWeekStart, "day");
                                                startIndex = Math.max(startIndex, 0);
                                                endIndex = Math.min(endIndex, 6);
                                                const span = endIndex - startIndex + 1;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => navigate(`/project/${item.project._id}`)}
                                                        style={{
                                                            gridColumn: `${startIndex + 1} / span ${span}`,
                                                            background: "white",
                                                            padding: "8px",
                                                            borderLeft: `4px solid  ${getUniqueColor(item.activityTitle)}`,
                                                            borderRadius: "8px",
                                                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                            cursor: "pointer",
                                                            transition: "transform 0.2s ease, box-shadow 0.2s ease",

                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = "scale(1.05)"; // Phóng to nhẹ khi hover
                                                            e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0, 0, 0, 0.15)"; // Đổ bóng mạnh hơn
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = "scale(1)"; // Trả về kích thước ban đầu
                                                            e.currentTarget.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)"; // Trả về đổ bóng ban đầu
                                                        }}
                                                    >
                                                        <Text strong>{item.activityTitle}</Text>
                                                        <div style={{ fontSize: "12px", color: "gray" }}>
                                                            {activityStart.format("MMM D")} - {activityEnd.format("MMM D")}
                                                        </div>
                                                        <div style={{ fontSize: "12px", color: "#1890ff", fontWeight: "bold" }}>Project:{" "}
                                                            {item.project?.projectName} {/* Hiển thị tên dự án */}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#999" }}>
                                                <Text type="secondary">No activities scheduled for this week.</Text>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ProjectList;
