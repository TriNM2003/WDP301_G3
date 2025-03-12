import { blue, green, grey, orange, red } from '@ant-design/colors'
import { ArrowUpOutlined, BugOutlined, CheckCircleOutlined, CloseCircleOutlined, DollarCircleOutlined, ExclamationCircleOutlined, FireFilled, FireOutlined, FireTwoTone, FormOutlined, PaperClipOutlined, PlusCircleFilled, PlusCircleOutlined, ProfileOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Flex, Progress, Row, Space, Statistic } from 'antd'
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { icons } from 'antd/es/image/PreviewGroup'
import React, { useContext } from 'react'
import Title from 'antd/es/typography/Title'
import { AppContext } from '../../../context/AppContext'


function Summary() {
  const { activities } = useContext(AppContext);
  const now = new Date();
  const newCreated = activities?.filter(activity => {
    const activityDate = new Date(activity?.createdAt);
    // console.log(activityDate-now.getDate() >=7);
    return activityDate - now.getDate() >= 7;

  });
  const bugCreated = activities?.filter(activity => {
    const activityDate = new Date(activity?.createdAt);
    // console.log(activityDate-now.getDate() >=7);
    return activityDate - now.getDate() >= 7 && activity?.type?.typeName == "bug";

  });
  const completedActivitties = activities?.filter(activity => {
    return activity?.stage?.stageStatus == "done";

  });
  const upcomingTasks = activities?.filter(activities => { 
    const dueDate = new Date(activities?.dueDate);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 7;
  });

  //Capacity
  const uniqueAssigneesMap = new Map();
  activities?.forEach(activity => {
    activity.assignee?.forEach(a => {
      if (!uniqueAssigneesMap.has(a._id)) {
        uniqueAssigneesMap.set(a._id, a);
      }
    });
  });

  const uniqueAssignees = Array.from(uniqueAssigneesMap.values());
  

  const capacityOverview = uniqueAssignees.map(assignee => {
    const count = activities?.filter(activity =>
      activity.assignee?.some(a => a._id === assignee._id)
    )?.length;
    const percentage = activities?.length > 0 ? (count / activities?.length) * 100 : 0;
    return {
      name: assignee.username,
      value: Number(percentage.toFixed(0))
    }
  });
  // console.log(uniqueAssignees);

  //Capacity
  

 
  const data = [
    { name: "To Do", value: 48, color: "#d86fc5" },
    { name: "In Reviewing", value: 0, color: "#2a61dd" },
    { name: "In Progress", value: 16, color: "#db6b0a" },
    { name: "Done", value: 113, color: "#5b9215" },
  ];
  const priority = [
    { name: "To Do", value: 48, icon: <ExclamationCircleOutlined /> },
    { name: "In Reviewing", value: 0, icon: <ExclamationCircleOutlined /> },
    { name: "In Progress", value: 16, icon: <ExclamationCircleOutlined /> },
    { name: "Done", value: 113, icon: <ExclamationCircleOutlined /> },
  ];
  return (
    <div style={{ padding: "2% 5%", overflow: "auto", maxHeight: "100%" }}>

      <Row style={{ padding: "2% 0" }} justify="space-between">
        <Col span={5}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", textAlign: "start" }}>
            <Statistic
              title="Created"
              value={`${newCreated?.length}`}
              // valueStyle={{ color: blue.primary }}
              prefix={<ProfileOutlined style={{ color: blue.primary }} />}
            />
            <small style={{ margin: 0 }}>in the last week</small>
          </Card>
        </Col>

        <Col span={5}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", textAlign: "start" }}>
            <Statistic
              title="Completed"
              value={`${completedActivitties?.length}`}
              // valueStyle={{ color: green.primary }}
              prefix={<CheckCircleOutlined style={{ color: green.primary }} />}
            />
            <small style={{ margin: 0 }}>Total</small>
          </Card>
        </Col>

        <Col span={5}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", textAlign: "start" }}>
            <Statistic
              title="Bug"
              value={`${bugCreated?.length}`}
              // valueStyle={{ color: orange[6] }}
              prefix={<BugOutlined style={{ color: orange[6] }} />}
            />
            <small style={{ margin: 0 }}>in the last week</small>
          </Card>
        </Col>
        <Col span={5}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", textAlign: "start" }} >
            <Statistic
              title="Upcoming"
              value={`${upcomingTasks?.length}`}
              // valueStyle={{ color: red[6] }}
              prefix={<CloseCircleOutlined style={{ color: red[6] }} />}
            />
            <small style={{ margin: 0 }}>in the next week</small>
          </Card>
        </Col>
      </Row>
      <Row style={{ padding: "2% 0" }} justify="space-between">
        <Col span={11}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", overflow: "auto", height: "400px", textAlign: "start" }} >

            <Title level={5} style={{ margin: 0 }} >Activity Summary</Title>
            <small style={{ color: grey[4] }}><em>Quickly review the progress of your ongoing activities.</em></small>
            <ResponsiveContainer width="80%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}

                </Pie>
                <Tooltip />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
                <text x="38%" y="45%" textAnchor="middle" dominantBaseline="middle" fontSize={24} fontWeight="bold">
                  122
                </text>
                <text x="38%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize={14} >
                  Total Issues
                </text>
              </PieChart>
            </ResponsiveContainer>
          </Card>

        </Col>

        <Col span={11} >
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", height: "400px", paddingBottom: "5%", textAlign: "start" }}  >
            <Title level={5} style={{ margin: 0 }} >Project Capacity Overview</Title>
            <small style={{ color: grey[4] }}><em>Track your project's workload and availability.</em></small>
            <div style={{ height: "280px", overflow: "auto", margin: "2% 0", padding: "0 2%" }}>
              {capacityOverview?.map((data) => {
                return <Flex style={{ margin: "2% 0" }} justify='space-between' align='start'>
                  <Col span={4}>
                    <Space>
                      <Avatar src={<img src="https://i.pinimg.com/736x/49/9c/5e/499c5e44dcb6bc40bcf47cd3d6d1fdf0.jpg" alt="avatar" />} />
                      <text style={{
                        maxWidth: "60px", // Giới hạn chiều rộng để hiển thị chữ
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "inline-block"
                      }}>{data?.name}
                      </text>
                    </Space>
                  </Col>
                  <Col span={18}>
                    <Progress

                      percent={`${data?.value}`}
                      percentPosition={{
                        type: 'inner',
                        align: 'end'

                      }}
                      strokeLinecap="square"
                      size={["100%", 25]}
                      strokeColor={green[3]}
                    />
                  </Col>
                </Flex>
              })

              }


            </div>


          </Card>
        </Col>

      </Row>
      <Row style={{ padding: "2% 0" }} justify="space-between">
        <Col span={11}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", overflow: "auto", height: "400px", paddingBottom: "5%", textAlign: "start" }}   >
            <Title level={5} style={{ margin: 0 }} >Activity Prioritization Overview</Title>
            <small style={{ color: grey[4] }}><em>Gain insight into how activitys are being ranked in importance.</em></small>

            <ResponsiveContainer width="100%" height={250} style={{ marginTop: "2%" }}>
              <BarChart data={data} >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                {/* Chỉ dùng 1 <Bar> với dataKey="value" */}
                <Bar dataKey="value" name="Priority Level" fill={grey[0]}>
                  {data.map((entry, index) => (
                    <Bar key={index} dataKey="value" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>


          </Card>
        </Col>
        <Col span={11}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", height: "400px", paddingBottom: "5%", textAlign: "start" }}   >
            <Title level={5} style={{ margin: 0 }} >Types of work</Title>
            <small style={{ color: grey[4] }}><em>Get a breakdown of issues by their types.</em></small>
            <div style={{ height: "280px", overflow: "auto", margin: "2% 0", padding: "0 2%" }}>

              <Flex style={{ margin: "2% 0" }} justify='space-between' align='start'>
                <Col span={4}>
                  <small style={{ fontWeight: "bolder", color: grey[4] }}>Type</small>
                </Col>
                <Col span={18} align="start">
                  <small style={{ fontWeight: "bolder", color: grey[4] }}>Distribution</small>

                </Col>
              </Flex>
              <Flex style={{ margin: "2% 0" }} justify='space-between' align='start'>
                <Col span={4}>
                  <Space>
                    <FormOutlined color={blue.primary} />
                    <text style={{
                      maxWidth: "60px", // Giới hạn chiều rộng để hiển thị chữ
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "inline-block"
                    }}>Activity
                    </text>
                  </Space>
                </Col>
                <Col span={18}>
                  <Progress

                    percent={65}
                    percentPosition={{
                      type: 'inner',
                      align: 'end'

                    }}
                    strokeLinecap="square"
                    size={["100%", 25]}
                    strokeColor={green[3]}
                  />
                </Col>
              </Flex>
              <Flex style={{ margin: "2% 0" }} justify='space-between' align='start'>
                <Col span={4}>
                  <Space>
                    <PaperClipOutlined />
                    <text style={{
                      maxWidth: "60px", // Giới hạn chiều rộng để hiển thị chữ
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "inline-block"
                    }}>Subactivity
                    </text>
                  </Space>
                </Col>
                <Col span={18}>
                  <Progress

                    percent={65}
                    percentPosition={{
                      type: 'inner',
                      align: 'end'

                    }}
                    strokeLinecap="square"
                    size={["100%", 25]}
                    strokeColor={green[3]}
                  />
                </Col>
              </Flex>
            </div>


          </Card>
        </Col>
      </Row>
    </div >
  )
}

export default Summary
