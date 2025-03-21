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
import { AppContext } from "../../../../context/AppContext";
import Title from "antd/es/typography/Title";
import { Option } from "antd/es/mentions";
import TextArea from "antd/es/input/TextArea";
import ActivityDetail from "../../../Activity/ActivityDetail";
import DeleteActivityModal from "../DeleteActivityModal";

function KanbanBody({ sprint, stage }) {
    const { activity, setActivity, activities, searchActivity, setSearchActivity, handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName, activityModal, setActivityModal, showActivity, closeActivity, showDeleteActivity, handleDelete, handleCloseDeleteActivityModal, deleteActivity, setDeleteActivity, activityToDelete, setActivityToDelete, confirmActivity, setConfirmActivity, showNotification } = useContext(AppContext);




    const [filterActivityType, setFliterActivityType] = useState(["task"]);
    const filteredActivitites = activities?.filter((activity) => activity && activity?.activityTitle.toUpperCase().includes(searchActivity?.toUpperCase()))
        .filter((a) => a && (filterActivityType.length > 0 ? filterActivityType.includes(a?.type?.typeName) : true));




    return (
        <Col span={6} >
            <Card style={{ borderRadius: "0", background: "#F5F5F5", minHeight: "50% " }} bodyStyle={{ padding: "2%" }}>
                {filteredActivitites?.filter(activity => activity?.stage?._id === stage?._id && activity?.sprint?._id === sprint?._id).map((a) => (
                    <Card
                        key={a._id}
                        hoverable
                        style={{ width: "100%", borderRadius: "1%", margin: "5% 0" }}
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
                            <Col span={24}>
                                <Progress percent={(a?.child?.filter((c) => c?.stage?.stageStatus == "done").length / a?.child?.length) * 100} percentPosition={{ align: "end", type: "outer" }} strokeColor={green[6]} />
                            </Col>
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
                ))}

                {createActivityModal ? (
                    <Input
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        onPressEnter={() => handleActivityCreate(sprint?.sprintName, stage?.stageName, "task", null)}
                        onBlur={() => setCreateActivityModal(false)}
                        placeholder="Enter activity name"
                        prefix={<FormOutlined />}
                        style={{ borderRadius: 0 }}
                    />
                ) : (
                    <Button type="text" style={{ width: "100%", borderRadius: "0", color: gray[4] }} onClick={() => setCreateActivityModal(true)}>
                        <PlusOutlined /> Create activity
                    </Button>
                )}
            </Card>


            {/* Modal hiển thị chi tiết Activity */}



        </Col>
    );
}

export default KanbanBody;
