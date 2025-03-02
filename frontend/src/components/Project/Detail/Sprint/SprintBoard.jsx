import React, { useContext } from "react";
import { Collapse, Button, Tag, Space, Flex, Dropdown, Menu, Avatar, Tooltip, DatePicker, Progress, Input } from "antd";
import { CheckOutlined, DoubleRightOutlined, EllipsisOutlined, FieldTimeOutlined, FormOutlined, PlusOutlined } from "@ant-design/icons";
import { blue, cyan, gray, grey, red } from "@ant-design/colors";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { AppContext } from "../../../../context/AppContext";
import CompleteSprintModal from "./CompleteSprintModal";

const { Panel } = Collapse;

const SprintBoard = () => {
  const { handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName, completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel } = useContext(AppContext)
  return (
    <div style={{ padding: " 2%", overflow: "auto", maxHeight: "100%" }}>
      
      <Collapse defaultActiveKey={["0"]} bordered={false} style={{ background: "white", borderRadius: 0 }}>
        {/* Sprint */}
        <Panel style={{ background: "#F5F5F5", margin: "0 0 2% 0", borderRadius: 0 }} header={
          <Flex justify="space-between" align="start">
            <Space>
              <Title level={5} style={{ margin: 0 }}>okok</Title>
              <DatePicker.RangePicker format="DD-MM-YYYY" placeholder={['Start date', 'Due date']} value={[dayjs("2024-03-01"), dayjs("2024-03-15")]} variant="underlined" disabled />
              <small style={{ color: grey[2] }}>(0 activities)</small>
            </Space>
            <Space>
              <Button
                size="small"
                variant="solid"
                color="green"
                style={{ borderRadius: "0%" }}
                onClick={(e) => {
                  e.stopPropagation();
                  showCompletedSprint();
                }}
              >
                <CheckOutlined /> Complete sprint
              </Button>
              
              <Dropdown
                overlay={
                  <Menu onClick={(e) => e.domEvent.stopPropagation()}>
                    <Menu.Item>Edit sprint</Menu.Item>
                    <Menu.Item danger>Delete sprint</Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <Button
                  size="small"
                  variant="text"
                  color="default"
                  style={{ borderRadius: "0%" }}
                  onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra ngoài
                >
                  <EllipsisOutlined />
                </Button>
              </Dropdown>

            </Space>
          </Flex>
        } key="1">
          <Flex justify="space-between" align="center" style={{ background: "white", border: `0.5px solid ${cyan[2]}`, padding: "0.5% 1%" }}>
            <Space>
              <text><FormOutlined style={{ color: blue[6] }} /> Activity 1</text>
            </Space>
            <Space align="center">
              <Tooltip title={`38 of 38 activity completed`} placement="top">
                <Progress type="circle" percent={100} size={15} showInfo={false} />

              </Tooltip>
              <Button size="small" variant="outlined" color="default" style={{ borderRadius: 0 }}>Todo</Button>
              <Button size="small" variant="outlined" color="red" style={{ borderRadius: 0 }}><FieldTimeOutlined />25/11/2025</Button>
              <DoubleRightOutlined rotate="-90" onClick={(e) => e.preventDefault()} style={{ color: red[6] }} />
              <Avatar.Group max={{ count: 2 }} size={25}>
                <Tooltip title="Ant User" placement="top">
                  <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                </Tooltip>
                <Tooltip title="Ant User" placement="top">
                  <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                </Tooltip>
                <Tooltip title="Ant User" placement="top">
                  <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                </Tooltip>
              </Avatar.Group>
              <Dropdown
                overlay={
                  <Menu onClick={(e) => e.domEvent.stopPropagation()}>
                    <Menu.Item danger>Delete activity</Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <Button
                  size="small"
                  variant="text"
                  color="default"
                  style={{ borderRadius: "0%" }}
                  onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra ngoài
                >
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            </Space>
          </Flex>
        </Panel>

        {/* Backlog */}
        <Panel style={{ background: "#F5F5F5", margin: "0 0 2% 0", borderRadius: 0 }} header={
          <Flex justify="space-between" align="start">
            <Space>
              <Title level={5} style={{ margin: 0 }}>Backlog</Title>
              <small style={{ color: grey[2] }}>(0 activities)</small>
            </Space>
            <Space>
              <Button size="small" variant="outlined" color="default" style={{ borderRadius: "0%" }}> Create sprint</Button>
            </Space>
          </Flex>
        } key="0">
          {/* Activity */}
          <Flex justify="space-between" align="center" style={{ background: "white", border: `0.5px solid ${cyan[2]}`, padding: "0.5% 1%" }}>
            <Space>
              <text><FormOutlined style={{ color: blue[6] }} /> Activity 1</text>
            </Space>
            <Space align="center">
              <Tooltip title={`38 of 38 activity completed`} placement="top">
                <Progress type="circle" percent={100} size={15} showInfo={false} />

              </Tooltip>
              <Button size="small" variant="outlined" color="default" style={{ borderRadius: 0 }}>Todo</Button>
              <Button size="small" variant="outlined" color="red" style={{ borderRadius: 0 }}><FieldTimeOutlined />25/11/2025</Button>
              <DoubleRightOutlined rotate="-90" onClick={(e) => e.preventDefault()} style={{ color: red[6] }} />
              <Avatar.Group max={{ count: 2 }} size={25}>
                <Tooltip title="Ant User" placement="top">
                  <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                </Tooltip>
                <Tooltip title="Ant User" placement="top">
                  <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                </Tooltip>
                <Tooltip title="Ant User" placement="top">
                  <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                </Tooltip>
              </Avatar.Group>
              <Dropdown
                overlay={
                  <Menu onClick={(e) => e.domEvent.stopPropagation()}>
                    <Menu.Item danger>Delete activity</Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <Button
                  size="small"
                  variant="text"
                  color="default"
                  style={{ borderRadius: "0%" }}
                  onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click lan ra ngoài
                >
                  <EllipsisOutlined />
                </Button>
              </Dropdown>
            </Space>
          </Flex>
          {/* Create activity */}
          {createActivityModal ? (
            <Input
              autoFocus
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              onPressEnter={handleActivityCreate}
              onBlur={() => setCreateActivityModal(false)}
              placeholder="Enter activity name"
              prefix={<FormOutlined style={{ color: blue[6] }} />}
              style={{ width: "100%", borderRadius: "0", margin: "1% 0", padding: "0.5% 1%" }}
            />
          ) : (
            <Button type="text" style={{ width: "100%", borderRadius: "0", color: gray[4], margin: "1% 0" }} onClick={() => setCreateActivityModal(true)}>
              <PlusOutlined /> Create new activity
            </Button>
          )}
        </Panel>


      </Collapse>
      {/* Complete modal */}
      <CompleteSprintModal/>
    </div>
  );
};

export default SprintBoard;
