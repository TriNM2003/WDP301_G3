import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layout, Card, Row, Col, Menu, Select, Tooltip, DatePicker, List, Typography, Avatar, Input, Table, Button, Modal, Tag } from "antd";
import { TeamOutlined, ProjectOutlined, UserOutlined, ClockCircleOutlined, CheckCircleOutlined, CalendarOutlined, SearchOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import dayjs from "dayjs";
import { AppContext } from "../../context/AppContext";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Sider, Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];




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
  const { teams, siteAPI, site, accessToken } = useContext(AppContext);
  const [activities, setActivities] = useState([]);
  const { teamSlug } = useParams();
  const navigate = useNavigate();

  const team = Array.isArray(teams)
    ? teams.find(team => team?.teamSlug === teamSlug)
    : null;


  useEffect(() => {
    if (site._id && accessToken) {
      axios
        .get(`${siteAPI}/${site._id}/teams/${teamSlug}`, {
          headers: { Authorization: `Bearer ${accessToken} ` },
        })
        .then((res) => {
          setActivities(res.data.activities); // Loại bỏ user hiện tại
        })
        .catch((err) => {
          console.error("Error fetching site members:", err);
        });
    }
  }, [site, teamSlug, accessToken]);


  const filteredActivitiesForChart = activities?.filter((activity) => {
    return selectedStatus === "All" || activity.stage?.stageName === selectedStatus;
  });

  // 🔹 Tạo danh sách đếm số lượng activity theo từng stage từ dữ liệu đã lọc
  const stageData = filteredActivitiesForChart.reduce((acc, activity) => {
    const stageName = activity.stage?.stageName || "Unknown"; // Kiểm tra nếu thiếu stage
    acc[stageName] = (acc[stageName] || 0) + 1;
    return acc;
  }, {});

  // 🔹 Chuyển Object thành Array [{ name: "Stage", value: số lượng }]
  const filterStageData = Object.keys(stageData).map(stage => ({
    name: stage,
    value: stageData[stage]
  }));

  // Lọc dữ liệu theo bộ lọc cho từng biểu đồ


  const uniqueProjects = [...new Set(activities.map(a => a.project?.projectName).filter(Boolean))];
  const uniqueStages = [...new Set(activities.map(a => a.stage?.stageName).filter(Boolean))];
  const uniqueAssignees = [...new Set(activities.flatMap(a => a.assignee.map(as => as.username)).filter(Boolean))];

  //  Tính toán số lượng tổng hợp
  const totalProjects = uniqueProjects.length;
  const totalActivities = activities.length;
  const doneActivities = activities.filter(activity => activity.stage?.stageStatus === "done").length;

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
  const filteredMembers = team?.teamMembers
    ?.filter(member => member.roles.includes("teamMember"))
    ?.filter(member =>
      member._id?.fullName?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      member._id?.username?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
      member._id?.email?.toLowerCase()?.includes(searchTerm.toLowerCase())
    ) || [];


  const teamLeader = team?.teamMembers?.find(member => member.roles.includes("teamLeader"));
  const filteredMemberActivityData = activities
    .filter((entry) => {
      const entryDate = dayjs(entry.startDate);
      return entryDate.isAfter(startDate) && entryDate.isBefore(endDate);
    })
    .flatMap((entry) =>
      entry.assignee.map((assignee) => ({
        date: dayjs(entry.startDate).format("YYYY-MM-DD"),
        member: assignee.username,
      }))
    );


  // Sắp xếp dữ liệu theo ngày trước khi render biểu đồ

  const groupedData = filteredMemberActivityData.reduce((acc, item) => {
    const { date, member } = item;
    if (!acc[date]) acc[date] = { date };
    acc[date][member] = (acc[date][member] || 0) + 1; // Đếm số hoạt động của từng member
    return acc;
  }, {});

  // Chuyển đổi object thành mảng
  const sortedMemberPerformanceData = Object.values(groupedData).sort(
    (a, b) => dayjs(a.date).diff(dayjs(b.date))
  );

  // Filter Activity list

  // Sắp xếp `activity` theo `createdAt`
  const sortedActivities = [...activities].sort((a, b) => dayjs(b.createdAt).diff(dayjs(a.createdAt)));

  // chỉ lấy 5 activity mới nhất
  const latestActivities = sortedActivities.slice(0, 5);

  // Lọc `activities` theo bộ lọc

  const filteredActivities = activities.filter((activity) => {
    const matchSearch =
      searchTerm === "" ||
      (activity.activityTitle && activity.activityTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchProject =
      projectFilter === "All" ||
      (activity.project?.projectName && activity.project.projectName === projectFilter);

    const matchStage =
      stageFilter === "All" ||
      (activity.stage?._id && activity.stage.stageName === stageFilter);

    const matchAssignee =
      assigneeFilter === "All" ||
      (activity.assignee?.some(assignee => assignee.username === assigneeFilter));

    // Kiểm tra ngày hợp lệ trước khi dùng dayjs
    const activityDate = activity.startDate ? dayjs(activity.startDate) : null;

    let matchDate = true; // Mặc định không lọc theo ngày

    if (activityDate && activityDate.isValid()) {
      if (dateRange[0] && !dateRange[1]) {
        // Chỉ nhập Start Date → Lọc từ ngày đó đến hôm nay
        matchDate = activityDate.isSameOrAfter(dayjs(dateRange[0]), "day") && activityDate.isSameOrBefore(today, "day");
      } else if (!dateRange[0] && dateRange[1]) {
        // Chỉ nhập End Date → Lọc từ hôm nay về trước
        matchDate = activityDate.isSameOrAfter(today, "day") && activityDate.isSameOrBefore(dayjs(dateRange[1]), "day");
      } else if (dateRange[0] && dateRange[1]) {
        // Nhập cả hai → Lọc trong khoảng từ Start Date đến End Date
        matchDate = activityDate.isSameOrAfter(dayjs(dateRange[0]), "day") && activityDate.isSameOrBefore(dayjs(dateRange[1]), "day");
      }
    }

    return matchSearch && matchProject && matchStage && matchAssignee && matchDate;
  });


  // Lọc activities theo selectedProject (nếu chọn "All Projects" thì lấy tất cả)
  const filteredActivitiesProject = selectedProject === "All Projects"
    ? activities
    : activities.filter(activity => activity.project?.projectName === selectedProject);
  // Nhóm số lượng activities theo projectName và stageName
  const aggregatedProjectData = filteredActivitiesProject.reduce((acc, activity) => {
    const projectName = activity.project?.projectName || "Unknown Project";
    const stageName = activity.stage?.stageName || "Unknown Stage";

    if (!acc[projectName]) {
      acc[projectName] = {};
    }

    acc[projectName][stageName] = (acc[projectName][stageName] || 0) + 1;
    return acc;
  }, {});


  // Chuyển đổi dữ liệu sang dạng phù hợp cho BarChart
  const formattedProjectData = Object.keys(aggregatedProjectData).map(projectName => {
    const projectStages = aggregatedProjectData[projectName];

    return {
      name: projectName,
      ...uniqueStages.reduce((acc, stage) => {
        acc[stage] = projectStages[stage] || 0;
        return acc;
      }, {})
    };
  });

  // Nếu không có dữ liệu, hiển thị ít nhất một cột trống
  if (formattedProjectData.length === 0) {
    formattedProjectData.push({ name: "No Data", "Unknown Stage": 0 });
  }

  const activityStats = activities.reduce((acc, activity) => {
    const dueDate = new Date(activity.dueDate);
    const isDone = activity.stage?.stageStatus === "done";
    const isOverdue = dueDate < today && !isDone; // Chỉ quá hạn nếu chưa hoàn thành

    activity.assignee.forEach(member => {
      const memberName = member.username;

      if (!acc[memberName]) {
        acc[memberName] = { onTime: 0, overdue: 0 };
      }

      if (isOverdue) {
        acc[memberName].overdue += 1; // Đã quá hạn
      } else if (isDone) {
        acc[memberName].onTime += 1; // Hoàn thành đúng hạn
      }
    });

    return acc;
  }, {});

  // Chuyển thành mảng để hiển thị trên biểu đồ
  const formattedData = Object.keys(activityStats).map(memberName => ({
    name: memberName,
    "Done On Time": activityStats[memberName].onTime,
    "Overdue": activityStats[memberName].overdue
  }));




  console.log("formattedData", formattedData);

  return (
    <Layout style={{ minHeight: "100vh" }}>


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
                        {team?.teamMembers?.map((member, index) => (
                          <Line
                            key={member._id?.username}
                            type="monotone"
                            dataKey={member._id?.username}
                            stroke={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>


              {/* Biểu đồ số lượng công việc theo từng dự án */}
              <Card
                title="Activity Distribution by Project & Stage"
                style={{ marginBottom: "10px", paddingLeft: "0px", textAlign: "left" }}
                extra={
                  <Select
                    value={selectedProject}
                    onChange={(value) => setSelectedProject(value)}
                    style={{ width: 180 }}
                  >
                    <Option value="All Projects">All Projects</Option>
                    {Array.from(new Set(activities.map(activity => activity.project?.projectName)))
                      .filter(Boolean)
                      .map((project) => (
                        <Option key={project} value={project}>{project}</Option>
                      ))}
                  </Select>
                }
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formattedProjectData}>
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

              <Card
                title="Activity Completion Status by Member"
                style={{ marginBottom: "15px", paddingLeft: "0px", textAlign: "left" }}
              >
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formattedData} barGap={10} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
                    <Legend />

                    {/* Mỗi member có 2 cột: 1 cho "On Time", 1 cho "Overdue" */}
                    <Bar dataKey="Done On Time" fill="#4CAF50" name="On Time" />
                    <Bar dataKey="Overdue" fill="#FF5722" name="Overdue" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>


            </Col>


            {/* Cột 2 (1/3) - Team Profile & Members */}
            <Col span={8} >
              <Card title="Team Profile" style={{ marginBottom: "10px" }}>
                <Text strong>Team Name:</Text> <Text>{team?.teamName}</Text> <br />
                <Text strong>Team Leader:</Text>
                {teamLeader ? (
                  <Text> {teamLeader?._id?.username}</Text>
                ) : (
                  <Text>N/A</Text>
                )}
              </Card>

              <Card
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Members ({filteredMembers.length})</span>
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
                    paddingLeft: "5px",

                    scrollbarWidth: "none", /* Firefox */
                    msOverflowStyle: "none", /* IE, Edge */
                  }}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={filteredMembers}
                    renderItem={(member) => (
                      <List.Item
                      onClick={() => navigate(`/site/teams/${teamSlug}/member-performance/${member._id._id}`)}>
                        <List.Item.Meta
                          avatar={

                            <Tooltip title={member._id.username}>
                              <Avatar src={member._id.userAvatar} style={{ marginRight: "80px" }} />
                            </Tooltip>
                          }
                          title={
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span>{member._id.username}</span>
                              {member.roles.includes("teamLeader") && (
                                <Tag color="gold">Leader</Tag>
                              )}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />

                </div>
              </Card>


              <Card
                title={
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
                      dataIndex: "activityTitle",
                      key: "activityTitle",
                      render: (text, record) => (
                        <div>
                          <strong>{text}</strong>
                          <br />
                          <span style={{ fontSize: "12px", color: "gray" }}>
                            {record.project?.projectName || "No Project"} • {dayjs(record.startDate).format("YYYY-MM-DD")}
                          </span>
                        </div>
                      ),
                    },
                    {
                      title: "Assignee",
                      dataIndex: "assignee",
                      key: "assignee",
                      align: "center",
                      render: (assignees) => {
                        if (assignees.length === 0) return "No Assignee";
                        const displayedAssignees = assignees.slice(0, 2).map(a => a.username).join(", ");
                        return assignees.length > 2 ? `${displayedAssignees}, ...` : displayedAssignees;
                      },
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
        style={{ top: "30px" }}
      >
        {/* Filter */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
          <Input
            style={{ width: "280px" }}
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={projectFilter} onChange={setProjectFilter} style={{ width: "120px" }}>
            <Option value="All">All Projects</Option>{uniqueProjects.map(p => <Option key={p}>{p}</Option>)}</Select>


          <Select value={stageFilter} onChange={setStageFilter} style={{ width: "120px" }}>
            <Option key="All" value="All">All Stages</Option>
            {uniqueStages.map(s => (
              <Option key={s} value={s}>{s}</Option>
            ))}
          </Select>

          <Select value={assigneeFilter} onChange={setAssigneeFilter} style={{ width: "130px" }}>
            <Option key="all" value="All">All Assignees</Option>
            {uniqueAssignees.map(a => (
              <Option key={a} value={a}>{a}</Option>
            ))}
          </Select>


          {/* 🔹 Chọn ngày */}
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

        {/* 🔹 Bảng hiển thị hoạt động */}
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
                    {record.project?.projectName || "No Project"} • {dayjs(record.startDate).format("YYYY-MM-DD")}
                  </span>
                </div>
              ),
            },
            {
              title: "Stage",
              dataIndex: "stage",
              key: "stage",
              align: "center",
              render: (stage) => stage?.stageName || "No Stage",
            },
            {
              title: "Assignee",
              dataIndex: "assignee",
              key: "assignee",
              align: "center",
              render: (assignees) => {
                if (assignees.length === 0) return "No Assignee";
                const displayedAssignees = assignees.slice(0, 2).map(a => a.username).join(", ");
                return assignees.length > 2 ? `${displayedAssignees}, ...` : displayedAssignees;
              },
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
