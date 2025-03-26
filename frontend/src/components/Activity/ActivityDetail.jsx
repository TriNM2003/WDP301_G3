import { blue, cyan, gray, grey, orange, red, yellow } from '@ant-design/colors'
import { BugOutlined, CalendarOutlined, CloseOutlined, CloudUploadOutlined, CommentOutlined, DeleteOutlined, DoubleRightOutlined, DownOutlined, EditOutlined, EllipsisOutlined, FileTextOutlined, FireOutlined, FormOutlined, MinusOutlined, MoreOutlined, PaperClipOutlined, PieChartOutlined, PlusOutlined, SearchOutlined, SendOutlined, UpOutlined, UploadOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, DatePicker, Dropdown, Flex, Form, Image, Input, List, Menu, Modal, Popconfirm, Progress, Row, Select, Skeleton, Space, Tag, Tooltip, Typography, Upload, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Option } from 'antd/es/mentions'
import Title from 'antd/es/typography/Title'
import React, { useContext, useEffect, useState } from 'react'
import moment from "moment";
import { AppContext } from '../../context/AppContext'
import dayjs from 'dayjs'
import SubActivity from './SubActivity'
import axios from 'axios'
import SubMenu from 'antd/es/menu/SubMenu'
import ImgCrop from 'antd-img-crop';
import authAxios from '../../utils/authAxios'


function ActivityDetail() {
  const { accessToken, siteAPI, stages, sprints, user,setRefreshNoti, setStages, site, handleMoveActivity, project, setActivities, activityLoading, setActivityLoading, activityModalLoading, isActivityTitle, setIsActivityTitle, createSubActivity, setCreateSubActivity, showNotification, activityModal, setActivityModal, handleActivityCreate, activityName, setActivityName, activities, activity, setActivity, showDeleteActivity, closeActivity, handleDelete, handleCloseDeleteActivityModal, deleteActivity, setDeleteActivity, activityToDelete, setActivityToDelete, confirmActivity, setConfirmActivity } = useContext(AppContext)
  const [comments, setComments] = useState([]);

  const [newComment, setNewComment] = useState("");
  const [editComment, setEditComment] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [selectedComment, setSelectedComment] = useState()
  const [isDescription, setIsDescription] = useState(false)
  const [newDescription, setNewDescription] = useState("");
  const [selectedType, setSelectedType] = useState("subtask")
  const [projectMembers, setProjectMembers] = useState([])
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [orderActivities, setOrderActivities] = useState("createdAt");
  const [attachmentUploading, setAttachmentUploading] = useState(false);



  // fetch site members
  useEffect(() => {
    authAxios.get(
      `${siteAPI}/${site?._id}/projects/${project?._id}/get-project-members`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
      .then((res) => {
        setProjectMembers(res.data);

      })
      .catch((err) => {
        console.log(err);
      })
  }, [site, project])
  // fetch activity
  useEffect(() => {
    const updatedActivity = activities.find((a) => a._id == activity?._id)
    if (updatedActivity) {
      setActivity(updatedActivity);
    }

  }, [activities])

  // fetch comment
  useEffect(() => {
    if (activity && activityModal) {
      authAxios.get(
        `${siteAPI}/${site?._id}/projects/${project?._id}/activities/${activity?._id}/comments/get-all`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
        .then((res) => {
          const formattedComments = res?.data?.comments?.map(comment => ({
            id: comment._id,
            author: comment.commenter.username,
            content: comment.content,
            avatar: comment.commenter.userAvatar,
            time: moment(comment.createdAt).fromNow()
          }));
          setComments(formattedComments);
        })
        .catch((error) => {
          console.log(error)
        })
    }

  }, [activities, site, project, activity, activityModal])

  // edit activity


  const handleEditActivity = async (field, updateData) => {

    try {
      const res = await authAxios.put(
        `${siteAPI}/${site?._id}/projects/${project?._id}/activities/${activity?._id}/edit`,
        { [field]: updateData },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      activityModalLoading();
      setRefreshNoti(prev => !prev);
      setActivity(res?.data?.activity);
      const updateActivities = activities?.map((a) =>
        a._id === res?.data?.activity?._id ? res?.data?.activity : a
      );
      setActivities(updateActivities)
      setIsActivityTitle(false);
      setIsDescription(false);
      setNewDescription("")
      message.success("Edit activity successfully");
      showNotification(`Project update`, `User1 just edited activity "${res.data.activity?.activityTitle}".`);
    } catch (err) {
      message.error(err?.response?.data?.error?.message || "Edit activity fail!");
      setIsDescription(false);
      setNewDescription("")
    }
  };

  const handleAttachmentChange = async ({ file }) => {
    const formData = new FormData();
    formData.append("attachment", file);
    setAttachmentUploading(true); 
    console.log(file);
    try {
      const res = await authAxios.put(
        `${siteAPI}/${site._id}/projects/${project._id}/activities/${activity._id}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAttachmentUploading(false);
      activityModalLoading();
      setRefreshNoti(prev => !prev);
      setActivity(res.data.activity);
      const updateActivities = activities.map((a) =>
        a._id == res.data.activity._id ? res.data.activity : a
      );
      setActivities(updateActivities);
      message.success("File uploaded successfully");
    } catch (err) {
      message.error(err?.response?.data?.error?.mesage || "Upload failed!");
      setAttachmentUploading(false);
    }
  };

  //Asign member
  const assignMember = async (memberId) => {

    await authAxios.put(`${siteAPI}/${site?._id}/projects/${project?._id}/activities/${activity?._id}/assignMember`,
      { member: memberId },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then((res) => {
        activityModalLoading();
        setActivity(res?.data?.activity);
        const updateActivities = activities.map((a) =>
          a._id === res?.data?.activity?._id ? res?.data?.activity : a
        );
        setRefreshNoti(prev => !prev);
        setActivities(updateActivities)
        setIsActivityTitle(false);
        setIsDescription(false);
        setNewDescription("")
        message.success("Assign member successfully");
        showNotification(`Project update`, `User1 just edited activity "${res.data.activity?.activityTitle}".`);
      })
      .catch((err) => {
        message.error(err?.response?.data?.error?.message ||"Assign member fail");

      })

  }
  const removeAssign = async (memberId) => {
    if (memberId) {
      await authAxios.put(`${siteAPI}/${site?._id}/projects/${project?._id}/activities/${activity?._id}/removeAssignee`,
        { member: memberId },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        .then((res) => {
          activityModalLoading();
          setActivity(res?.data?.activity);
          const updateActivities = activities.map((a) =>
            a._id === res?.data?.activity?._id ? res?.data?.activity : a
          );
          setActivities(updateActivities)
          setIsActivityTitle(false);
          setRefreshNoti(prev => !prev);
          setIsDescription(false);
          setNewDescription("")
          message.success("Remove assignee successfully");
          showNotification(`Project update`, `User1 just edited activity "${res.data.activity?.activityTitle}".`);
        })
        .catch((err) => {
          message.error(err?.response?.data?.error?.message ||"Remove assignee fail");
        })
    }
  }
  //Subactivity
  // console.log(activity?.child
  //   ?.map((c) => activities.find((a) => a?._id == c))
  //   .filter(Boolean));
  const child = activity?.child
    ?.map((c) => activities.find((a) => a?._id == c))
    .filter(Boolean);


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
  const handlePostComment = () => {
    if (!newComment.trim()) {
      message.warning("Comment cannot be empty!");
      return;
    }
    authAxios.post(
      `${siteAPI}/${site?._id}/projects/${project?._id}/activities/${activity?._id}/comments/post`,
      { content: newComment },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
      .then((res) => {
        activityModalLoading();
        setActivity(res?.data?.activity);
        const updateActivities = activities.map((a) =>
          a._id === res?.data?.activity?._id ? res?.data?.activity : a
        );
        setActivities(updateActivities)
        setNewComment("");
        message.success("Post comment successfully");
        showNotification(`Project update`, `${user?.username} just comment activity "${res.data.activity?.activityTitle}".`);
      })
      .catch((err) => {
        message.error(err?.data?.error?.message || "Post comment fail!");
        setNewComment("");
      })



  };

  const deleteComment = (commentId) => {
    authAxios.delete(
      `${siteAPI}/${site?._id}/projects/${project?._id}/activities/${activity?._id}/comments/${commentId}/delete`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
      .then((res) => {
        activityModalLoading();
        // console.log({...activity,comments:(activity.comments?.filter(c=>c._id !== commentId))});
        setActivity({ ...activity, comments: (activity.comments?.filter(c => c._id !== commentId)) });
        const updateActivities = activities.map((a) =>
          a._id === activity.comments?.filter(c => !commentId)?._id ? activity.comments?.filter(c => !commentId) : a
        );
        setActivities(updateActivities)
        setEditedComment("");
        setEditComment(false);
        message.success("Delete comment successfully");
        showNotification(`Project update`, `${user?.username} just delete a comment in activity "${activity?.activityTitle}".`);
      })
      .catch((err) => message.error(err?.data?.error?.message || "Delete comment fail!"))

  };
  const showEditComment = (comment) => {
    setCurrentComment(comment);
    setEditedComment(comment.content);
    setEditComment(true);
  };

  // console.log(editedComment);

  const handleEditCommentOk = () => {
    if (!selectedComment || !editedComment.trim()) {
      message.warning("No comment selected or empty content!");
      return;
    }
    authAxios.put(
      `${siteAPI}/${site?._id}/projects/${project?._id}/activities/${activity?._id}/comments/${selectedComment.id}/edit`,
      { content: editedComment },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    )
      .then((res) => {
        activityModalLoading();
        setActivity(res?.data?.activity);
        const updateActivities = activities.map((a) =>
          a._id === res?.data?.activity?._id ? res?.data?.activity : a
        );
        setActivities(updateActivities)
        setEditedComment("");
        setSelectedComment()
        setEditComment(false);
        message.success("Edit comment successfully");
        showNotification(`Project update`, `${user?.username} just edit a comment in activity "${res.data.activity?.activityTitle}".`);
      })
      .catch((err) => message.error(err?.data?.error?.message || "Edit comment fail!"))


  };

  const handleEditCommentCancel = () => {
    setEditedComment("");
    setSelectedComment()

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
                    <Menu.Item key="1" style={{ color: red[6] }} onClick={() => showDeleteActivity(activity)} >
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
                <Space style={{ width: "60%", textAlign: "center", padding: "2% 0" }}  >
                  {activity?.parent && (
                    activityLoading ? (
                      <Skeleton.Input active size="small" style={{ width: "100%" }} />
                    ) : (
                      <Title level={5} style={{ margin: "0", cursor: "pointer" }} onClick={() => {
                        activityModalLoading();
                        setActivity(activities?.find(a => a?._id == activity?.parent));

                      }} >
                        <>
                          {activities?.find(a => a?._id == activity?.parent)?.type?.typeName === "task" && <FormOutlined style={{ color: blue[6] }} />}
                          {activities?.find(a => a?._id == activity?.parent)?.type?.typeName === "subtask" && <PaperClipOutlined style={{ color: blue[6] }} />}
                          {activities?.find(a => a?._id == activity?.parent)?.type?.typeName === "bug" && <BugOutlined style={{ color: yellow[6] }} />}
                          {activities?.find(a => a?._id == activity?.parent)?.activityTitle}
                        </>
                        /
                      </Title>
                    )
                  )}

                  {isActivityTitle == false ?
                    (<Space onClick={() => setIsActivityTitle(true)}>

                      <Title level={5} style={{ margin: "0" }} >
                        {activityLoading ? (
                          <Skeleton.Input active size="small" style={{ width: "100%" }} />
                        ) : (
                          <>
                            {activity?.type?.typeName === "task" && <FormOutlined style={{ color: blue[6] }} />}
                            {activity?.type?.typeName === "subtask" && <PaperClipOutlined style={{ color: blue[6] }} />}
                            {activity?.type?.typeName === "bug" && <BugOutlined style={{ color: yellow[6] }} />}
                            {activity?.activityTitle}
                          </>
                        )}
                      </Title>
                    </Space>) :
                    (<Input
                      autoFocus
                      defaultValue={activity?.activityTitle}
                      onPressEnter={(e) => {
                        console.log(e.target.value);
                        handleEditActivity("activityTitle", e.target.value)
                      }}
                      onBlur={() => {
                        setIsActivityTitle(false);

                      }}
                      placeholder="Enter activity name"
                      prefix={<EditOutlined style={{ color: blue[6] }} />}
                      style={{ width: "100%", borderRadius: "0", margin: "1% 0", padding: "0.5% 1%" }}
                    />)}
                </Space>

                <Space direction="vertical" style={{ width: "60%", textAlign: "center", padding: "2% 0" }}>
                  {activity?.parent && (
                    <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                      <small style={{ fontWeight: "bolder", color: gray[4] }}><UserOutlined /> Parent </small>
                      {activityLoading ? (
                        <Skeleton.Input active size="small" style={{ width: "100%" }} />
                      ) : (
                        <Dropdown
                          placement="rightTop"
                          trigger={['click']}

                          overlay={
                            <Menu style={{ maxHeight: "300px", width: "200px", padding: "5% 0", overflow: "auto" }}>
                              <Menu.ItemGroup title={<small>Parent</small>}>

                                <Menu.Item >
                                  <text>
                                    {activities?.find(a => a?._id == activity.parent)?.type?.typeName === "task" && <FormOutlined style={{ color: blue[6] }} />}
                                    {activities?.find(a => a?._id == activity.parent)?.type?.typeName === "subtask" && <PaperClipOutlined style={{ color: blue[6] }} />}
                                    {activities?.find(a => a?._id == activity.parent)?.type?.typeName === "bug" && <BugOutlined style={{ color: yellow[6] }} />}
                                    {activities?.find(a => a?._id == activity.parent)?.activityTitle}
                                  </text>
                                </Menu.Item>

                              </Menu.ItemGroup>
                              <Menu.ItemGroup title={<small>Add parent</small>} >
                                <Menu.Item disabled >
                                  <Input
                                    placeholder="Search project member"
                                    allowClear
                                    size="middle"
                                    onChange={(e) => { setAssigneeFilter(e.target.value); console.log(assigneeFilter); }}
                                    style={{ width: "100%", borderRadius: "2%" }}
                                    prefix={<SearchOutlined />}
                                  />
                                </Menu.Item>

                                {activities?.filter((a) =>
                                  a
                                  && a._id != activity?.parent
                                  && (
                                    (activity?.type?.typeName === "subtask" && a?.type?.typeName === "task") ||
                                    (activity?.type?.typeName === "bug" && (a?.type?.typeName === "task" || a?.type?.typeName === "subtask"))
                                  )
                                )
                                  .map((ac) => {
                                    return (
                                      <Menu.Item onClick={() => handleEditActivity("parent", ac?._id)}>
                                        <text>
                                          {ac?.type?.typeName === "task" && <FormOutlined style={{ color: blue[6] }} />}
                                          {ac?.type?.typeName === "subtask" && <PaperClipOutlined style={{ color: blue[6] }} />}
                                          {ac?.type?.typeName === "bug" && <BugOutlined style={{ color: yellow[6] }} />}
                                          {ac?.activityTitle}
                                        </text>
                                      </Menu.Item>

                                    )
                                  })}
                              </Menu.ItemGroup>
                            </Menu>
                          }
                        >
                          <text>
                            {activities?.find(a => a?._id == activity?.parent)?.type?.typeName === "task" && <FormOutlined style={{ color: blue[6] }} />}
                            {activities?.find(a => a?._id == activity?.parent)?.type?.typeName === "subtask" && <PaperClipOutlined style={{ color: blue[6] }} />}
                            {activities?.find(a => a?._id == activity?.parent)?.type?.typeName === "bug" && <BugOutlined style={{ color: yellow[6] }} />}
                            {activities?.find(a => a?._id == activity?.parent)?.activityTitle}
                          </text>
                        </Dropdown>
                      )
                      }
                    </Flex>
                  )}



                  {child?.length > 0 && <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><PieChartOutlined /> Progress </small>
                    <text ><Progress type="circle" percent={(child?.filter((c) => c?.stage?.stageStatus == "done").length / child?.length) * 100} size={15} showInfo={false} /> {parseFloat((child?.filter((c) => c?.stage?.stageStatus == "done").length / child?.length) * 100)?.toFixed(2) || 0}%</text>
                  </Flex>}


                  {/* Priority */}  
                  <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><Tag />Priority </small>
                    {activityLoading ? (
                      <Skeleton.Input active size="small" style={{ width: "100%" }} />
                    ) : (
                      <Dropdown
                        placement="rightTop"
                        overlay={
                          <Menu
                            defaultSelectedKeys={activity?.priority}
                            onClick={(e) => {

                              handleEditActivity("priority", e.key)

                              // console.log(editActivity);
                              // handleEditActivity();


                            }}
                          >
                            <Menu.Item key="highest" icon={<DoubleRightOutlined rotate="-90" />} style={{ color: red[6] }}>
                              Highest
                            </Menu.Item>
                            <Menu.Item key="high" icon={<UpOutlined />} style={{ color: orange[6] }}>
                              High
                            </Menu.Item>
                            <Menu.Item key="medium" icon={<MinusOutlined />} style={{ color: blue[6] }}>
                              Medium
                            </Menu.Item>
                            <Menu.Item key="low" icon={<DownOutlined />} style={{ color: cyan[6] }}>
                              Low
                            </Menu.Item>
                            <Menu.Item key="lowest" icon={<DoubleRightOutlined rotate="90" />} style={{ color: cyan[4] }}>
                              Lowest
                            </Menu.Item>
                          </Menu>
                        }
                      >
                        <span>
                          {activity?.priority === "highest" && (
                            <span>
                              <DoubleRightOutlined rotate="-90" style={{ color: red[6] }} /> Highest
                            </span>
                          )}
                          {activity?.priority === "high" && (
                            <span>
                              <UpOutlined style={{ color: orange[6] }} /> High
                            </span>
                          )}
                          {activity?.priority === "medium" && (
                            <span>
                              <MinusOutlined style={{ color: blue[6] }} /> Medium
                            </span>
                          )}
                          {activity?.priority === "low" && (
                            <span>
                              <DownOutlined style={{ color: cyan[6] }} /> Low
                            </span>
                          )}
                          {activity?.priority === "lowest" && (
                            <span>
                              <DoubleRightOutlined rotate="90" style={{ color: cyan[4] }} /> Lowest
                            </span>
                          )}
                        </span>
                      </Dropdown>
                    )}
                  </Flex>

                  <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><UserOutlined /> Assignee </small>
                    {activityLoading ? (
                      <Skeleton.Avatar active size="small" shape="circle" />
                    ) : (
                      activity?.assignee?.length > 0 ? (
                        <Avatar.Group max={2} size={25}>
                          {activity.assignee.map((a) => (
                            <Tooltip key={a._id} title={a.username} placement="top">
                              <Avatar
                                src={a.userAvatar || "https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"}
                                size="small"
                              />
                            </Tooltip>
                          ))}
                          <Dropdown
                            placement="rightTop"
                            trigger={['click']}

                            overlay={
                              <Menu style={{ maxHeight: "300px", width: "200px", padding: "5% 0", overflow: "auto" }}>
                                <Menu.ItemGroup title={<small>Assignnees</small>}>


                                  {activity?.assignee?.length > 0 ?
                                    activity?.assignee?.map((a) => {
                                      return <Menu.Item onClick={() => removeAssign(a?._id)} >
                                        <Tooltip title="Remove assignee" placement="top">
                                          <Space>
                                            <Avatar
                                              src={a?.userAvatar}
                                              size="small"
                                            />
                                            <text>{a?.username}</text>
                                          </Space>
                                        </Tooltip>
                                      </Menu.Item>

                                    })
                                    : (<Menu.Item >
                                      <Tooltip title="Remove assignee" placement="top">
                                        <Space>
                                          <Avatar
                                            src={"https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"}
                                            size="small"
                                          />
                                          <text>Unassigned</text>
                                        </Space>
                                      </Tooltip>
                                    </Menu.Item>)}

                                </Menu.ItemGroup>
                                <Menu.ItemGroup title={<small>Assign member</small>} >
                                  <Menu.Item disabled >
                                    <Input
                                      placeholder="Search project member"
                                      allowClear
                                      size="middle"
                                      onChange={(e) => { setAssigneeFilter(e.target.value); console.log(assigneeFilter); }}
                                      style={{ width: "100%", borderRadius: "2%" }}
                                      prefix={<SearchOutlined />}
                                    />
                                  </Menu.Item>
                                  {projectMembers?.filter((m) => m && !activity?.assignee?.some((a) => a?._id == m?.projectMember?._id))
                                    .filter((m) => m && (m.projectMember?.username.toUpperCase().includes(assigneeFilter.toUpperCase()) || m.projectMember?.email.toUpperCase().includes(assigneeFilter.toUpperCase())))
                                    .map((member) => {
                                      return (
                                        <Menu.Item onClick={() => assignMember(member?.projectMember?._id)}  >
                                          <Tooltip title="Assign assignee" placement="top">
                                            <Space>

                                              <Avatar
                                                src={member?.projectMember?.userAvatar}
                                                size="small"
                                              />
                                              <text>{member?.projectMember?.username}</text>
                                            </Space>
                                          </Tooltip>
                                        </Menu.Item>

                                      )
                                    })}
                                </Menu.ItemGroup>
                              </Menu>
                            }
                          ><Tooltip title="Assign member" placement="top">
                              <Avatar icon={<UserAddOutlined />} size="small" style={{ cursor: "pointer" }} />
                            </Tooltip>
                          </Dropdown>

                        </Avatar.Group>
                      ) : (
                        <Dropdown
                          placement="rightTop"
                          trigger={['click']}

                          overlay={
                            <Menu style={{ maxHeight: "300px", width: "200px", padding: "5% 0", overflow: "auto" }}>
                              <Menu.ItemGroup title={<small>Assignnees</small>}>


                                <Menu.Item >
                                  <Tooltip title="Remove assignee" placement="top">
                                    <Space>

                                      <Avatar
                                        icon={<UserOutlined />}
                                        size="small"
                                      />
                                      <text>Unassigned</text>
                                    </Space>
                                  </Tooltip>
                                </Menu.Item>

                              </Menu.ItemGroup>
                              <Menu.ItemGroup title={<small>Assign member</small>} >
                                <Menu.Item disabled >
                                  <Input
                                    placeholder="Search project member"
                                    allowClear
                                    size="middle"
                                    onChange={(e) => { setAssigneeFilter(e.target.value) }}
                                    style={{ width: "100%", borderRadius: "2%" }}
                                    prefix={<SearchOutlined />}
                                  />
                                </Menu.Item>
                                {projectMembers?.filter((m) => m && !activity?.assignee?.some((a) => a?._id == m?.projectMember?._id))
                                  .filter((m) => m && (m.projectMember?.username.toUpperCase().includes(assigneeFilter.toUpperCase()) || m.projectMember?.email.toUpperCase().includes(assigneeFilter.toUpperCase())))
                                  .map((member) => {
                                    return (
                                      <Menu.Item onClick={() => assignMember(member?.projectMember?._id)}>
                                        <Tooltip title="Assign assignee" placement="top">
                                          <Space>

                                            <Avatar
                                              src={member?.projectMember?.userAvatar}
                                              size="small"
                                            />
                                            <text>{member?.projectMember?.username}</text>
                                          </Space>
                                        </Tooltip>
                                      </Menu.Item>

                                    )
                                  })}
                              </Menu.ItemGroup>
                            </Menu>
                          }
                        ><Tooltip title="Assign member" placement="top">
                            <Space>
                              <Avatar icon={<UserOutlined />} size="small" style={{ cursor: "pointer" }} />

                              <text>Unassigned</text>
                            </Space>
                          </Tooltip>
                        </Dropdown>

                      )
                    )}
                  </Flex>
                  <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><UserOutlined />Created by:  </small>
                    {activityLoading ? (
                      <Skeleton.Input active size="small" style={{ width: "100%" }} />
                    ) : (

                      <Space>
                        <Avatar src={activity?.createBy?.userAvatar} size="small" style={{ cursor: "pointer" }} />

                        <text>{activity?.createBy?.username}</text>
                      </Space>

                    )}
                  </Flex>
                  <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><CalendarOutlined />Start date  </small>
                    {activityLoading ? (
                      <Skeleton.Input active size="small" style={{ width: "100%" }} />
                    ) : (
                      <DatePicker
                        variant="underlined"
                        defaultValue={activity?.startDate ? dayjs(activity.startDate) : null}
                        disabledDate={(current) => activity?.dueDate && current && current.isAfter(activity?.dueDate, "day")}
                        onChange={(value) => {
                          handleEditActivity("startDate", value);
                        }}
                      />
                    )}
                  </Flex>
                  <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><CalendarOutlined />Due date </small>
                    {activityLoading ? (
                      <Skeleton.Input active size="small" style={{ width: "100%" }} />
                    ) : (
                      <DatePicker
                        variant="underlined"
                        defaultValue={activity?.dueDate ? dayjs(activity.dueDate) : null}
                        disabledDate={(current) => activity?.startDate && current && current.isBefore(activity?.startDate, "day")}
                        onChange={(value) => {
                          handleEditActivity("dueDate", value);
                        }}
                      />
                    )}
                  </Flex>
                  <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                    <small style={{ fontWeight: "bolder", color: gray[4] }}><CloudUploadOutlined /> Attachment </small>
                    {activityLoading ? (
                      <Skeleton.Button active size="small" style={{ width: "100%" }} />
                    ) : (
                      <Flex style={{ width: "50%" }} justify='space-between'>
                        {activity?.attachment?.url && (
                          activity.attachment.mimeType?.startsWith("image/") ? (
                            <Image
                              src={activity.attachment.url}
                              alt={activity.attachment.fileName}
                              style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: 4 }}
                            />
                          ) : (
                            <a
                              href={activity.attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex", alignItems: "center",
               
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              <FileTextOutlined />
                              <text
                              style={{
                                maxWidth: "100%", 
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              
                              >{activity.attachment.fileName}</text>
                            </a>
                          )

                        )}

                        <Upload
                          showUploadList={false}
                          maxCount={1}
                          customRequest={handleAttachmentChange}
                          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.txt,.xls,.csv,.xlsx"
                        >
                          <Button icon={<UploadOutlined />} loading={attachmentUploading} ></Button>
                        </Upload>
                      </Flex>

                    )}
                  </Flex>


                </Space>
              </Col>
              <Col span={8} align="center" style={{ padding: "0 1%" }}>
                <Space>
                  {activityLoading ? (
                    <Skeleton.Input active size="small" style={{ width: "100%" }} />
                  ) : (
                    <Select
                      value={activity?.sprint?._id || null}
                      onChange={(value) => handleMoveActivity("sprint", activity, value)}
                      style={{ width: "100%", borderRadius: "0" }}
                      dropdownStyle={{ borderRadius: 0 }}
                      disabled={activity?.sprint?.sprintStatus == "completed"}
                    >
                      <Option key={null} value={null}>Backlog</Option>
                      {sprints?.map((sprint) => {
                        return <Option key={sprint?._id} value={sprint?._id}
                          disabled={sprint?.sprintStatus == "completed" || sprint?._id == activity?.sprint?._id}
                        >{sprint?.sprintName}</Option>
                      })}
                    </Select>
                  )}
                  {activityLoading ? (
                    <Skeleton.Input active size="small" style={{ width: "100%" }} />
                  ) : (
                    <Select
                      value={activity?.stage?._id}
                      onChange={(value) => handleMoveActivity("stage", activity, value)}
                      style={{ width: "100%", borderRadius: "0" }}
                      dropdownStyle={{ borderRadius: 0 }}
                      disabled={activity?.sprint?.sprintStatus == "completed"}
                    >
                      {stages?.map((stage) => {
                        return <Option key={stage?._id} value={stage?._id}>{stage?.stageName}</Option>
                      })}
                    </Select>
                  )}
                </Space>
              </Col>
              <Col span={22} style={{ padding: "0 1%" }}>
                <Space direction="vertical" style={{ width: "100%", textAlign: "center", padding: "2% 0" }}>
                  {/* Description*/}

                  <Flex justify="space-between" align="center" wrap={true} style={{ width: "100%" }}>
                    <text style={{ fontWeight: "bolder" }}> Description </text>
                    {activityLoading ? (
                      <Skeleton active paragraph={{ rows: 3 }} />
                    ) : isDescription ? (
                      <Flex wrap={true} style={{ width: "100%" }}>
                        <Form
                          style={{ width: "100%" }}
                          onFinish={(values) => {
                            handleEditActivity("description", values.description);
                          }}>
                          <Form.Item
                            name="description"
                            style={{ margin: 0 }}

                          >
                            <TextArea
                              rows={5}
                              autoFocus={true}
                              style={{ borderRadius: "2px", marginBottom: "2%" }}
                              placeholder="Add a description ..."
                              defaultValue={activity?.description}
                            />
                          </Form.Item>
                          <Form.Item
                            style={{ textAlign: "end", margin: 0 }}
                          >
                            <Space>
                              <Button style={{ borderRadius: "0" }} onClick={() => { setIsDescription(false) }}>Close</Button>
                              <Button style={{ borderRadius: "0" }} variant="solid" color="primary" htmlType='submit'>
                                Save
                              </Button>
                            </Space>
                          </Form.Item>

                        </Form>
                      </Flex>
                    ) : (
                      <Flex wrap={true} style={{ width: "100%", marginBottom: "5%", cursor: "pointer" }}>
                        <TextArea
                          placeholder="Add a description ..."
                          variant="filled"
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
                      {activityLoading ? (
                        <Skeleton.Input active size="small" style={{ width: "12vh" }} />
                      ) : (
                        <Select
                          style={{ width: "12vh" }}
                          placeholder="Order by"
                          size='small'
                          variant='borderless'
                          disabled={child?.length <= 0}
                          onSelect={(key) => setOrderActivities(key)}
                        >
                          <Option key='createdAt'>Created at</Option>
                          <Option key='assignee?.username'>Assignee</Option>
                          <Option key='stage?.stageName'>Status</Option>
                          <Option key='priority'>Priority</Option>
                          <Option key='type?.typeName'>Activity type</Option>
                        </Select>
                      )}
                      <Tooltip title="Add a sub activity...">
                        {activityLoading ? (
                          <Skeleton.Avatar active size="small" shape="circle" />
                        ) : (
                          <PlusOutlined onClick={showCreateSubactivity} />
                        )}
                      </Tooltip>
                    </Space>
                    {activityLoading ? (
                      <Skeleton active paragraph={{ rows: 4 }} />
                    ) : child?.length > 0 ? (
                      <List bordered style={{ width: "100%", borderRadius: "0" }} size='small'>
                        {child?.map((c) => (
                          <SubActivity key={c._id} activity={c} />
                        ))}
                      </List>
                    ) : (
                      <Tooltip title="Add a sub activity...">
                        <List
                          bordered
                          style={{ maxHeight: "30vh", width: "100%", borderRadius: "0", overflowY: "auto", cursor: "pointer" }}
                          size='small'
                          onClick={showCreateSubactivity}
                        />
                      </Tooltip>
                    )}
                  </Flex>



                </Space>
              </Col>
            </Row>

          </Col>
          {/* Comment*/}

          <Col span={8} style={{ height: "80vh", padding: "0 0 0 2%", overflow: "auto" }}>
            <Title style={{ height: "5%" }} level={5}>Comments <Tag style={{ borderRadius: 0 }}><small style={{ color: grey[4] }}>{comments.length}</small></Tag></Title>
            <Flex vertical justify='start' style={{ height: "88%", padding: "0", width: "100%" }}>
              <Space.Compact
                style={{
                  width: '100%',
                }}
              >
                <Input prefix={<CommentOutlined />} style={{ borderRadius: "0" }}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button><SendOutlined onClick={handlePostComment} /></Button>
              </Space.Compact>
              <List
                loading={activityLoading}
                dataSource={comments}
                style={{ height: "90%", padding: "5% 3%", overflow: "auto", margin: "2% 0 0 0" }}
                renderItem={(comment) => (
                  <List.Item
                    actions={[
                      <Tooltip title="Edit" key="edit">
                        <EditOutlined style={{ color: "#FFC107" }} onClick={() => {
                          setSelectedComment(comment);
                          showEditComment(comment);

                        }} />
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
                      avatar={<Avatar src={comment?.avatar} />}
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
              open={editComment}
              onOk={handleEditCommentOk}
              onCancel={handleEditCommentCancel}
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
              open={createSubActivity}
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
                  autoFocus={true}
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