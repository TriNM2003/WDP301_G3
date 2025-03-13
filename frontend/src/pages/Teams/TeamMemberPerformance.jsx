import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Menu, Card, Typography, Select, Table, Row, Col, Avatar, List, Button, DatePicker, Input, Tooltip, Modal, } from "antd";
import { TeamOutlined, ProjectOutlined, CheckCircleOutlined, ClockCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line, } from "recharts";
import dayjs from "dayjs";
import { AppContext } from "../../context/AppContext";
import axios from 'axios';
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];





const TeamMemberPerformance = () => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [selectedFilter, setSelectedFilter] = useState("1 Week");
  const [customDateRange, setCustomDateRange] = useState([null, null]);
  const today = dayjs();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All Projects");
  const [stageFilter, setStageFilter] = useState("All");
  const [dateRange, setDateRange] = useState([null, null]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [searchText, setSearchText] = useState("");
  const { teams, siteAPI, site, accessToken, userApi } = useContext(AppContext);
  const { userId } = useParams();


  useEffect(() => {
    if (userId && site._id && accessToken) {
      axios
        .get(`${userApi}/user/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          setUserInfo(res.data);
        })
        .catch((err) => {
          console.error("Error fetching user info", err);
        });
    }
  }, [userId, site, accessToken]);


  // Lọc danh sách activities theo trạng thái
  const doneActivities = userInfo?.activities?.filter(a => a.stage?.stageStatus === "done") || [];
  const ongoingActivities = userInfo?.activities?.filter(a => a.stage?.stageStatus === "doing") || [];
  const overdueActivities = userInfo?.activities?.filter(a =>
    a?.dueDate && dayjs(a.dueDate).isBefore(dayjs()) && a.stage?.stageStatus !== "done"
  ) || [];


  // Lấy danh sách project từ userInfo.projects
  const projects = userInfo?.projects || [];


  // Lọc dự án theo từ khóa tìm kiếm
  const filteredProjects = projects?.filter((project) =>
    project?.projectName?.toLowerCase().includes(searchText?.toLowerCase())
  );

  // Sắp xếp activity theo startDate mới nhất -> cũ nhất
  const sortedActivities = [...(userInfo?.activities || [])].sort((a, b) =>
    dayjs(b.startDate).diff(dayjs(a.startDate))
  );
  // Hiển thị 5 activity gần nhất
  const latestActivities = sortedActivities.slice(0, 5);

  // **Lấy danh sách project**
  const uniqueProjects = [
    ...new Set((userInfo?.activities || []).map((act) => act.project?.projectName)),
  ];
  const uniqueStages = [
    ...new Set((userInfo?.activities || []).map((act) => act.stage?.stageName)),
  ];

  const stageColorMap = {};
  uniqueStages.forEach((stage, index) => {
    stageColorMap[stage] = COLORS[index % COLORS.length];
  });


  const taskDistributionData = uniqueStages?.map((stage) => ({
    name: stage,
    value: (userInfo.activities || []).filter((activity) => activity.stage?.stageName === stage).length,
  }));

  const tasksByProjectData = uniqueProjects?.map((project) => {
    const projectActivities = (userInfo.activities || []).filter((activity) => activity.project?.projectName === project);
    return {
      name: project,
      ...Object.fromEntries(uniqueStages?.map((stage) => [stage, projectActivities.filter((a) => a.stage?.stageName === stage).length])),
    };
  });

  const completionRateData = (userInfo?.activities || []).map((activity) => ({
    date: dayjs(activity.dueDate).format("YYYY-MM-DD"),
    onTime:
      activity.stage?.stageStatus === "done" &&
        dayjs(activity?.dueDate).isBefore(dayjs()) // DueDate trước hôm nay và đã hoàn thành
        ? 1
        : 0,
    overdue:
      activity?.dueDate &&
        dayjs(activity?.dueDate).isBefore(dayjs()) &&
        activity.stage?.stageStatus !== "done" // DueDate trước hôm nay nhưng chưa hoàn thành
        ? 1
        : 0,
  }));






  // **Lọc dữ liệu Task Distribution by Stage**
  const filteredTaskDistributionData =
    selectedStage === null ? taskDistributionData : taskDistributionData.filter((data) => data.name === selectedStage);


  // **Lọc dữ liệu Tasks by Project**
  const filteredTasksByProjectData =
    selectedProject === "All Projects" ? tasksByProjectData : tasksByProjectData.filter((data) => data.name === selectedProject);





  const filteredActivities = sortedActivities.filter((activity) => {
    const matchSearch = activity?.activityTitle?.toLowerCase()?.includes(searchTerm.toLowerCase());

    // Nếu "All Projects" được chọn, bỏ qua filter theo project
    const matchProject = projectFilter === "All Projects" || activity?.project?.projectName === projectFilter;

    // Nếu "All Stages" được chọn, bỏ qua filter theo stage
    const matchStage = stageFilter === "All" || activity?.stage?.stageName === stageFilter;

    const matchDate =
      (!dateRange[0] && !dateRange[1]) ||
      (dayjs(activity?.startDate).isAfter(dateRange[0]) && dayjs(activity?.startDate).isBefore(dateRange[1]));

    return matchSearch && matchProject && matchStage && matchDate;
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


  // Nhóm dữ liệu theo ngày
  const groupedCompletionRateData = completionRateData.reduce((acc, curr) => {
    const dateKey = dayjs(curr.date).format("YYYY-MM-DD");

    if (!acc[dateKey]) {
      acc[dateKey] = { date: dateKey, onTime: 0, overdue: 0 };
    }

    acc[dateKey].onTime += curr.onTime;
    acc[dateKey].overdue += curr.overdue;

    return acc;
  }, {});


  const filteredCompletionRateData = Object.values(groupedCompletionRateData)
    .filter((entry) => {
      const entryDate = dayjs(entry.date);
      return entryDate.isAfter(startDate) && entryDate.isBefore(endDate);
    })
    .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()); // Sắp xếp từ xa đến gần


  // Xử lý khi click vào Card
  const handleCardClick = (title, activities) => {
    setModalTitle(title);
    setSelectedActivities(activities);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "Activity Title",
      dataIndex: "activityTitle",
      key: "activityTitle",
      sorter: (a, b) => a.activityTitle.localeCompare(b.activityTitle), // Sắp xếp A-Z, Z-A
    },
    {
      title: "Project Name",
      dataIndex: "projectName",
      key: "projectName",
      render: (text, record) => record.project?.projectName || "N/A",
      sorter: (a, b) => (a.project?.projectName || "").localeCompare(b.project?.projectName || ""),
    },
    {
      title: "Expiration Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (text, record) => record.dueDate
        ? dayjs(record.dueDate).format("YYYY-MM-DD")
        : "N/A",
      sorter: (a, b) => dayjs(a.dueDate).valueOf() - dayjs(b.dueDate).valueOf(), // Sắp xếp từ xa đến gần
    },
    {
      title: "Completion Time",
      dataIndex: "completionTime",
      key: "completionTime",
      render: (text, record) =>
        record.stage?.stageStatus === "done"
          ? dayjs(record.updatedAt).format("YYYY-MM-DD")
          : "Not completed",
      sorter: (a, b) => dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf(),
    },
  ];



  return (
    <Layout style={{ minHeight: "100vh" }}>


      <Layout style={{ padding: "24px" }}>
        <Content>
          <Row gutter={[16, 16]}>
            {/* Cột 1 - Biểu đồ & Thống kê */}
            <Col span={16}>
              {/* Tổng quan hoạt động */}
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card hoverable onClick={() => handleCardClick("Total Activities Done", doneActivities)}>
                    <Row align="middle">
                      <Col span={6}><CheckCircleOutlined style={{ fontSize: 24, color: "green" }} /></Col>
                      <Col span={18}>
                        <Text strong>Total Activities Done</Text>
                        <br />
                        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>{doneActivities.length}</Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card hoverable onClick={() => handleCardClick("Total Activities Ongoing", ongoingActivities)}>
                    <Row align="middle">
                      <Col span={6}><ClockCircleOutlined style={{ fontSize: 24, color: "blue" }} /></Col>
                      <Col span={18}>
                        <Text strong>Total Activities Ongoing</Text>
                        <br />
                        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>{ongoingActivities.length}</Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col span={8}>
                  <Card hoverable onClick={() => handleCardClick("Total Activities Overdue", overdueActivities)}>
                    <Row align="middle">
                      <Col span={6}><ClockCircleOutlined style={{ fontSize: 24, color: "red" }} /></Col>
                      <Col span={18}>
                        <Text strong>Total Activities Overdue</Text>
                        <br />
                        <Text style={{ fontSize: "24px", fontWeight: "bold" }}>{overdueActivities.length}</Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              {/* Task Distribution by Stage */}
              <Card
                title="Activities Distribution by Stage"
                extra={
                  <Select value={selectedStage || "All Stages"} onChange={(value) => setSelectedStage(value)} style={{ width: 150 }}>
                    <Option value={null}>All Stages</Option>
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
                        <Cell key={`cell-${index}`} fill={stageColorMap[entry.name] || COLORS[index % COLORS.length]} />
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
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => dayjs(date).format("YYYY-MM-DD")}
                    />
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
              <Card title="Profile" style={{ marginBottom: "10px", textAlign: "center" }}>
                <Avatar size={64} src={userInfo?.userAvatar} />
                <Title level={4}>{userInfo?.fullName}</Title>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "10px", marginLeft: "70px" }}>
                  <Text>Email: {userInfo?.email}</Text>
                  <Text>Phone: {userInfo?.phoneNumber}</Text>
                </div>
              </Card>


              {/* Project List */}
              <Card
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Projects ({projects.length})</span>
                    <Input
                      placeholder="Search project..."
                      allowClear
                      prefix={<SearchOutlined />}
                      style={{ width: "50%" }}
                      onChange={(e) => setSearchText(e.target.value)}
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
                    dataSource={filteredProjects}
                    renderItem={(project) => (
                      <List.Item
                        style={{
                          transition: "all 0.3s ease-in-out",
                          padding: "8px",
                          borderRadius: "2px",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f0f0f0";
                          e.currentTarget.style.transform = "scale(1.02)";
                          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <List.Item.Meta
                          avatar={
                            <Tooltip title={project.projectName}>
                              <Avatar src={project.projectAvatar} />
                            </Tooltip>
                          }
                          title={project.projectName}
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
                    <span>Activity List ({userInfo?.activities?.length})</span>
                    <Button onClick={() => setModalVisible(true)}>View More</Button>
                  </div>
                }
              >
                <Table
                  columns={[
                    {
                      title: "Activity Details",
                      dataIndex: "activityTitle",
                      key: "activityTitle",
                      render: (text, record) => (
                        <div>
                          <strong>{text}</strong>
                          <br />
                          <span style={{ fontSize: "12px", color: "gray" }}>
                            {record.project.projectName} • {dayjs(record.startDate).format("YYYY-MM-DD")}
                          </span>
                        </div>
                      ),
                    },
                    {
                      title: "Stage",
                      dataIndex: "stage",
                      key: "stage",
                      align: "center",
                      render: (stage) => stage?.stageName || "N/A", // Tránh lỗi khi stage là null hoặc undefined
                    },

                  ]}
                  dataSource={latestActivities}
                  pagination={false}
                  rowKey="_id"
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
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <Input
            placeholder="Search activity..."
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: "25%" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={projectFilter} onChange={setProjectFilter} style={{ width: 150 }}>
            <Select.Option value="All Projects">All Projects</Select.Option>
            {uniqueProjects.map((proj) => (
              <Select.Option key={proj} value={proj}>{proj}</Select.Option>
            ))}
          </Select>

          <Select value={stageFilter} onChange={setStageFilter} style={{ width: 150 }}>
            <Select.Option value="All">All Stages</Select.Option>
            {uniqueStages.map((stage) => (
              <Select.Option key={stage} value={stage}>{stage}</Select.Option>
            ))}
          </Select>



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
            disabled={!dateRange[0]}
          />
        </div>
        <Table
          columns={[
            {
              title: "Activity Details",
              dataIndex: "activityTitle",
              key: "activityTitle",
              render: (text, record) => (
                <div>
                  <strong>{text}</strong>
                  <br />
                  <span style={{ fontSize: "12px", color: "gray" }}>
                    {record.project?.projectName || "No Project"}
                  </span>
                </div>
              ),
            },
            {
              title: "Start Date",
              dataIndex: "startDate",
              key: "startDate",
              align: "center",
              render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
            },
            {
              title: "Due Date",
              dataIndex: "dueDate",
              key: "dueDate",
              align: "center",
              render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
            },
            {
              title: "Stage",
              dataIndex: "stage",
              key: "stage",
              align: "center",
              render: (stage) => stage?.stageName || "N/A",
            },
          ]}
          dataSource={filteredActivities}
          pagination={{ pageSize: 5, position: ["bottomCenter"] }}
          rowKey="_id"
        />
      </Modal>

      <Modal
        title={modalTitle}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={columns}
          dataSource={selectedActivities.map((activity, index) => ({ key: index, ...activity }))}
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </Layout>
  );
};

export default TeamMemberPerformance;
