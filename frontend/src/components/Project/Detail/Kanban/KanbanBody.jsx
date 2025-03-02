import { blue, cyan, gray, green } from "@ant-design/colors";
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

function KanbanBody() {
    const {taskModal, setTaskModal,showTask,closeTask, showDeleteTask, handleDelete, handleCloseDeleteTaskModal,deleteTask, setDeleteTask,taskToDelete, setTaskToDelete,confirmTask, setConfirmTask,showNotification } = useContext(AppContext);
    const [createTaskModal, setCreateTaskModal] = useState(false);
    const [activityName, setActivityName] = useState("");


    const handleTaskCreate = () => {
        if (activityName.trim()) {
            message.success(`Activity "${activityName}" created successfully!`);
            showNotification(`Project update`, `User1 just created task "${activityName}".`);
            setActivityName("");
            setCreateTaskModal(false);
        }
    };

    

    

    return (
        <Col span={6}>
            <Card style={{ borderRadius: "0", background: "#F5F5F5" }} bodyStyle={{ padding: "2%" }}>
                {[1, 2, 3].map((index) => (
                    <Card
                        key={index}
                        hoverable
                        style={{ width: "100%", borderRadius: "1%", margin: "5% 0" }}
                        bodyStyle={{ padding: "2%" }}
                        headStyle={{ padding: "2%", border: "0" }}
                        onClick={() => showTask(`Task ${index}`)}
                        cover={
                            <img
                                src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg"
                                style={{ borderRadius: "0", padding: "1% 3%" }}
                            />
                        }
                        title={
                            <Flex justify="space-between" align="center" style={{ padding: "1% 3%", height: "100%" }}>
                                <p style={{ margin: 0, color: "black" }}>Task {index}</p>
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="1" icon={<DeleteOutlined />} danger onClick={(e) => {
                                               e.domEvent.stopPropagation();
                                                showDeleteTask(`Task ${index}`);
                                            }}>
                                                Delete task
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
                                <Progress percent={10} percentPosition={{ align: "end", type: "outer" }} strokeColor={green[6]} />
                            </Col>
                            <Col span={8} align="start" style={{ display: "flex", alignItems: "center" }}>
                                <Tag color="red" bordered={false}>
                                    <strong>
                                        <DoubleRightOutlined rotate="-90" /> Highest
                                    </strong>
                                </Tag>
                            </Col>
                            <Col span={8} align="end">
                                <Avatar.Group max={{ count: 2 }}>
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
                            </Col>
                        </Row>
                    </Card>
                ))}

                {createTaskModal ? (
                    <Input
                        autoFocus
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        onPressEnter={handleTaskCreate}
                        onBlur={() => setCreateTaskModal(false)}
                        placeholder="Enter task name"
                        prefix={<FormOutlined />}
                        style={{ borderRadius: 0 }}
                    />
                ) : (
                    <Button type="text" style={{ width: "100%", borderRadius: "0", color: gray[4] }} onClick={() => setCreateTaskModal(true)}>
                        <PlusOutlined /> Create task
                    </Button>
                )}
            </Card>

            {/* Modal xác nhận xóa */}
            <Modal
                title={
                    <Flex align="center">
                        <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
                        Confirm Delete Task
                    </Flex>
                }
                open={deleteTask}
                onCancel={handleCloseDeleteTaskModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseDeleteTaskModal}>
                        Cancel
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleDelete} disabled={confirmTask !== taskToDelete}>
                        Delete
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete <strong>{taskToDelete}</strong>?</p>
                <p>Please type <strong>"{taskToDelete}"</strong> to confirm:</p>
                <Input placeholder="Enter task name" value={confirmTask} onChange={(e) => setConfirmTask(e.target.value)} />
            </Modal>

            {/* Modal hiển thị chi tiết Task */}
            <Modal
                width={{
                    xs: '100%',
                    sm: '95%',
                    md: '90%',
                    lg: '85%',
                    xl: '80%',
                    xxl: '75%',
                }}

                open={taskModal.visible}
                footer={[]}
                onClose={closeTask}
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
                <ActivityDetail closeTask={closeTask} />

            </Modal>
        </Col>
    );
}

export default KanbanBody;
