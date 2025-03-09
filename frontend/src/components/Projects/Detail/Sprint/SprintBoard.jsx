import React, { useContext, useState } from "react";
import { Collapse, Button, Tag, Space, Flex, Dropdown, Menu, Avatar, Tooltip, DatePicker, Progress, Input, Modal } from "antd";
import { CheckOutlined, DoubleRightOutlined, DownOutlined, EllipsisOutlined, FieldTimeOutlined, FormOutlined, MinusOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";
import { blue, cyan, gray, grey, orange, red } from "@ant-design/colors";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";

import CompleteSprintModal from "./CompleteSprintModal";
import ActivityDetail from "../../../Activity/ActivityDetail";
import SprintActivity from "../../../Activity/SprintActivity";
import { AppContext } from "../../../../context/AppContext";

const { Panel } = Collapse;

const SprintBoard = () => {
  const { activities,activityTypes, setActivities, sprints, setSprints, activityModal, setActivityModal, showActivity, closeActivity, handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName, completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel } = useContext(AppContext)

  // Activities
  const [filterActivity, setFliterActivity] = useState([]);
  const filteredActivitites = activities?.filter((a) => a && (filterActivity.length>0 ? filterActivity.includes(a?.type?.typeName):true));

  return (
    <div style={{ padding: " 2%", overflow: "auto", maxHeight: "100%" }}>

      <Collapse defaultActiveKey={["0"]} bordered={false} style={{ background: "white", borderRadius: 0 }}>
        {/* Backlog */}
        <Panel style={{ background: "#F5F5F5", margin: "0 0 2% 0", borderRadius: 0 }} header={
          <Flex justify="space-between" align="start">
            <Space>
              <Title level={5} style={{ margin: 0 }}>Backlog</Title>
              <small style={{ color: grey[2] }}>
                ({activities?.filter((a) => !a.sprint)?.length || 0} activities)
              </small>

            </Space>
            <Space>
              <Button size="small" variant="outlined" color="default" style={{ borderRadius: "0%" }}> Create sprint</Button>
            </Space>
          </Flex>
        } key="0">
          {/* Activity */}
          {filteredActivitites?.map((activity) => {
            if (!activity.sprint) {
              return <SprintActivity activity={activity} />
            }
          })}
          {/* Create activity */}
          {createActivityModal ? (
            <Input
              autoFocus
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              onPressEnter={() => { handleActivityCreate("", "to do", "task", "") }}
              onBlur={() => setCreateActivityModal(false)}
              placeholder="Enter activity name"
              prefix={<FormOutlined style={{ color: blue[6] }} />}
              style={{ width: "100%", borderRadius: "0", margin: "1% 0", padding: "0.5% 1%" }}
            />
          ) : (
            <Button type="text" style={{ width: "100%", borderRadius: "0", color: gray[4], margin: "1% 0" }} onClick={() => setCreateActivityModal(true)}>
              <PlusOutlined /> Create new task
            </Button>
          )}
        </Panel>
        {/* Sprint */}
        {sprints?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((sprint) => {
          return (<Panel style={{ background: "#F5F5F5", margin: "0 0 2% 0", borderRadius: 0 }} header={
            <Flex justify="space-between" align="start">
              <Space>
                <Title level={5} style={{ margin: 0 }}>{sprint?.sprintName}</Title>
                <DatePicker.RangePicker format="DD-MM-YYYY" placeholder={['Start date', 'Due date']} value={[dayjs("2024-03-01"), dayjs("2024-03-15")]} variant="underlined" disabled />
                <small style={{ color: grey[2] }}>({sprint?.activities?.length} activities)</small>
              </Space>
              <Space>
                {sprint?.sprintStatus == "active" && (<Button
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
                </Button>)
                }
                {sprint?.sprintStatus == "planning" && (<Button
                  size="small"
                  variant="outlined"
                  color="default"
                  style={{ borderRadius: "0%" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // showCompletedSprint();
                  }}
                >
                  Active sprint
                </Button>)
                }
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
          } key={sprint?._id}>
            {filteredActivitites?.filter((activity) => activity?.sprint?._id == sprint?._id)
              .map((activity) => (
                <SprintActivity key={activity._id} activity={activity} />
              ))}




          </Panel>)
        })}



      </Collapse>
      {/* Complete modal */}
      <CompleteSprintModal />
      {/* Activity modal */}

      <ActivityDetail />



    </div>
  );
};

export default SprintBoard;
