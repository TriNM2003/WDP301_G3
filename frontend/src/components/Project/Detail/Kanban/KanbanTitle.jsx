import { grey } from "@ant-design/colors";
import { DeleteOutlined, EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Card, Col, Dropdown, Flex, Menu, Modal, Button, Input, message } from "antd";
import React, { useContext, useState } from "react";
import { AppContext } from "../../../../context/AppContext";

function KanbanTitle({ column }) {
    const {showNotification} =useContext(AppContext)
    const [deleteModal, setDeleteModal] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const showDeleteModal = () => {
        setDeleteModal(true);
    };

    const handleCloseModal = () => {
        setDeleteModal(false);
        setInputValue(""); // Reset input khi đóng modal
    };

    const handleDelete = () => {
        if (inputValue === column) {
            message.success(`Column "${column}" has been deleted successfully!`);
            showNotification(`Project update`,`User1 just delete column ${column}.`)
            handleCloseModal();
        } else {
            message.error("Column name does not match. Please try again!");
        }
    };

    return (
        <Col span={6}>
            <Card style={{ height: `100%`, borderRadius: "0", background: "#F5F5F5" }} bodyStyle={{ height: `100%`, padding: "2%" }}>
                <Flex justify="space-between" align="center" style={{ padding: "0 2%", height: "100%" }}>
                    <small style={{ margin: 0, fontWeight: "bolder", color: grey[2] }}>{column}</small>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="1" icon={<DeleteOutlined />} danger onClick={showDeleteModal}>
                                    Delete column
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <EllipsisOutlined style={{ color: grey[2] }} onClick={(e) => e.preventDefault()} />
                    </Dropdown>
                </Flex>
            </Card>

            {/* Modal xác nhận xóa */}
            <Modal
                title={
                    <Flex align="center">
                        <ExclamationCircleOutlined style={{ color: "red", marginRight: 8 }} />
                        Confirm Delete Column
                    </Flex>
                }
                open={deleteModal}
                onCancel={handleCloseModal} // Khi bấm Cancel hoặc ra ngoài modal
                footer={[
                    <Button key="cancel" onClick={handleCloseModal}>
                        Cancel
                    </Button>,
                    <Button key="delete" type="primary" danger onClick={handleDelete} disabled={inputValue !== column}>
                        Delete
                    </Button>,
                ]}
            >
                <p>
                    Are you sure you want to delete <strong>{column}</strong>
                </p>
                <p>Please type <strong>"{column}"</strong> to confirm:</p>
                <Input
                    placeholder="Enter column name"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </Modal>
        </Col>
    );
}

export default KanbanTitle;
