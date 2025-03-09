import { blue, cyan, gray, orange, red, yellow } from '@ant-design/colors'
import { BugOutlined, CalendarOutlined, CloseOutlined, CommentOutlined, DeleteOutlined, DoubleRightOutlined, DownOutlined, EditOutlined, EllipsisOutlined, FireOutlined, FormOutlined, MinusOutlined, MoreOutlined, PaperClipOutlined, PieChartOutlined, PlusOutlined, SendOutlined, UpOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, DatePicker, Dropdown, Flex, Input, List, Menu, Modal, Popconfirm, Progress, Row, Select, Space, Tag, Tooltip, Typography, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Option } from 'antd/es/mentions'
import Title from 'antd/es/typography/Title'
import React, { useContext, useEffect, useState } from 'react'
import moment from "moment";
import { AppContext } from '../../context/AppContext'
import dayjs from 'dayjs'
import SubActivity from './SubActivity'
import axios from 'axios'


function ActivityDetail() {
  const { accessToken, siteAPI, site, project, createSubActivity, setCreateSubActivity, activityModal, setActivityModal, handleActivityCreate, activityName, setActivityName, activities, activity, setActivity, showDeleteActivity, closeActivity, handleDelete, handleCloseDeleteActivityModal, deleteActivity, setDeleteActivity, activityToDelete, setActivityToDelete, confirmActivity, setConfirmActivity } = useContext(AppContext)
  const [comments, setComments] = useState([
    { id: 1, author: "John Doe", content: "Great work!", time: moment().subtract(1, "hour").fromNow() },
    { id: 2, author: "Jane Smith", content: "We need to fix this issue.", time: moment().subtract(10, "minutes").fromNow() },
    { id: 3, author: "Jane Smith", content: "We need to fix this issue.", time: moment().subtract(10, "minutes").fromNow() },
    { id: 4, author: "Jane Smith", content: "We need to fix this issue.", time: moment().subtract(10, "minutes").fromNow() },
    { id: 5, author: "Jane Smith", content: "We need to fix this issue.", time: moment().subtract(10, "minutes").fromNow() },
    { id: 6, author: "Jane Smith", content: "We need to fix this issue.", time: moment().subtract(10, "minutes").fromNow() },
    { id: 7, author: "Jane Smith", content: "We need to fix this issue.", time: moment().subtract(10, "minutes").fromNow() },
    { id: 8, author: "Jane Smith", content: "We need to fix this issue.", time: moment().subtract(10, "minutes").fromNow() },
    { id: 9, author: "Jane Smith", content: "We need to fix this issue.", time: moment().subtract(10, "minutes").fromNow() },
    { id: 10, author: "Jane Smith", content: "We need to fix this issue.", time: moment().subtract(10, "minutes").fromNow() },
    { id: 11, author: "Jane Smith", content: "We need to fix this issue.", time: moment().subtract(10, "minutes").fromNow() },
  ]);


  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [isDescription, setIsDescription] = useState(false)
  const [newDescription, setNewDescription] = useState("");
  const [editActivity, setEditActivity] = useState({})


  // fetch activity
  useEffect(() => {
    if (activity) {
      const updatedActivity = activities.find(a => a._id === activity._id);
      if (updatedActivity) {
        setActivity(updatedActivity);
        // setChild(updatedActivity?.child?.map((c) => activities.find((a) => c === a._id)));
        setEditActivity({
          activityTitle: activity?.activityTitle,
          description: activity?.description || "",
          parent: activity?.parent || null,
          startDate: activity?.startDate || null,
          dueDate: activity?.dueDate || null
        })
      }
    }

  }, [activities, activity, createSubActivity])

  // edit activity
  const [isTitle, setIsTitle] = useState(false)

  console.log(editActivity);

  const handleEditActivity = async () => {
    console.log(editActivity);
    await axios.put(`${siteAPI}/${site?._id}/projects/${project?._id}/activities/${activity?._id}/edit`,
      { ...editActivity },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }

    )
      .then((res) => { setActivity(res?.data?.activity) })
      .catch((err) => {
        console.log(err?.response?.data?.error?.message);
        message.error(err?.response?.data?.error?.message)
      })
  }
  //Subactivity
  const child = activity?.child?.map((c) => activities.find((a) => c == a._id));
  const [selectedType, setSelectedType] = useState("subtask")
  // const [child, setChild] = useState([])

  // const subtasks = child?.filter(c => c.type?.typeName == "subtask");
  // const bugs = child?.filter(c => c.type?.typeName == "bug");
  const handleCreateSubActivityCancel = () => {

    setCreateSubActivity(false);
    setActivityName();
  };

  const showCreateSubactivity = () => {
    setCreateSubActivity(true);
  };

  const handleCreateSubactivityOk = () => {
    if (activityName.trim().length < 3) {
      message.warning("Activity title must be at least 3 characters!");
      return;
    }
    setCreateSubActivity(false);
    handleActivityCreate(activity?.sprint?.sprintName, "to do", selectedType, activity?._id)
  };

  const handleCreateSubactivityCancel = () => {
    setCreateSubActivity(false);
  };


  //Comment
  const addComment = () => {
    if (!newComment.trim()) {
      message.warning("Comment cannot be empty!");
      return;
    }

    const newCommentObj = {
      id: comments.length + 1,
      author: "Current User", // Đây là user hiện tại, có thể thay bằng user đăng nhập
      content: newComment,
      time: "Just now",
    };

    setComments([newCommentObj, ...comments]); // Thêm bình luận mới lên đầu danh sách
    setNewComment("");
    message.success("Comment added successfully!");
  };

  const deleteComment = (id) => {
    setComments(comments.filter(comment => comment.id !== id));
    message.success("Comment deleted!");
  };
  const showEditComment = (comment) => {
    setCurrentComment(comment);
    setEditedComment(comment.content);
    setEditComment(true);
  };

  const handleEditCommentOk = () => {
    setEditComment(false);
  };

  const handleEditCommentCancel = () => {
    setEditComment(false);
  };


  return (
    <Modal
      width={{
        xs: '100%',
        sm: '95%',
        md: '90%',
        lg: '85%',
        xl: '80%',
        xxl: '75%',
      }}

      open={activityModal}
      footer={[]}
      onClose={closeActivity}
      closeIcon={null}
      style={{ borderRadius: "0" }}
      modalRender={(node) => (
        <div>
          {React.cloneElement(node, {
            style: { padding: 0, borderRadius: "2px" },
          })}
        </div>
      )}
      centered
    >
      <div>
        {/* Modal header*/}

        <Row justify="space-between" style={{ padding: "1% 2%", borderBottom: `solid 1px ${cyan[`1`]}` }}>
          <Col></Col>
          <Col>
            <Space style={{ padding: 0 }}>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1" style={{ color: red[6] }} onClick={() => showDeleteActivity(activity.activityTitle)} >
                      Remove activity
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button style={{ borderRadius: 0 }}><EllipsisOutlined /></Button>

              </Dropdown>
              <Button style={{ borderRadius: 0 }} color="danger" onClick={closeActivity}><CloseOutlined /></Button>
            </Space>
          </Col>
        </Row>
        {/* Modal content*/}

        <Row justify="space-between" style={{ height: "80vh", padding: "0 2%", overflow: "auto", flexWrap: "wrap" }}>
          {/* Activity detail*/}

          <Col span={16} style={{ height: "100%", borderRight: `solid 1px ${cyan[`1`]}`, overflow: "auto" }}>
            <Row justify="space-between" style={{ padding: "1% 0" }}>
              <Col span={15} style={{ padding: "0 1%" }}>
                <Space style={{ width: "60%", textAlign: "center", padding: "2% 0" }} >
                  {isTitle == false ? (<Space onClick={() => setIsTitle(true)}>
                    {activity?.type?.typeName == "task" && <FormOutlined style={{ color: blue[6] }} />}
                    {activity?.type?.typeName == "subtask" && <PaperClipOutlined style={{ color: blue[6] }} />}
                    {activity?.type?.typeName == "bug" && <BugOutlined style={{ color: yellow[6] }} />}
                    <Title level={5} style={{ margin: "0" }} > {activity?.activityTitle}</Title>
                  </Space>) :
                    (<Input
                      autoFocus
                      value={editActivity.activityTitle}
                      onChange={(e) => setEditActivity({
                        ...editActivity,
                        activityTitle: e.target.value
                      })}
                      onPressEnter={handleEditActivity}
                      onBlur={() => {
                        setIsTitle(false);
                        setEditActivity({
                          ...editActivity,
                          activityTitle: activity?.activityTitle
                        })
                      }}
                      placeholder="Enter activity name"
                      prefix={<EditOutlined style={{ color: blue[6] }} />}
                      style={{ width: "100%", borderRadius: "0", margin: "1% 0", padding: "0.5% 1%" }}
                    />)}
                </Space>
                <Space direction="vertical" style={{ width: "60%", textAlign: "center", padding: "2% 0" }}>

                  {child?.length > 0 && <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><PieChartOutlined /> Progress </small>
                    <text ><Progress type="circle" percent={(child?.filter((c) => c?.stage?.stageStatus == "done").length / child?.length) * 100} size={15} showInfo={false} /> {(child?.filter((c) => c?.stage?.stageStatus == "done").length / child?.length) * 100 || 0}%</text>
                  </Flex>}
                  {/* Priority */}
                  <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><Tag />Priority </small>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item key="1" icon={<DoubleRightOutlined rotate="-90" />} style={{ color: red[6] }} >
                            Highest
                          </Menu.Item>
                          <Menu.Item key="2" icon={<UpOutlined />} style={{ color: orange[6] }} >
                            High
                          </Menu.Item>
                          <Menu.Item key="3" icon={<MinusOutlined />} style={{ color: blue[6] }} >
                            Medium
                          </Menu.Item>
                          <Menu.Item key="4" icon={<DownOutlined />} style={{ color: cyan[6] }} >
                            Low
                          </Menu.Item>
                          <Menu.Item key="5" icon={<DoubleRightOutlined rotate="90" />} style={{ color: cyan[4] }} >
                            Lowest
                          </Menu.Item>
                        </Menu>
                      }
                    >
                      <span>
                        {activity?.priority == "highest" && <span><DoubleRightOutlined rotate="-90" style={{ color: red[6] }} /> Highest</span>}
                        {activity?.priority == "high" && <span><UpOutlined style={{ color: orange[6] }} /> High</span>}
                        {activity?.priority == "medium" && <span><MinusOutlined style={{ color: blue[6] }} /> Medium</span>}
                        {activity?.priority == "low" && <span><DownOutlined style={{ color: cyan[6] }} /> Low</span>}
                        {activity?.priority == "lowest" && <span><DoubleRightOutlined rotate="90" style={{ color: cyan[4] }} /> Lowest</span>}
                      </span>
                    </Dropdown>
                  </Flex>

                  <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><UserOutlined /> Assignee </small>
                    {activity?.assignee?.length > 0 ? (
                      <Avatar.Group max={2} size={25}>
                        {activity.assignee.map((a) => (
                          <Tooltip key={a._id} title={a.username} placement="top">
                            <Avatar
                              src={a.userAvatar || "https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"}
                              size="small"
                            />
                          </Tooltip>
                        ))}
                        <Tooltip title="Assign member" placement="top"  >
                          <Avatar icon={<UserAddOutlined />} size="small" style={{ cursor: "pointer" }} onClick={() => { console.log("assign member"); }} />
                        </Tooltip>
                      </Avatar.Group>
                    ) : (
                      <Tooltip title="Unassigned">
                        <Avatar icon={<UserAddOutlined />} size="small" />
                      </Tooltip>
                    )}
                  </Flex>
                  <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><CalendarOutlined />Start date  </small>
                    <DatePicker variant="underlined" value={activity?.startDate ? dayjs(activity.dueDate) : null} />
                  </Flex>
                  <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><CalendarOutlined />Due date </small>
                    <DatePicker variant="underlined" value={activity?.dueDate ? dayjs(activity.dueDate) : null} />
                  </Flex>


                </Space>
              </Col>
              <Col span={5} align="center" style={{ padding: "0 1%" }}>
                <Select

                  value={`${activity?.stage?.stageName?.toUpperCase()}`}
                  onChange="{setMoveTo}"
                  style={{ width: "60%", borderRadius: "0" }}
                  dropdownStyle={{ borderRadius: 0 }}

                >
                  <Option value="Todo">Todo</Option>
                  <Option value="Doing">Doing</Option>
                  <Option value="Done">Done</Option>
                </Select>
              </Col>
              <Col span={22} style={{ padding: "0 1%" }}>
                <Space direction="vertical" style={{ width: "100%", textAlign: "center", padding: "2% 0" }}>
                  {/* Description*/}

                  <Flex justify="space-between" align="center" wrap={true} style={{ width: "100%" }}>
                    <text style={{ fontWeight: "bolder" }}> Description </text>
                    {isDescription ?
                      (<Flex wrap={true} style={{ width: "100%" }}>
                        <TextArea rows={5} style={{ borderRadius: "2px", marginBottom: "2%" }} placeholder="Add a description ..."
                          defaultValue={activity?.description}
                          onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <Flex justify="end" style={{ width: "100%", marginBottom: "2%" }}>
                          <Space>
                            <Button style={{ borderRadius: "0" }} onClick={() => { setIsDescription(false); setNewDescription("") }}>Close</Button>
                            <Button style={{ borderRadius: "0" }} variant="solid" color="primary">Save</Button>
                          </Space>
                        </Flex>
                      </Flex>) : (
                        <Flex wrap={true} style={{ width: "100%", marginBottom: "5%", cursor: "pointer" }}>
                          <TextArea placeholder="Add a description ..." variant="filled"
                            style={{ minHeight: "10vh", border: 0, cursor: "pointer", borderRadius: "2px", marginBottom: "2%" }}
                            defaultValue={activity?.description}
                            onClick={() => { setIsDescription(true) }}
                          />
                        </Flex>
                      )}
                  </Flex>


                  <Flex justify="space-between" align="start" wrap={true} style={{ width: "100%" }}>
                    <text style={{ fontWeight: "bolder", marginBottom: "2%" }}> Subactivities </text>
                    <Space>
                      <Select style={{ width: "12vh" }} placeholder="Order by" size='small' variant='borderless' disabled={child?.length <= 0}>
                        <Option key='created'>Created at</Option>
                        <Option key='assignee'>Assignee</Option>
                        <Option key='status'>Status</Option>
                        <Option key='priority'>Priority</Option>
                        <Option key='priority'>Activity type</Option>
                      </Select>
                      <Tooltip title="Add a sub activity...">
                        <PlusOutlined onClick={showCreateSubactivity} />
                      </Tooltip>
                    </Space>
                    {child?.length > 0 ? (
                      <List bordered style={{ width: "100%", borderRadius: "0" }} size='small'>
                        {child?.map((c) => {

                          return (<SubActivity activity={c} />)
                        }

                        )}

                      </List>
                    ) : (
                      <Tooltip title="Add a sub activity...">
                        <List bordered style={{ maxHeight: "30vh", width: "100%", borderRadius: "0", overflowY: "auto", cursor: "pointer" }} size='small' onClick={showCreateSubactivity}>
                        </List>
                      </Tooltip>
                    )}
                  </Flex>



                </Space>
              </Col>
            </Row>

          </Col>
          {/* Comment*/}

          <Col span={8} style={{ height: "80vh", padding: "0 0 0 2%", overflow: "auto" }}>
            <Title style={{ height: "5%" }} level={5}>Comments</Title>
            <Flex vertical justify='start' style={{ height: "88%", padding: "0", width: "100%" }}>
              <Space.Compact
                style={{
                  width: '100%',
                }}
              >
                <Input prefix={<CommentOutlined />} style={{ borderRadius: "0" }} />
                <Button><SendOutlined /></Button>
              </Space.Compact>
              <List
                dataSource={comments}
                style={{ height: "90%", padding: "5% 3%", overflow: "auto", margin: "2% 0 0 0" }}
                renderItem={(comment) => (
                  <List.Item
                    actions={[
                      <Tooltip title="Edit" key="edit">
                        <EditOutlined style={{ color: "#FFC107" }} onClick={() => showEditComment(comment)} />
                      </Tooltip>,
                      <Popconfirm
                        title="Are you sure you want to delete this comment?"
                        onConfirm={() => deleteComment(comment.id)}
                        okText="Yes"
                        cancelText="No"
                        key="delete"
                      >
                        <Tooltip title="Delete">
                          <DeleteOutlined style={{ color: "red" }} />
                        </Tooltip>
                      </Popconfirm>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />}
                      title={<strong>{comment.author}</strong>}
                      description={<span>{comment.content} <br /> <small style={{ color: "#888" }}>{comment.time}</small></span>}
                    />
                  </List.Item>
                )}
              />

            </Flex>
            {/* Modal for edit comment */}

            <Modal
              title="Edit Comment"
              visible={editComment}
              onOk={handleEditCommentCancel}
              onCancel={handleEditCommentOk}
              footer={[
                <Button key="cancel" onClick={handleEditCommentCancel}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={handleEditCommentOk}>Save</Button>
              ]}
            >
              <Input.TextArea
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                rows={4}
              />
            </Modal>

            {/* Modal for Creating New Activity */}
            <Modal
              title="Create subactivity"
              visible={createSubActivity}
              onOk={handleCreateSubactivityOk}
              onCancel={handleCreateSubActivityCancel}
              footer={[
                <Button key="cancel" onClick={handleCreateSubActivityCancel}>Cancel</Button>,
                <Button key="submit" type="primary" onClick={handleCreateSubactivityOk}>Create</Button>
              ]}
            >
              <Flex style={{ borderRadius: 0, width: "100%" }}>
                <Select variant='borderless' style={{ borderRadius: 0, width: "25%" }} defaultValue={"subtask"} onSelect={(value) => { setSelectedType(value || "subtask") }}>
                  <Option key='subtask' value='subtask'><PaperClipOutlined styles={{ color: blue[6] }} /> Subtask</Option>
                  <Option key='bug' value='bug'><BugOutlined styles={{ color: orange[6] }} /> Bug</Option>
                </Select>
                <Input
                  placeholder="Enter activity title"
                  value={activityName}

                  style={{ borderRadius: 0, width: "75%" }}
                  onChange={(e) => setActivityName(e.target.value)}
                />

              </Flex  >
            </Modal>
          </Col>
        </Row >
      </div >
    </Modal >
  )
}

export default ActivityDetail
