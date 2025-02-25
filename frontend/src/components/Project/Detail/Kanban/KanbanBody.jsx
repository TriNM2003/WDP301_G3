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

function KanbanBody() {
    const { showNotification } = useContext(AppContext);
    const [createModal, setCreateModal] = useState(false);
    const [activityName, setActivityName] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [taskModal, setTaskModal] = useState({ visible: false, taskName: "" });

    const handleCreate = () => {
        if (activityName.trim()) {
            message.success(`Activity "${activityName}" created successfully!`);
            showNotification(`Project update`, `User1 just created task "${activityName}".`);
            setActivityName("");
            setCreateModal(false);
        }
    };

    const showDeleteModal = (taskName) => {
        setTaskToDelete(taskName);
        setDeleteModal(true);
    };

    const handleCloseModal = () => {
        setDeleteModal(false);
        setInputValue(""); // Xóa input khi đóng modal
    };

    const handleDelete = () => {
        if (inputValue === taskToDelete) {
            message.success(`Task "${taskToDelete}" has been deleted successfully!`);
            showNotification(`Project update`, `User1 just deleted task ${taskToDelete}.`);
            handleCloseModal();
        } else {
            message.error("Task name does not match. Please try again!");
        }
    };

    const showTaskModal = (taskName) => {
        setTaskModal({ visible: true, taskName });
    };

    const closeTaskModal = () => {
        setTaskModal({ visible: false, taskName: "" });
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
                        onClick={() => showTaskModal(`Task ${index}`)}
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
                                                e.stopPropagation(); // Ngăn modal mở khi bấm Delete
                                                showDeleteModal(`Task ${index}`);
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
                                        <FireOutlined /> Highest
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

                {createModal ? (
                    <Input
                        autoFocus
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        onPressEnter={handleCreate}
                        onBlur={() => setCreateModal(false)}
                        placeholder="Enter task name"
                        prefix={<FormOutlined />}
                        style={{ borderRadius: 0 }}
                    />
                ) : (
                    <Button type="text" style={{ width: "100%", borderRadius: "0", color: gray[4] }} onClick={() => setCreateModal(true)}>
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
                open={deleteModal}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseModal}>
                        Cancel
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleDelete} disabled={inputValue !== taskToDelete}>
                        Delete
                    </Button>,
                ]}
            >
                <p>Are you sure you want to delete <strong>{taskToDelete}</strong>?</p>
                <p>Please type <strong>"{taskToDelete}"</strong> to confirm:</p>
                <Input placeholder="Enter task name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
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
                <Row justify="space-between" style={{ padding: "1% 2%", borderBottom: `solid 1px ${cyan[`1`]}` }}>
                    <Col></Col>
                    <Col>
                        <Space style={{ padding: 0 }}>
                            <Button style={{ borderRadius: 0 }}><EllipsisOutlined /></Button>
                            <Button style={{ borderRadius: 0 }} color="danger"><CloseOutlined /></Button>
                        </Space>
                    </Col>
                </Row>
                <Row justify="space-between" style={{ height: "80vh", padding: "0 2%", overflow: "auto", flexWrap: "wrap" }}>
                    <Col span={16} style={{ height: "100%", borderRight: `solid 1px ${cyan[`1`]}` }}>
                        <Row justify="space-between" style={{ padding: "1% 0" }}>
                            <Col span={15} style={{ padding: "0 1%" }}>
                                <Title level={5} style={{ margin: "0" }} ><FormOutlined style={{ color: blue[6] }} /> Task name</Title>
                                <Space direction="vertical" style={{ width: "60%", textAlign: "center", padding: "2% 0" }}>
                                    <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                                        <small style={{ fontWeight: "bolder", color: gray[4] }}><PieChartOutlined /> Progress </small>
                                        <text ><Progress type="circle" percent={100} size={15} showInfo={false} /> 100%</text>
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
                                </Space>
                            </Col>
                        </Row>

                    </Col>
                    <Col span={7} style={{ height: "80vh", padding: "0 2%", overflow: "auto" }}>Comment</Col>
                </Row>

            </Modal>
        </Col>
    );
}

export default KanbanBody;
