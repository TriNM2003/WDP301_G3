import React, { useContext, useEffect, useState } from "react";
import { Collapse, Button, Tag, Space, Flex, Dropdown, Menu, Avatar, Tooltip, DatePicker, Progress, Input, Modal, message, Select, Form } from "antd";
import { CheckOutlined, DoubleRightOutlined, DownOutlined, DownloadOutlined, EllipsisOutlined, FieldTimeOutlined, FormOutlined, MinusOutlined, PlusOutlined, UpOutlined } from "@ant-design/icons";
import { blue, cyan, gray, grey, orange, red } from "@ant-design/colors";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import { DndContext, DragOverlay, MouseSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CompleteSprintModal from "./CompleteSprintModal";
import ActivityDetail from "../../../Activity/ActivityDetail";
import SprintActivity from "../../../Activity/SprintActivity";
import { AppContext } from "../../../../context/AppContext";
import { useDroppable } from "@dnd-kit/core";

import axios from "axios";
import DropContainer from "./DropContainer";
import authAxios from "../../../../utils/authAxios";

const { Panel } = Collapse;

const SprintBoard = () => {
  const { activities, activityTypes, setActivities, showNotification, stages, activityModalLoading,setRefreshNoti, selectedSprint, setSelectedSprint, handleMoveActivity, user, sprints, siteAPI, site, accessToken, project, setSprints, activityModal, setActivityModal, showActivity, closeActivity, handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName, completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel } = useContext(AppContext)
  const [expandedPanels, setExpandedPanels] = useState(["0"]); // Mở Backlog mặc định
  const [activeDragActivity, setActiveDragActivity] = useState(null);

  // Activities
  const [filterActivityType, setFliterActivityType] = useState(["task"]);
  const filteredActivitites = activities?.filter((a) => a && (filterActivityType.length > 0 ? filterActivityType.includes(a?.type?.typeName) : true));
  const [isDeleteSprint, setIsDeleteSprint] = useState(false);
  const [deleteSprint, setDeleteSprint] = useState(null);
  const [editSprintModal, setEditSprintModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [editSprintForm] = Form.useForm();

  //DND
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // Cần di chuyển chuột ít nhất 5px để kích hoạt drag
    },
  });

  const sensors = useSensors(mouseSensor);
  const handleDragEnd = (e) => {
    // console.log(e);
    const { over, active } = e;

    if (!over || !activeDragActivity) {
      setActiveDragActivity(null);
      return;
    }

    const activity = activities?.find((activity) => activity?._id == active.id);
    const overSprintId = over?.data?.current?.sprint?._id || "0"; // over.id sẽ là sprint id hoặc "0" cho backlog

    const currentSprintId = activeDragActivity?.sprint?._id || "0";
    const targetSprint = sprints.find((s) => s._id === overSprintId);
    if (targetSprint?.sprintStatus == "completed") {
      message.warning("Cannot move activity to a completed sprint.");
      setActiveDragActivity(null);
      return;
    }
    if (overSprintId !== currentSprintId) {
      // Gọi hàm moveActivity
      handleMoveActivity("sprint", activity, overSprintId == "0" ? null : overSprintId);
    }

    setActiveDragActivity(null);
  };


  const handleDragStart = (e) => {
    // console.log(e);

    const { active } = e;
    const activityId = active?.id;

    const foundActivity = activities.find(act => act?._id === activityId);
    if (foundActivity) {
      setActiveDragActivity(foundActivity);
    }
  };


  useEffect(() => {
    const nonCompletedSprintIds = sprints
      .filter(s => s?.sprintStatus != "completed")
      .map(s => s?._id.toString());

    setExpandedPanels(["0", ...nonCompletedSprintIds]);
  }, [sprints]);


  // const handleDragOver = (event) => {
  //   const { over } = event;

  //   if (over?.id && !expandedPanels.includes(over.id)) {
  //     console.log("handle open",(prev) => [...prev, over.id]);
  //   }
  // };
  const handleCreateSprint = async () => {
    authAxios.post(`${siteAPI}/${site?._id}/projects/${project?._id}/sprints/create`,
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
        setRefreshNoti(prev => !prev);
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
  const editSprint = (sprint, updateData) => {
    if (updateData.sprintStatus == "active") {
      const activeSprint = sprints.find(s => s.sprintStatus == "active" && s?._id != sprint?._id);
      if (activeSprint) {
        message.error("Only one sprint can be active at a time.");
        return;
      }
    }

    if (sprint) {
      authAxios.put(`${siteAPI}/${site?._id}/projects/${project?._id}/sprints/${sprint?._id}/edit`, updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          setSelectedSprint(res.data.sprint)
          const updatedSprints = sprints.map(s => s?._id == res.data.sprint?._id ? res.data.sprint : s);
          setSprints(updatedSprints);
          setRefreshNoti(prev => !prev);

          activityModalLoading();
          message.success("Edit sprint successfully");
          showNotification(`Project update`, `${user?.username} just edited sprint "${sprint?.sprintName}".`);
        })
        .catch((err) => {
          message.error(err?.response?.data?.error?.message || "Edit sprint failed!");
        });
    }
  };
  useEffect(() => {
    if (selectedSprint && editSprintModal) {
      editSprintForm.setFieldsValue({
        sprintName: selectedSprint?.sprintName,
        sprintGoal: selectedSprint?.sprintGoal,
        startDate: selectedSprint?.startDate ? dayjs(selectedSprint.startDate) : null,
        dueDate: selectedSprint?.dueDate ? dayjs(selectedSprint.dueDate) : null,
      });
    }
  }, [selectedSprint, editSprintModal]);


  const handleEditSprint = async () => {
    try {
      const values = await editSprintForm.validateFields();
      const updatedFields = {};

      if (values.sprintName !== selectedSprint?.sprintName) {
        updatedFields.sprintName = values.sprintName;
      }

      if ((values.sprintGoal || "") !== (selectedSprint?.sprintGoal || "")) {
        updatedFields.sprintGoal = values.sprintGoal || null;
      }

      const oldStart = selectedSprint?.startDate ? dayjs(selectedSprint.startDate) : null;
      const newStart = values.startDate || null;

      if (!oldStart?.isSame(newStart)) {
        updatedFields.startDate = newStart;
      }

      const oldDue = selectedSprint?.dueDate ? dayjs(selectedSprint.dueDate) : null;
      const newDue = values.dueDate || null;

      if (!oldDue?.isSame(newDue)) {
        updatedFields.dueDate = newDue;
      }

      if (Object.keys(updatedFields).length > 0) {
        setEditLoading(true); // bật loading
        await new Promise(resolve => setTimeout(resolve, 500)); // delay 500ms
        await editSprint(selectedSprint, updatedFields); // chờ edit xong
      }

      editSprintForm.resetFields();

    } catch (err) {
      console.log(err);
      message.error(err?.message || "No thing to update!");

    } finally {
      setEditLoading(false); // tắt loading
    }
  };




  // Delete sprint 
  const handleDeleteClick = () => {
    if (deleteSprint) {
      const hasActivities = activities.filter(activity => activity.sprint?._id == deleteSprint?._id);

      if (hasActivities?.length > 0) {
        setIsDeleteSprint(true);

      } else {
        handleDeleteSprint();

      }
    }
  };
  const handleDeleteSprint = () => {
    authAxios.put(`${siteAPI}/${site?._id}/projects/${project?._id}/sprints/${deleteSprint?._id}/delete`,
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
        setRefreshNoti(prev => !prev);
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
      sensors={sensors}
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
              id="0"
              items={filteredActivitites?.filter(a => a && !a.sprint).map(a => a._id)}
              strategy={verticalListSortingStrategy} >
              {/* Activity */}
              <DropContainer id="0">
                {filteredActivitites?.filter(a => a && !a.sprint).map((activity) => {
                  return <SprintActivity key={activity?._id} activity={activity} data-sprint-id={activity?.sprint?._id || "0"} />
                })}
              </DropContainer >
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
                    <DatePicker.RangePicker
                      format="DD-MM-YYYY"
                      placeholder={['Start date', 'Due date']}
                      value={
                        [sprint?.startDate && dayjs(sprint.startDate), sprint?.dueDate && dayjs(sprint.dueDate)]

                      }
                      variant="underlined"
                      disabled
                    />
                    <small style={{ color: grey[2] }}>({activities?.filter((activity) => activity?.sprint?._id == sprint?._id)?.length} activities)</small>
                  </Space>
                  <Space>
                    {sprint?.sprintStatus == "completed" && (<Button
                      size="small"
                      variant="solid"
                      color="green"
                      style={{ borderRadius: "0%" }}
                      onClick={(e) => {
                        e.stopPropagation();

                      }}
                    >
                      <CheckOutlined /> Completed
                    </Button>)
                    }
                    {sprint?.sprintStatus == "active" && (<Button
                      size="small"
                      variant="solid"
                      style={{ borderRadius: "0%" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        showCompletedSprint(sprint);
                      }}
                    >
                      Complete sprint
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
                        editSprint(sprint, { sprintStatus: "active" })

                      }}
                    >
                      Active sprint
                    </Button>)
                    }
                    <Dropdown
                      overlay={
                        <Menu onClick={(e) => e.domEvent.stopPropagation()}>
                          <Menu.Item

                            onClick={() => {
                              setSelectedSprint(sprint)
                              setEditSprintModal(true);

                            }}
                          >
                            Edit sprint
                          </Menu.Item>
                          <Menu.Item danger onClick={() => {
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
                id={sprint?._id}
                items={filteredActivitites?.filter((activity) => (activity && activity?.sprint && activity?.sprint?._id )&& activity?.sprint?._id == sprint?._id)
                  ?.map(activity => activity?._id)}
                strategy={verticalListSortingStrategy} >
                <DropContainer id={sprint?._id} style={{

                  border: filteredActivitites?.filter(activity => activity?.sprint?._id == sprint?._id)?.length > 0 ? "" : "2px dashed lightgray",
                }} >
                  {!filteredActivitites?.filter(activity => activity?.sprint?._id == sprint?._id).length > 0
                    &&
                    (<p style={{ color: "gray", fontStyle: "italic" }}><DownloadOutlined /> Drop activities here</p>)
                  }
                  {filteredActivitites?.filter((activity) => activity?.sprint?._id == sprint?._id)
                    .map((activity) => (
                      <SprintActivity key={activity?._id} activity={activity} data-sprint-id={activity?.sprint?._id || "0"} isPlaceholder={activeDragActivity?._id == activity?._id} />
                    ))}
                </DropContainer>

              </SortableContext>


            </Panel>)
          })}



        </Collapse>
        <DragOverlay>
          {activeDragActivity && (
            <SprintActivity
              activity={activeDragActivity}
              isDragging={true}
            />
          )}
        </DragOverlay>


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
        {/* Edit modal sprint */}
        <Modal
          open={editSprintModal}
          title="Edit Sprint"
          onCancel={() => {
            setEditSprintModal(false);
            setSelectedSprint(null);
            editSprintForm.resetFields();
          }}
          onOk={handleEditSprint}
          confirmLoading={editLoading}
          okText="Save"
        >
          <Form
            form={editSprintForm}
            layout="vertical"
            initialValues={{
              sprintName: selectedSprint?.sprintName,
              sprintGoal: selectedSprint?.sprintGoal,
              startDate: selectedSprint?.startDate ? dayjs(selectedSprint.startDate) : null,
              dueDate: selectedSprint?.dueDate ? dayjs(selectedSprint.dueDate) : null,
            }}
          >
            <Form.Item label="Sprint name" name="sprintName" rules={[{ required: true, message: "Please enter sprint name" }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Sprint goal" name="sprintGoal">
              <Input />
            </Form.Item>
            <Form.Item
              label="Start date"
              name="startDate"
              dependencies={['dueDate']}

            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => {
                  const end = editSprintForm.getFieldValue('dueDate');
                  return end && current && current.isSameOrAfter(end, 'day');
                }}
              />
            </Form.Item>

            <Form.Item
              label="End date"
              name="dueDate"
              dependencies={['startDate']}

            >
              <DatePicker
                style={{ width: "100%" }}
                disabledDate={(current) => {
                  const start = editSprintForm.getFieldValue('startDate');
                  return start && current && current.isSameOrBefore(start, 'day');
                }}
              />
            </Form.Item>

          </Form>
        </Modal>


      </div >
    </DndContext >

  );
};

export default SprintBoard;