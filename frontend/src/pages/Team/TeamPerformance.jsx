import React, { useState } from "react";
import { Layout, Card, Row, Col, Menu, Select, Tooltip, DatePicker, List, Typography, Avatar, Input, Table, Button, Modal } from "antd";

import { TeamOutlined, ProjectOutlined, UserOutlined, ClockCircleOutlined, CheckCircleOutlined, CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import dayjs from "dayjs";

const { Sider, Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];



const team = {
  teamName: "Frontend Dev Team",
  teamLeader: "Alice Johnson",
  teamMembers: [
    { _id: "1", name: "Bob Smith", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
    { _id: "2", name: "Charlie Brown", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
    { _id: "3", name: "David White", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
    { _id: "4", name: "Hao", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
    { _id: "5", name: "Tran", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
    { _id: "6", name: "Huu", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
    { _id: "7", name: "NJZ", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
    { _id: "8", name: "Huhu", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  ],
};


const activities = [
  { _id: "1", title: "Task 1", project: "Project A", stage: "To Do", createdAt: "2025-02-01", assignee: "Bob Smith" },
  { _id: "2", title: "Task 2", project: "Project B", stage: "In Progress", createdAt: "2025-02-02", assignee: "Charlie Brown" },
  { _id: "3", title: "Task 3", project: "Project C", stage: "Review", createdAt: "2025-02-03", assignee: "David White" },
  { _id: "4", title: "Task 4", project: "Project A", stage: "Done", createdAt: "2025-02-04", assignee: "Bob Smith" },
  { _id: "5", title: "Task 5", project: "Project F", stage: "Done", createdAt: "2025-02-05", assignee: "Charlie Brown" },
  { _id: "6", title: "Task 6", project: "Project C", stage: "In Progress", createdAt: "2025-02-06", assignee: "David White" },
];


// Dữ liệu mẫu
const rawData = {
  stageData: [
    { name: "To Do", value: 15 },
    { name: "In Progress", value: 25 },
    { name: "Review", value: 10 },
    { name: "Done", value: 28 },
  ],
  projectData: [
    { name: "Project A", todo: 5, inProgress: 10, review: 3, done: 12 },
    { name: "Project E", todo: 7, inProgress: 8, review: 5, done: 10 },
    { name: "Project C", todo: 3, inProgress: 7, review: 2, done: 6 },
  ],
  performanceData: [
    { date: "2025-02-01", Hao: 5, Charlie: 7, David: 4 },
    { date: "2025-02-08", B: 8, Charlie: 10, David: 6 },
    { date: "2025-02-15", Hao: 12, Charlie: 14, David: 9, N: 19 },
    { date: "2025-02-22", Hao: 15, Charlie: 18, David: 12 },
    { date: "2025-03-01", Hao: 10, Charlie: 12, David: 8 },
    { date: "2024-03-08", Hao: 14, Charlie: 16, David: 11 },
    { date: "2024-04-01", A: 16, Charlie: 18, David: 14 },
  ],
};

const aggregatedProjectData = [
  { name: "Project A", "To Do": 5, "In Progress": 8, Review: 3, Done: 10 },
  { name: "Project b", "To Do": 6, "In Progress": 7, Review: 4, Done: 9, no: 1 },
  { name: "Project C", "To Do": 6, "In Progress": 7, Review: 4, Done: 9, no: 1 },
  { name: "Project D", "To Do": 6, "In Progress": 7, Review: 4, Done: 9, no: 1 },
  { name: "Project E", "To Do": 6, "In Progress": 7, Review: 4, Done: 9, no: 1 },
  { name: "Project F", "To Do": 5, "In Progress": 8, Review: 3, Done: 10 },
  { name: "Project G", "To Do": 6, "In Progress": 7, Review: 4, Done: 9, no: 1 },

];

const memberPerformanceData = [
  { date: "2025-02-01", "Bob Smith": 10, "Charlie Brown": 0, "David White": 0 },
  { date: "2025-02-02", "Bob Smith": 10, "Charlie Brown": 1, "David White": 0 },
  { date: "2025-02-03", "Bob Smith": 10, "Charlie Brown": 1, "David White": 1 },
  { date: "2024-02-04", "Bob Smith": 20, "Charlie Brown": 1, "David White": 1 },
  { date: "2024-02-05", "Bob Smith": 20, "Charlie Brown": 2, "David White": 1 },
  { date: "2024-02-06", "Bob Smith": 20, "Charlie Brown": 2, "David White": 2 },
  { date: "2025-02-04", "Bob Smith": 20, "Charlie Brown": 1, "David White": 1 },
  { date: "2025-02-05", "Bob Smith": 20, "Charlie Brown": 2, "David White": 1 },
  { date: "2025-02-06", "Bob Smith": 20, "Charlie Brown": 2, "David White": 2 },
];



const TeamPerformance = () => {
  // const [selectedTime, setSelectedTime] = useState("This Month");
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("1 Week");
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const today = dayjs();
  const [searchTerm, setSearchTerm] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [dateRange, setDateRange] = useState([null, null]);
  const [modalVisible, setModalVisible] = useState(false);
  // Lọc dữ liệu theo bộ lọc cho từng biểu đồ
  const filterStageData = rawData.stageData.filter((task) => selectedStatus === "All" || task.name === selectedStatus);
  const filterProjectData = rawData.projectData.filter((project) => selectedProject === "All Projects" || project.name === selectedProject);


  const uniqueStages = [...new Set(activities.map((activity) => activity.stage))];
  const uniqueProjects = [...new Set(activities.map((activity) => activity.project))];
  const uniqueAssignees = [...new Set(activities.map((activity) => activity.assignee))];

  //  Tính toán số lượng tổng hợp
  const totalProjects = uniqueProjects.length;
  const totalActivities = activities.length;
  const doneActivities = activities.filter(activity => activity.stage === "Done").length;
  const overdueActivities = activities.filter(activity => dayjs(activity.dueDate).isBefore(dayjs()) && activity.stage !== "Done").length;

  // Xác định khoảng thời gian lọc
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


  // Lọc danh sách thành viên theo tìm kiếm
  const filteredMembers = team.teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  // Lọc dữ liệu hiệu suất theo ngày được chọn
  const filteredPerformanceData = rawData.performanceData.filter((entry) => {
    const entryDate = dayjs(entry.date);
    return entryDate.isAfter(startDate) && entryDate.isBefore(endDate);
  });
  const filteredMemberActivityData = memberPerformanceData.filter((entry) => {
    const entryDate = dayjs(entry.date);
    return entryDate.isAfter(startDate) && entryDate.isBefore(endDate);
  });

  // Lấy danh sách tất cả thành viên xuất hiện trong dữ liệu
  const getAllMembers = (data) => {
    const members = new Set();

    data.forEach(entry => {
      Object.keys(entry).forEach(key => {
        if (key !== "date") {
          members.add(key);
        }
      });
    });

    return Array.from(members); // Chuyển Set thành Array
  };

  //  Cấu hình cột của bảng Activity
  const activityColumns = [
    { title: "Activity", dataIndex: "title", key: "title" },
    { title: "Project", dataIndex: "project", key: "project" },
    { title: "Created Date", dataIndex: "createdAt", key: "createdAt" },
    { title: "Assignee", dataIndex: "assignee", key: "assignee" },
  ];

  const allMembers = getAllMembers(rawData.performanceData);
  // Sắp xếp dữ liệu theo ngày trước khi render biểu đồ
  const sortedPerformanceData = [...filteredPerformanceData].sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
  const sortedMemberPerformanceData = [...filteredMemberActivityData].sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));



  // Filter Activity list

  // 🔹 Sắp xếp `activity` theo `createdAt`
  const sortedActivities = [...activities].sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));

  // 🔹 Chỉ lấy 5 activity mới nhất
  const latestActivities = sortedActivities.slice(0, 5);

  // 🔹 Lọc `activities` theo bộ lọc
  const filteredActivities = sortedActivities.filter((activity) => {
    const matchSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchProject = projectFilter === "All" || activity.project === projectFilter;
    const matchStage = stageFilter === "All" || activity.stage === stageFilter;
    const matchAssignee = assigneeFilter === "All" || activity.assignee === assigneeFilter;
    const matchDate =
      (!dateRange[0] && !dateRange[1]) ||
      (dayjs(activity.createdAt).isAfter(dateRange[0]) && dayjs(activity.createdAt).isBefore(dateRange[1]));

    return matchSearch && matchProject && matchStage && matchDate && matchAssignee;
  });


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={200} theme="light">
        <Menu mode="inline" defaultSelectedKeys={["team"]}>
          <Menu.Item key="team" icon={<TeamOutlined />}>Team Performance</Menu.Item>
          <Menu.Item key="projects" icon={<ProjectOutlined />}>Projects</Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "10px" }}>
        <Content>
          {/* Biểu đồ số lượng công việc theo trạng thái */}

          <Row gutter={[16, 16]}>
            {/* Cột 1 (2/3) - Thống kê */}
            <Col span={16}>


              <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
                <Col span={6}>
                  <Card bordered>
                    <Row align="middle">
                      <Col span={6}><ProjectOutlined style={{ fontSize: 24, color: "#1890ff" }} /></Col>
                      <Col span={18}>
                        <Text strong>Total Projects</Text>
                        <br />
                        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>{totalProjects}</Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col span={6}>
                  <Card bordered>
                    <Row align="middle">
                      <Col span={6}><CalendarOutlined style={{ fontSize: 24, color: "#52c41a" }} /></Col>
                      <Col span={18}>
                        <Text strong>Total Activities</Text>
                        <br />
                        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>{totalActivities}</Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col span={6}>
                  <Card bordered>
                    <Row align="middle">
                      <Col span={6}><CheckCircleOutlined style={{ fontSize: 24, color: "#13c2c2" }} /></Col>
                      <Col span={18}>
                        <Text strong>Done Activities</Text>
                        <br />
                        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>{doneActivities}</Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col span={6}>
                  <Card bordered>
                    <Row align="middle">
                      <Col span={6}><ClockCircleOutlined style={{ fontSize: 24, color: "#ff4d4f" }} /></Col>
                      <Col span={18}>
                        <Text strong>Overdue</Text>
                        <br />
                        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>{overdueActivities}</Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={9}>
                  <Card
                    title="Activity Distribution"
                    style={{ marginBottom: "10px" }}
                    extra={
                      <Select value={selectedStatus} onChange={(value) => setSelectedStatus(value)} style={{ width: "100px" }}>
                        <Option value="All">All</Option>
                        {uniqueStages.map((stage) => (
                          <Option key={stage} value={stage}>{stage}</Option>
                        ))}
                      </Select>
                    }
                  >
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={filterStageData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                          {filterStageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>

                {/* Biểu đồ đường - Hiệu suất công việc theo thời gian của thành viên */}
                <Col span={15}>
                  <Card
                    title="Member Activity Over Time"
                    style={{ paddingLeft: "0px", textAlign: "left" }}
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
                  >
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={sortedMemberPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        {team.teamMembers.map((member, index) => (
                          <Line key={member.name} type="monotone" dataKey={member.name} stroke={COLORS[index % COLORS.length]} />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>


              {/* Biểu đồ số lượng công việc theo từng dự án */}
              <Card
                title="Activity Distribution by Project "
                style={{ marginBottom: "10px" , paddingLeft: "0px", textAlign: "left" }}
                extra={
                  <Select value={selectedProject} onChange={(value) => setSelectedProject(value)} style={{ width: 180 }}>
                    <Option value="All Projects">All Projects</Option>
                    {uniqueProjects.map((project) => (
                      <Option key={project} value={project}>{project}</Option>
                    ))}
                  </Select>
                }
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={aggregatedProjectData}>
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

              {/* Biểu đồ hiệu suất làm việc theo thời gian */}
              <Card
                title="Member Performance Over Time"
                style={{ marginBottom: "15px" , paddingLeft: "0px", textAlign: "left" }}
                extra={
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {/* Lựa chọn thời gian nhanh */}
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
              >
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={sortedPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                    <Legend />

                    {/* Tạo danh sách Bar component dựa trên danh sách member động */}
                    {allMembers.map((member, index) => (
                      <Bar key={member} dataKey={member} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </Card>

            </Col>


            {/* Cột 2 (1/3) - Team Profile & Members */}
            <Col span={8} >
              <Card title="Team Profile" style={{ marginBottom: "10px" }}>
                <Text strong>Team Name:</Text> <Text>{team.teamName}</Text> <br />
                <Text strong>Team Leader:</Text> <Text>{team.teamLeader}</Text>
              </Card>

              <Card
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Members ({team.teamMembers.length})</span>
                    <Input
                      placeholder="Search member..."
                      allowClear
                      prefix={<SearchOutlined />}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: "50%" }}
                    />
                  </div>
                }
                style={{ height: "calc(520px - 130px)", marginBottom: "10px" }}
              >
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    paddingRight: "5px",
                    scrollbarWidth: "none", /* Firefox */
                    msOverflowStyle: "none", /* IE, Edge */
                  }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={filteredMembers}
                    renderItem={(member) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Tooltip title={member.name}>
                              <Avatar src={member.avatar} />
                            </Tooltip>
                          }
                          title={member.name}
                        />
                      </List.Item>
                    )}
                  />
                </div>
              </Card>
              <Card title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Activity List ({totalActivities})</span>
                    <Button onClick={() => setModalVisible(true)}>View More</Button>
                  </div>
                }
>
                <Table
                  columns={[
                    {
                      title: "Activity Details",
                      dataIndex: "title",
                      key: "title",
                      
                      render: (text, record) => (
                        <div >
                          <strong>{text}</strong>
                          <br />
                          <span style={{ fontSize: "12px", color: "gray" }}>
                            {record.project} • {record.createdAt}
                          </span>
                        </div>
                      ),
                    },
                    {
                      title: "Assignee",
                      dataIndex: "assignee",
                      key: "assignee",
                      align: "center",
                      
                      render: (text) => <span>{text}</span>,
                    },
                  ]}
                  dataSource={activities}
                  pagination={{ pageSize: 6, position: ["bottomCenter"] }} 
                  rowKey="_id"
                />
              </Card>

            </Col>
          </Row>
        </Content>
      </Layout>

 {/* Modal hiển thị toàn bộ Activity */}
 <Modal
        title="All Activities"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={1000}
        height={600}
        style={{ top: "30px"}}
      >
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <Input style={{ width: "330px" }} placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <Select value={projectFilter} onChange={setProjectFilter}><Option value="All">All Projects</Option>{uniqueProjects.map(p => <Option key={p}>{p}</Option>)}</Select>
          <Select value={stageFilter} onChange={setStageFilter}><Option value="All">All Stages</Option>{uniqueStages.map(s => <Option key={s}>{s}</Option>)}</Select>
           <Select value={assigneeFilter} onChange={setAssigneeFilter}><Option value="All">All Assignees</Option>{uniqueAssignees.map(a => <Option key={a}>{a}</Option>)}</Select>
                    
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
                      dataIndex: "title",
                      key: "title",
                      
                      render: (text, record) => (
                        <div >
                          <strong>{text}</strong>
                          <br />
                          <span style={{ fontSize: "12px", color: "gray" }}>
                            {record.project} • {record.createdAt}
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
                    {
                      title: "Assignee",
                      dataIndex: "assignee",
                      key: "assignee",
                      align: "center",
                      
                      render: (text) => <span>{text}</span>,
                    },
                  ]}
                  dataSource={filteredActivities}
                  pagination={{ pageSize: 5, position: ["bottomCenter"] }} 
                  rowKey="_id"
                />
      </Modal>

    </Layout>
  );
};

export default TeamPerformance;
