import React, { useState } from "react";
import { Layout, Menu, Card, Typography, Select, Table, Row, Col, Avatar,List, Button , DatePicker, Input, Tooltip,Modal, } from "antd";
import {
  TeamOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import dayjs from "dayjs";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// **Giả lập dữ liệu thành viên**
const selectedMember = {
  id: "u2",
  fullName: "Bob Smith",
  email: "bob@example.com",
  phoneNumber: "0123456789",
  userAvatar: "https://randomuser.me/api/portraits/men/2.jpg",
  projects: [
    { id: "p1", name: "Project Alpha", avatar: "https://via.placeholder.com/40" },
    { id: "p2", name: "Project Beta", avatar: "https://via.placeholder.com/40" },
    { id: "p3", name: "Project Gamma", avatar: "https://via.placeholder.com/40" },
  ],
  activities: [
    { id: "a1", name: "Fix login bug", project: "Project Alpha", status: "done", stage: "To Do", createdAt: "2025-02-15", dueDate: "2025-02-18" },
    { id: "a2", name: "Implement dashboard", project: "Project Beta", status: "done", stage: "In Progress", createdAt: "2025-02-18", dueDate: "2025-02-20" },
    { id: "a3", name: "Optimize database", project: "Project Gamma 3", status: "overdue", stage: "Review", createdAt: "2025-02-20", dueDate: "2025-02-19" },
    { id: "a4", name: "Improve UI/UX", project: "Project Alpha", status: "done", stage: "Done", createdAt: "2025-02-22", dueDate: "2025-02-23" },
    { id: "a5", name: "API Refactoring", project: "Project Beta", status: "doing", stage: "To Do 4", createdAt: "2025-02-25", dueDate: "2025-02-28" },
  ],
};

// **Lấy danh sách stage**
const uniqueStages = [...new Set(selectedMember.activities.map((activity) => activity.stage))];

// **Lấy danh sách project**
const uniqueProjects = [...new Set(selectedMember.activities.map((activity) => activity.project))];

// **Tạo dữ liệu cho Task Distribution by Stage**
const taskDistributionData = uniqueStages.map((stage) => ({
  name: stage,
  value: selectedMember.activities.filter((activity) => activity.stage === stage).length,
}));

// **Tạo dữ liệu cho Tasks by Project**
const tasksByProjectData = uniqueProjects.map((project) => {
  const projectActivities = selectedMember.activities.filter((activity) => activity.project === project);
  return {
    name: project,
    ...Object.fromEntries(uniqueStages.map((stage) => [stage, projectActivities.filter((a) => a.stage === stage).length])),
  };
});

// **Tạo dữ liệu cho Completion Rate Over Time**
const completionRateData = selectedMember.activities.map((activity) => ({
  date: activity.createdAt,
  onTime: activity.status === "done" && dayjs(activity.dueDate).isAfter(activity.createdAt) ? 1 : 0,
  overdue: activity.status === "overdue" ? 1 : 0,
}));



const TeamMemberPerformance = () => {
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedFilter, setSelectedFilter] = useState("1 Week");
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const today = dayjs();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [dateRange, setDateRange] = useState([null, null]);
  const [modalVisible, setModalVisible] = useState(false);


  // **Lọc dữ liệu Task Distribution by Stage**
  const filteredTaskDistributionData =
    selectedStage === "All" ? taskDistributionData : taskDistributionData.filter((data) => data.name === selectedStage);

  // **Lọc dữ liệu Tasks by Project**
  const filteredTasksByProjectData =
    selectedProject === "All Projects" ? tasksByProjectData : tasksByProjectData.filter((data) => data.name === selectedProject);

      // Lọc danh sách project từ activity (không ghi cứng)
  const uniqueProjects = [
    ...new Set(selectedMember.activities.map((activity) => activity.project)),
  ];

  // Lọc danh sách stage từ activity (không ghi cứng)
  const uniqueStages = [
    ...new Set(selectedMember.activities.map((activity) => activity.stage)),
  ];

   // Sắp xếp activity theo startDate (mới nhất -> cũ nhất)
   const sortedActivities = [...selectedMember.activities].sort((a, b) =>
    dayjs(b.startDate).diff(dayjs(a.startDate))
  );
  // Hiển thị 5 activity gần nhất
  const latestActivities = sortedActivities.slice(0, 5);


  // Lọc danh sách Activity theo từ khóa, trạng thái, project, stage và thời gian tạo
  const filteredActivities = sortedActivities.filter((activity) => {
    const matchSearch = activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || activity.status === statusFilter.toLowerCase();
    const matchProject = projectFilter === "All" || activity.project === projectFilter;
    const matchStage = stageFilter === "All" || activity.stage === stageFilter;
    const matchDate =
      (!dateRange[0] && !dateRange[1]) ||
      (dayjs(activity.startDate).isAfter(dateRange[0]) &&
        dayjs(activity.startDate).isBefore(dateRange[1]));

    return matchSearch && matchStatus && matchProject && matchStage && matchDate;
  });
  

const getFilteredDateRange = () => {
  switch (selectedFilter) {
    case "1 Week":
      return [today.subtract(1, "week").startOf("day"), today];
    case "1 Month":
      return [today.subtract(1, "month").startOf("day"), today];
    case "4 Months":
      return [today.subtract(4, "month").startOf("day"), today];
    case "1 Year":
      return [today.subtract(1, "year").startOf("day"), today];
    case "Custom":
      return customDateRange[0] && customDateRange[1] ? customDateRange : [today.subtract(1, "month"), today];
    default:
      return [today.subtract(1, "week"), today];
  }
};

const [startDate, endDate] = getFilteredDateRange();


 // **Lọc dữ liệu Completion Rate Over Time theo khoảng thời gian đã chọn**
 const filteredCompletionRateData = completionRateData.filter((entry) => {
  const entryDate = dayjs(entry.date);
  return entryDate.isAfter(startDate) && entryDate.isBefore(endDate);
});

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} theme="light">
        <Menu mode="inline" defaultSelectedKeys={["team"]}>
          <Menu.Item key="team" icon={<TeamOutlined />}>Team</Menu.Item>
          <Menu.Item key="projects" icon={<ProjectOutlined />}>Projects</Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "24px" }}>
        <Content>
          <Row gutter={[16, 16]}>
            {/* Cột 1 - Biểu đồ & Thống kê */}
            <Col span={16}>
              {/* Tổng quan hoạt động */}
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card><CheckCircleOutlined style={{ color: "green" }} /> {selectedMember.activities.filter(a => a.status === "done").length} Done</Card>
                </Col>
                <Col span={8}>
                  <Card><ClockCircleOutlined /> {selectedMember.activities.filter(a => a.status === "doing").length} Ongoing</Card>
                </Col>
                <Col span={8}>
                  <Card><ClockCircleOutlined style={{ color: "red" }} /> {selectedMember.activities.filter(a => a.status === "overdue").length} Overdue</Card>
                </Col>
              </Row>

              {/* Task Distribution by Stage */}
              <Card
                title="Activities Distribution by Stage"
                extra={
                  <Select value={selectedStage} onChange={(value) => setSelectedStage(value)} style={{ width: 150 }}>
                    <Option value="All">All</Option>
                    {uniqueStages.map((stage) => (
                      <Option key={stage} value={stage}>{stage}</Option>
                    ))}
                  </Select>
                }
                style={{ marginTop: "16px" }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={filteredTaskDistributionData} cx="50%" cy="50%" outerRadius={80} label>
                      {filteredTaskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              {/* Tasks by Project */}
              <Card
                title="Activities by Project"
                extra={
                  <Select value={selectedProject} onChange={(value) => setSelectedProject(value)} style={{ width: 180 }}>
                    <Option value="All Projects">All Projects</Option>
                    {uniqueProjects.map((project) => (
                      <Option key={project} value={project}>{project}</Option>
                    ))}
                  </Select>
                }
                style={{ marginTop: "16px" }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredTasksByProjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                    <Legend />
                    {uniqueStages.map((stage, index) => (
                      <Bar key={stage} dataKey={stage} stackId="a" fill={COLORS[index % COLORS.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Completion Rate Over Time */}
              <Card
                title="Completion Rate Over Time"
                extra={
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <Select
                      value={selectedFilter}
                      onChange={(value) => {
                        setSelectedFilter(value);
                        setCustomDateRange([null, null]); // Reset Custom Range nếu chọn filter nhanh
                      }}
                      style={{ width: 150 }}
                    >
                      <Option value="1 Week">Last 1 Week</Option>
                      <Option value="1 Month">Last 1 Month</Option>
                      <Option value="4 Months">Last 4 Months</Option>
                      <Option value="1 Year">Last 1 Year</Option>
                      <Option value="Custom">Custom Range</Option>
                    </Select>

                    {/* Chọn ngày tùy chỉnh */}
                    {selectedFilter === "Custom" && (
                      <>
                        <DatePicker
                          value={customDateRange[0]}
                          placeholder="Start Date"
                          onChange={(date) => setCustomDateRange([date, customDateRange[1]])}
                          format="YYYY-MM-DD"
                          style={{ width: "120px" }}
                        />
                        <DatePicker
                          value={customDateRange[1]}
                          placeholder="End Date"
                          onChange={(date) => setCustomDateRange([customDateRange[0], date])}
                          format="YYYY-MM-DD"
                          style={{ width: "120px" }}
                          disabled={!customDateRange[0]} // Chỉ cho chọn end date khi đã chọn start date
                        />
                      </>
                    )}
                  </div>
                }
                style={{ marginTop: "16px" }}
              >
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={filteredCompletionRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="onTime" stroke="#52c41a" />
                    <Line type="monotone" dataKey="overdue" stroke="#ff4d4f" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>


         {/* Cột 2: Profile, Project List, Activity List */}
         <Col span={8}>
              {/* Profile Member */}
              <Card title="Profile" style={{ marginBottom: "10px" }}>
                <Avatar size={64} src={selectedMember.userAvatar} />
                <Title level={4}>{selectedMember.fullName}</Title>
                <Text>Email: {selectedMember.email}</Text><br />
                <Text>Phone: {selectedMember.phoneNumber}</Text>
              </Card>

              {/* Project List */}
              <Card
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Projects ({selectedMember.projects.length})</span>
                    <Input
                      placeholder="Search project..."
                      allowClear
                      prefix={<SearchOutlined />}
                      style={{ width: "50%" }}
                    />
                  </div>
                }
                style={{ height: "calc(520px - 130px)", marginBottom: "10px" }}
              >
                <div
                  style={{
                    maxHeight: "250px",
                    overflowY: "auto",
                    paddingRight: "5px",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={selectedMember.projects}
                    renderItem={(project) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Tooltip title={project.name}>
                              <Avatar src={project.avatar} />
                            </Tooltip>
                          }
                          title={project.name}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Card>

              {/* Activity List */}
              <Card
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Activity List ({selectedMember.activities.length})</span>
                    <Button onClick={() => setModalVisible(true)}>View More</Button>
                  </div>
                }
              >
                <Table
                  columns={[
                    {
                      title: "Activity Details",
                      dataIndex: "name",
                      key: "name",
                      render: (text, record) => (
                        <div>
                          <strong>{text}</strong>
                          <br />
                          <span style={{ fontSize: "12px", color: "gray" }}>
                            {record.project} • {record.startDate}
                          </span>
                        </div>
                      ),
                    },
                    {
                      title: "Stage",
                      dataIndex: "stage",
                      key: "stage",
                      align: "center",
                    },
                  ]}
                  dataSource={latestActivities}
                  pagination={false}
                  rowKey="id"
                />
              </Card>
            </Col>

          </Row>
        </Content>
      </Layout>
      
        {/* Modal hiển thị toàn bộ activity với bộ lọc */}
        <Modal
        title="All Activities"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        style={{ top: "50px" }}
      >
        <div style={{ display: "flex", gap: "10px",   }}>
          <Input
            placeholder="Search activity..."
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: "25%" }}
            value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={projectFilter} onChange={setProjectFilter} style={{ width: 150 }}>
            <Option value="All">All Projects</Option>
            {uniqueProjects.map((proj) => <Option key={proj} value={proj}>{proj}</Option>)}
          </Select>
          <Select value={stageFilter} onChange={setStageFilter} style={{ width: 150 }}>
            <Option value="All">All Stages</Option>
            {uniqueStages.map((stage) => <Option key={stage} value={stage}>{stage}</Option>)}
          </Select>
         
                {/* Chọn ngày tùy chỉnh */}
                             
                                <>
                                  <DatePicker
                                    value={dateRange[0]}
                                    placeholder="Start Date"
                                    onChange={(date) => setDateRange([date, dateRange[1]])}
                                    format="YYYY-MM-DD"
                                    style={{ width: "120px" }}
                                  />
                                  <DatePicker
                                    value={dateRange[1]}
                                    placeholder="End Date"
                                    onChange={(date) => setDateRange([dateRange[0], date])}
                                    format="YYYY-MM-DD"
                                    style={{ width: "120px" }}
                                    disabled={!dateRange[0]} // Chỉ cho chọn end date khi đã chọn start date
                                  />
                                </>
                           
        </div>
        <Table
          columns={[
            {
              title: "Activity Details",
              dataIndex: "name",
              key: "name",
              render: (text, record) => (
                <div>
                  <strong>{text}</strong>
                  <br />
                  <span style={{ fontSize: "12px", color: "gray" }}>
                    {record.project} • {record.startDate}
                  </span>
                </div>
              ),
            },
            {
              title: "Stage",
              dataIndex: "stage",
              key: "stage",
              align: "center",
            },
          ]}
          dataSource={filteredActivities}
          pagination={{ pageSize: 5, position: ["bottomCenter"] }}
          rowKey="id"
        />
      </Modal>
    </Layout>
  );
};

export default TeamMemberPerformance;
