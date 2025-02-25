import { gray, green } from "@ant-design/colors";
import {
    DeleteOutlined,
    EllipsisOutlined,
    FireOutlined,
    FormOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Col,
    Dropdown,
    Flex,
    Input,
    Menu,
    Modal,
    Progress,
    Row,
    Tag,
    Tooltip,
    message,
    notification,
} from "antd";
import React, { useContext, useState } from "react";
import { AppContext } from "../../../../context/AppContext";

function KanbanBody() {
    const {showNotification} =useContext(AppContext)
    const [createModal, setCreateModal] = useState(false);
    const [activityName, setActivityName] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState("");
    const [inputValue, setInputValue] = useState("");

    const handleCreate = () => {
        if (activityName.trim()) {
            // Hiển thị message success
            message.success(`Activity "${activityName}" created successfully!`);

            // Hiển thị Notification ở góc phải
            showNotification(`Project update`,`User1 just create task "Task1".`)

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
            showNotification(`Project update`,`User1 just delete task ${taskToDelete}.`)

            handleCloseModal();
        } else {
            message.error("Task name does not match. Please try again!");
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
                                            <Menu.Item key="1" icon={<DeleteOutlined />} danger onClick={() => showDeleteModal(`Task ${index}`)}>
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
                onCancel={handleCloseModal} // Đóng modal và xóa input
                footer={[
                    <Button key="cancel" onClick={handleCloseModal}>
                        Cancel
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleDelete} disabled={inputValue !== taskToDelete}>
                        Delete
                    </Button>,
                ]}
            >
                <p>
                    Are you sure you want to delete <strong>{taskToDelete}</strong>?
                </p>
                <p>Please type <strong>"{taskToDelete}"</strong> to confirm:</p>
                <Input placeholder="Enter task name" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </Modal>
        </Col>
    );
}

export default KanbanBody;
