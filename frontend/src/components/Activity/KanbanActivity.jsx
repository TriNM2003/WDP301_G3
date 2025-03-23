import { blue, cyan, gray, green, orange, red } from "@ant-design/colors";
import {
    DeleteOutlined,
    EllipsisOutlined,
    FireOutlined,
    FormOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
    CloseOutlined,
    UserOutlined,
    PieChartOutlined,
    CalendarOutlined,
    FileTextOutlined,
    DoubleRightOutlined,
    MinusOutlined,
    UpOutlined,
    DownOutlined,
} from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import {
    Avatar,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Dropdown,
    Flex,
    Image,
    Input,
    Menu,
    Modal,
    Progress,
    Row,
    Select,
    Space,
    Tag,
    TimePicker,
    Tooltip,
    message,
} from "antd";
import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { CSS } from '@dnd-kit/utilities';

function KanbanActivity({ a, isDragging }) {

    const { activity, setActivity, activeDragActivity, setActiveDragActivity, activities, searchActivity, setSearchActivity, handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName, activityModal, setActivityModal, showActivity, closeActivity, showDeleteActivity, handleDelete, handleCloseDeleteActivityModal, deleteActivity, setDeleteActivity, activityToDelete, setActivityToDelete, confirmActivity, setConfirmActivity, showNotification } = useContext(AppContext);


    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: a?._id,
        data: a
    });

    const dndStageActivity = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1, // <- chỉ ẩn nếu đúng activity đang kéo
    };


    return (
        <Card
            ref={setNodeRef} {...attributes} {...listeners}
            style={Object.assign({}, dndStageActivity, {
                width: "100%", borderRadius: "1%", margin: "5% 0",
                background: "white", border: `0.5px solid ${cyan[2]}`, padding: "0.5% 1%", cursor: "pointer",
                transform: isDragging ? "scale(1.05)" : "none",
                boxShadow: isDragging ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s ease",
            })}
            key={a?._id}
            hoverable
            bodyStyle={{ padding: "2%" }}
            headStyle={{ padding: "2%", border: "0" }}
            onClick={() => showActivity(a)}
            cover={
                a?.attachment?.url && (
                    a.attachment.mimeType?.startsWith("image/") && (
                        <img
                            src={a.attachment.url}
                            alt={a.attachment.fileName}
                            style={{ borderRadius: "0", padding: "1% 3%" }}

                        />
                    ))
            }
            title={
                <Flex justify="space-between" align="center" style={{ padding: "1% 3%", height: "100%" }}>
                    <p style={{ margin: 0, color: "black" }}>{a?.activityTitle}</p>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="1" icon={<DeleteOutlined />} danger onClick={(e) => {
                                    e.domEvent.stopPropagation();
                                    showDeleteActivity(a);
                                }}>
                                    Delete activity
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <EllipsisOutlined onClick={(e) => e.preventDefault()} />
                    </Dropdown>
                </Flex>
            }
        >
            <Row justify="space-between" style={{ padding: "2% 3%" }}>
                {a?.child?.length > 0 && <Col span={24}>
                    <Progress
                        percent={
                            (a?.child?.filter((childId) => {
                                const childActivity = activities.find((activity) => activity?._id === childId);
                                return childActivity?.stage?.stageStatus === "done";
                            })?.length / a?.child?.length) * 100
                        }
                        strokeColor={green[6]}
                    /> </Col>}
                <Col span={8} align="start" style={{ display: "flex", alignItems: "center" }}>

                    {a?.priority === "highest" && (
                        <Tag color="red" bordered={false}>
                            <strong>
                                <DoubleRightOutlined rotate="-90" style={{ color: red[6] }} /> Highest
                            </strong>
                        </Tag>
                    )}
                    {a?.priority === "high" && (
                        <Tag color="orange" bordered={false}>
                            <strong>
                                <UpOutlined style={{ color: orange[6] }} /> High
                            </strong>
                        </Tag>
                    )}
                    {a?.priority === "medium" && (
                        <Tag color="blue" bordered={false}>
                            <strong>
                                <MinusOutlined style={{ color: blue[6] }} /> Medium
                            </strong>
                        </Tag>
                    )}
                    {a?.priority === "low" && (
                        <Tag color="cyan" bordered={false}>
                            <strong>
                                <DownOutlined style={{ color: cyan[6] }} /> Low
                            </strong>
                        </Tag>
                    )}
                    {a?.priority === "lowest" && (
                        <Tag color="cyan" bordered={false}>
                            <strong>
                                <DoubleRightOutlined rotate="90" style={{ color: cyan[4] }} /> Lowest
                            </strong>
                        </Tag>
                    )}


                </Col>
                <Col span={8} align="end">
                    <Avatar.Group max={{ count: 2 }}>
                        {a?.assignee?.length > 0 ?
                            a?.assignee?.map((as) => (
                                <Tooltip title={as?.username} placement="top">
                                    <Avatar src={as?.userAvatar} size={25} />
                                </Tooltip>
                            )) :
                            <Tooltip title="Unassigned" placement="top">
                                <Avatar icon={<UserOutlined />} size={25} />
                            </Tooltip>
                        }

                    </Avatar.Group>
                </Col>
            </Row>
        </Card>
    )
}

export default KanbanActivity
