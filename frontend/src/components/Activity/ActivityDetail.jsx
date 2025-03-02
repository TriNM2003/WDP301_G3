import { blue, cyan, gray, orange, red, yellow } from '@ant-design/colors'
import { CalendarOutlined, CloseOutlined, CommentOutlined, DeleteOutlined, DoubleRightOutlined, DownOutlined, EditOutlined, EllipsisOutlined, FireOutlined, FormOutlined, MinusOutlined, MoreOutlined, PaperClipOutlined, PieChartOutlined, PlusOutlined, SendOutlined, UpOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, DatePicker, Dropdown, Flex, Input, List, Menu, Modal, Popconfirm, Progress, Row, Select, Space, Tag, Tooltip, Typography, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Option } from 'antd/es/mentions'
import Title from 'antd/es/typography/Title'
import React, { useContext, useState } from 'react'
import moment from "moment";
import { AppContext } from '../../context/AppContext'

function ActivityDetail({ closeTask }) {
  const {showDeleteTask, handleDelete, handleCloseDeleteTaskModal, deleteTask, setDeleteTask, taskToDelete, setTaskToDelete, confirmTask, setConfirmTask}= useContext(AppContext)
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
  const [createSubTask, setCreateSubTask] = useState(false);
  const [newSubTask, setNewSubTask] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  //Subtask
  const handleCreateSubTaskCancel = () => {
    setCreateSubTask(false);
  };

  const showCreateSubtask = () => {
    setCreateSubTask(true);
  };

  const handleCreateSubtaskOk = () => {
    console.log("New Task Created:", newSubTask);
    setCreateSubTask(false);
    setNewSubTask("");
  };

  const handleCreateSubtaskCancel = () => {
    setCreateSubTask(false);
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
    <div>
      {/* Modal header*/}

      <Row justify="space-between" style={{ padding: "1% 2%", borderBottom: `solid 1px ${cyan[`1`]}` }}>
        <Col></Col>
        <Col>
          <Space style={{ padding: 0 }}>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1" style={{ color: red[6] }} onClick={()=>showDeleteTask()} >
                    Remove task
                  </Menu.Item>
                </Menu>
              }
            >
              <Button style={{ borderRadius: 0 }}><EllipsisOutlined /></Button>

            </Dropdown>
            <Button style={{ borderRadius: 0 }} color="danger" onClick={closeTask}><CloseOutlined /></Button>
          </Space>
        </Col>
      </Row>
      {/* Modal content*/}

      <Row justify="space-between" style={{ height: "80vh", padding: "0 2%", overflow: "auto", flexWrap: "wrap" }}>
        {/* Activity detail*/}

        <Col span={16} style={{ height: "100%", borderRight: `solid 1px ${cyan[`1`]}`, overflow: "auto" }}>
          <Row justify="space-between" style={{ padding: "1% 0" }}>
            <Col span={15} style={{ padding: "0 1%" }}>
              <Title level={5} style={{ margin: "0" }} ><FormOutlined style={{ color: blue[6] }} /> Task name</Title>
              <Space direction="vertical" style={{ width: "60%", textAlign: "center", padding: "2% 0" }}>
                <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                  <small style={{ fontWeight: "bolder", color: gray[4] }}><PieChartOutlined /> Progress </small>
                  <text ><Progress type="circle" percent={100} size={15} showInfo={false} /> 100%</text>
                </Flex>
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
                    <text style={{ color: red[6] }}><DoubleRightOutlined rotate="-90" onClick={(e) => e.preventDefault()} /> Highest</text>
                  </Dropdown>
                </Flex>

                <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                  <small style={{ fontWeight: "bolder", color: gray[4] }}><UserOutlined /> Assignee </small>
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
                </Flex>
                <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                  <small style={{ fontWeight: "bolder", color: gray[4] }}><CalendarOutlined /> Start date </small>
                  <DatePicker variant="underlined" />
                </Flex>
                <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                  <small style={{ fontWeight: "bolder", color: gray[4] }}><CalendarOutlined /> Due date </small>
                  <DatePicker variant="underlined" />
                </Flex>


              </Space>
            </Col>
            <Col span={5} align="center" style={{ padding: "0 1%" }}>
              <Select

                value="Todo"
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
                  <text style={{ fontWeight: "bolder", marginBottom: "2%" }}> Description </text>
                  <Flex wrap={true} style={{ width: "100%" }}>
                    <TextArea rows={5} style={{ borderRadius: "2px", marginBottom: "2%" }} placeholder="Add a description" />
                    <Flex justify="end" style={{ width: "100%", marginBottom: "2%" }}>
                      <Space>
                        <Button style={{ borderRadius: "0" }}>Close</Button>
                        <Button style={{ borderRadius: "0" }} variant="solid" color="primary">Save</Button>
                      </Space>
                    </Flex>
                  </Flex>
                </Flex>

                <Flex justify="space-between" align="start" wrap={true} style={{ width: "100%" }}>
                  <text style={{ fontWeight: "bolder", marginBottom: "2%" }}> Subtask </text>
                  <Space>
                    <Select style={{ width: "12vh" }} size='small'>
                      <Option>okok</Option>
                      <Option>okkookok</Option>
                    </Select>
                    <PlusOutlined onClick={showCreateSubtask} />
                  </Space>
                  <List bordered style={{ maxHeight: "30vh", width: "100%", borderRadius: "0", overflowY: "auto" }} size='small'>
                    <List.Item style={{ width: "100%", }} >
                      <Row style={{ width: "100%" }}>
                        <Col span={12} align="start">
                          <PaperClipOutlined style={{ color: blue[6] }} />
                          <Typography.Text> Subtask1</Typography.Text>
                        </Col>
                        <Col span={12} align="end">

                          <Space align='center'>
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
                              <DoubleRightOutlined rotate="-90" style={{ color: red[6] }} onClick={(e) => e.preventDefault()} />
                            </Dropdown>
                            <Avatar.Group max={{ count: 1 }} size={25}>
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
                            <Select

                              value="Todo"
                              onChange="{setMoveTo}"
                              style={{ borderRadius: "0" }}
                              size="small"
                              dropdownStyle={{ borderRadius: 0 }}

                            >
                              <Option value="Todo">Todo</Option>
                              <Option value="Doing">Doing</Option>
                              <Option value="Done">Done</Option>
                            </Select>
                            <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item key="1" icon={<DeleteOutlined />} danger >
                                    Remove subtask
                                  </Menu.Item>
                                </Menu>
                              }
                            >
                              <EllipsisOutlined onClick={(e) => e.preventDefault()} />
                            </Dropdown>
                          </Space>
                        </Col>
                      </Row>

                    </List.Item>
                    <List.Item style={{ width: "100%", }} >
                      <Row style={{ width: "100%" }}>
                        <Col span={12} align="start">
                          <PaperClipOutlined style={{ color: blue[6] }} />
                          <Typography.Text> Subtask1</Typography.Text>
                        </Col>
                        <Col span={12} align="end">

                          <Space align='center'>
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
                              <DoubleRightOutlined rotate="-90" style={{ color: red[6] }} onClick={(e) => e.preventDefault()} />
                            </Dropdown>
                            <Avatar.Group max={{ count: 1 }} size={25}>
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
                            <Select

                              value="Todo"
                              onChange="{setMoveTo}"
                              style={{ borderRadius: "0" }}
                              size="small"
                              dropdownStyle={{ borderRadius: 0 }}

                            >
                              <Option value="Todo">Todo</Option>
                              <Option value="Doing">Doing</Option>
                              <Option value="Done">Done</Option>
                            </Select>
                            <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item key="1" icon={<DeleteOutlined />} danger >
                                    Remove subtask
                                  </Menu.Item>
                                </Menu>
                              }
                            >
                              <EllipsisOutlined onClick={(e) => e.preventDefault()} />
                            </Dropdown>
                          </Space>
                        </Col>
                      </Row>

                    </List.Item>

                  </List>
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

          {/* Modal for Creating New Task */}
          <Modal
            title="Create subtask"
            visible={createSubTask}
            onOk={handleCreateSubtaskOk}
            onCancel={handleCreateSubTaskCancel}
            footer={[
              <Button key="cancel" onClick={handleCreateSubTaskCancel}>Cancel</Button>,
              <Button key="submit" type="primary" onClick={handleCreateSubtaskOk}>Create</Button>
            ]}
          >
            <Input
              placeholder="Enter task title"
              value={newSubTask}
              onChange={(e) => setNewSubTask(e.target.value)}
            />
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default ActivityDetail
