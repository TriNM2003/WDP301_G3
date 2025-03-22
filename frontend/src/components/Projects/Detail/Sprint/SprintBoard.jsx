import React, { useContext, useState } from "react";
import { Collapse, Button, Tag, Space, Flex, Dropdown, Menu, Avatar, Tooltip, DatePicker, Progress, Input, Modal, message, Select } from "antd";
import { CheckOutlined, DoubleRightOutlined, DownOutlined, DownloadOutlined, EllipsisOutlined, FieldTimeOutlined, FormOutlined, MinusOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";
import { blue, cyan, gray, grey, orange, red } from "@ant-design/colors";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { DndContext, MouseSensor, useSensor } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CompleteSprintModal from "./CompleteSprintModal";
import ActivityDetail from "../../../Activity/ActivityDetail";
import SprintActivity from "../../../Activity/SprintActivity";
import { AppContext } from "../../../../context/AppContext";
import axios from "axios";

const { Panel } = Collapse;

const SprintBoard = () => {
  const { activities, activityTypes, setActivities, showNotification, stages, activityModalLoading, selectedSprint, setSelectedSprint, handleMoveActivity, user, sprints, siteAPI, site, accessToken, project, setSprints, activityModal, setActivityModal, showActivity, closeActivity, handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName, completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel } = useContext(AppContext)
  const [expandedPanels, setExpandedPanels] = useState(["0"]); // Mở Backlog mặc định
  // Activities
  const [filterActivityType, setFliterActivityType] = useState(["task"]);
  const filteredActivitites = activities?.filter((a) => a && (filterActivityType.length > 0 ? filterActivityType.includes(a?.type?.typeName) : true));
  const [isDeleteSprint, setIsDeleteSprint] = useState(false);
  const [deleteSprint, setDeleteSprint] = useState(null);

  //DND
  const handleDragEnd = (e) => {
    const { over, active } = e;
    console.log("handleDrageEnd:", e);
  }

  const handleDragStart = (e) => {
    console.log("handleDrageStart:", e);
  }

  // const handleDragOver = (event) => {
  //   const { over } = event;

  //   if (over?.id && !expandedPanels.includes(over.id)) {
  //     console.log("handle open",(prev) => [...prev, over.id]);
  //   }
  // };
  const handleCreateSprint = async () => {
    axios.post(`${siteAPI}/${site?._id}/projects/${project?._id}/sprints/create`,
      {
        sprintName: `Sprint ${Number(sprints?.length) + 1}`
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }

    )
      .then((res) => {
        setSprints([...sprints, res?.data?.sprint]);
        activityModalLoading();
        message.success("Create new sprint successfully");
        showNotification(`Project update`, `${user?.username} just create a new sprint in project "${project?.projectName}".`);
      })
      .catch((error) => {
        // message.error(error?.response?.data?. message || "Failed to create sprint!");})
        message.error(error?.response?.data?.error?.message || "Failed to create sprint!");
      })


  }

  const ACTIVE_DRAG_ITEM_TYPE = {
    STAGE: "ACTIVE_DRAG_ITEM_TYPE_STAGE",
    ACTIVITY: "ACTIVE_DRAG_ITEM_TYPE_ACTIVITY"
  }

  // Edit sprint
  const editSprint = (sprint, field, data) => {
    if (field && data) {
      if (field == "sprintStatus" && data == "active") {
        const activeSprint = sprints.find(s => s.sprintStatus == "active" && s._id != sprint?._id);
        if (activeSprint) {
          message.error("Only one sprint can be active at a time. Please complete or deactivate the current active sprint first.");
          return;
        }
      }
      axios.put(`${siteAPI}/${site?._id}/projects/${project?._id}/sprints/${sprint?._id}/edit`,
        { [field]: data },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
        .then((res) => {
          const updatedSprints = sprints.map(s => s._id === res?.data?.sprint?._id ? res?.data?.sprint : s);
          setSprints(updatedSprints);
          activityModalLoading();

          message.success("Edit sprint successfully");
          showNotification(`Project update`, `${user?.username} just edit sprint  "${sprint?.sprintName}".`);
        })
        .catch((err) => {
          message.error(err?.data?.error?.message || "Edit sprint fail!")
        })
    }
  }

  // Delete sprint 
  const handleDeleteClick = () => {
    if (deleteSprint) {
      const hasActivities = activities.filter(activity => activity.sprint?._id == deleteSprint?._id);

      if (hasActivities?.length > 0) {
        setIsDeleteSprint(true);
        console.log("delte");

      } else {
        handleDeleteSprint();
        console.log("delte");
      }
    }
  };
  const handleDeleteSprint = () => {
    axios.put(`${siteAPI}/${site?._id}/projects/${project?._id}/sprints/${deleteSprint?._id}/delete`,
      { newSprint: selectedSprint },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
      .then((res) => {
        setSprints(sprints.filter((sprint) => sprint?._id != deleteSprint?._id));
        activityModalLoading();
        setSelectedSprint();
        setDeleteSprint();
        setIsDeleteSprint(false);
        message.success("Delete sprint successfully");
        showNotification(`Project update`, `${user?.username} just delete sprint  "${deleteSprint?.sprintName}".`);

      })
      .catch((err) => {
        message.error(err?.response?.data?.error?.message || "Delete sprint fail!")
      })
  };
  return (
    <DndContext

      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    // onDragOver={handleDragOver}
    >
      <div style={{ padding: " 2%", overflow: "auto", maxHeight: "100%" }}>



        <Collapse
          activeKey={expandedPanels}
          bordered={false}
          onChange={(keys) => setExpandedPanels(keys)}
          style={{ background: "white", borderRadius: 0 }}>
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
                <Button size="small" variant="outlined" color="default" style={{ borderRadius: "0%" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateSprint();
                  }}
                > Create sprint</Button>
              </Space>
            </Flex>
          } key="0">
            <SortableContext
              items={filteredActivitites?.filter(a => a && !a.sprint).map(a => a._id)}
              strategy={verticalListSortingStrategy} >
              {/* Activity */}
              <div style={{ minHeight: "50px" }} >
                {filteredActivitites?.filter(a => a && !a.sprint).map((activity) => {
                  return <SprintActivity activity={activity} />
                })}
              </div >
            </SortableContext>
            {/* Create activity */}
            {createActivityModal ? (
              <Input
                autoFocus
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                onPressEnter={() => { handleActivityCreate("", stages[0]?.stageName, "task", null) }}
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
          {sprints?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((sprint) => {
            return (<Panel style={{ background: "#F5F5F5", margin: "0 0 2% 0", borderRadius: 0 }}

              header={
                <Flex justify="space-between" align="start">
                  <Space>
                    <Title level={5} style={{ margin: 0 }}>{sprint?.sprintName}</Title>
                    <DatePicker.RangePicker format="DD-MM-YYYY" placeholder={['Start date', 'Due date']} value={[dayjs("2024-03-01"), dayjs("2024-03-15")]} variant="underlined" disabled />
                    <small style={{ color: grey[2] }}>({activities?.filter((activity) => activity?.sprint?._id == sprint?._id)?.length} activities)</small>
                  </Space>
                  <Space>
                    {sprint?.sprintStatus == "active" && (<Button
                      size="small"
                      variant="solid"
                      color="green"
                      style={{ borderRadius: "0%" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        showCompletedSprint(sprint);
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
                      disabled={sprints?.some(s => s?.sprintStatus == "active" && s._id != sprint?._id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        editSprint(sprint, "sprintStatus", "active")

                      }}
                    >
                      Active sprint
                    </Button>)
                    }
                    <Dropdown
                      overlay={
                        <Menu onClick={(e) => e.domEvent.stopPropagation()}>
                          <Menu.Item disabled={sprint?.sprintStatus == "completed" ? true : false}>Edit sprint</Menu.Item>
                          <Menu.Item disabled={sprint?.sprintStatus == "completed" ? true : false} danger onClick={() => {
                            setDeleteSprint(sprint); // Cập nhật deleteSprint trước
                            setTimeout(() => handleDeleteClick(), 100);
                          }} >Delete sprint</Menu.Item>
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
              <SortableContext
                items={filteredActivitites?.filter(activity => activity?.sprint?._id == sprint?._id)
                  .map(activity => activity._id)}
                strategy={verticalListSortingStrategy} >
                <div style={{

                  border: filteredActivitites?.filter(activity => activity?.sprint?._id === sprint?._id).length > 0 ? "" : "2px dashed lightgray",
                }} >
                  {!filteredActivitites?.filter(activity => activity?.sprint?._id === sprint?._id).length > 0
                    &&
                    (<p style={{ color: "gray", fontStyle: "italic" }}><DownloadOutlined /> Drop activities here</p>)
                  }
                  {filteredActivitites?.filter((activity) => activity?.sprint?._id == sprint?._id)
                    .map((activity) => (
                      <SprintActivity key={activity?._id} activity={activity} />
                    ))}
                </div>

              </SortableContext>


            </Panel>)
          })}



        </Collapse>


        {/* Complete modal */}
        <CompleteSprintModal />
        {/* Activity modal */}

        <ActivityDetail />

        {/* Delete sprint modal */}
        <Modal
          title="Move activities before deleting"
          open={isDeleteSprint}
          onOk={handleDeleteSprint}
          onCancel={() => setIsDeleteSprint(false)}
          okText="Move & Delete"
          cancelText="Cancel"
        >
          <p>This sprint has activities. Please select where to move them:</p>
          <Select
            style={{ width: "100%" }}
            placeholder="Select sprint or backlog"
            defaultValue={""}
            onChange={(value) => setSelectedSprint(value)}
          >
            <Select.Option value="">Backlog</Select.Option>
            {sprints
              .filter(s => s?._id !== deleteSprint?._id) // Không hiển thị chính sprint cần xóa
              .map(s => (
                <Select.Option key={s?._id} value={s?._id}>
                  {s.sprintName}
                </Select.Option>
              ))}
          </Select>
        </Modal>

      </div >
    </DndContext >

  );
};

export default SprintBoard;