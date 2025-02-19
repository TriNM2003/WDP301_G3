import React, { useState } from "react";
import { Layout, Input, Button, Table, Row, Col, Typography, Dropdown, Avatar, Tag, Modal, Select } from "antd";
import { SearchOutlined, FilterOutlined, PlusOutlined, MoreOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Column } = Table;
const { Title } = Typography;
const { Option } = Select;

const UserManagement = () => {
    const [searchText, setSearchText] = useState("");
    const [isAddMemberModalVisible, setIsAddMemberModalVisible] = useState(false);
    const [isKickMemberModalVisible, setIsKickMemberModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const showKickMemberModal = (record) => {
        setSelectedUser(record);
        setIsKickMemberModalVisible(true);
    };

    const handleKickMember = () => {
        console.log(`Kicked member: ${selectedUser.name}`);
        setIsKickMemberModalVisible(false);
    };

    const data = [
        { key: "1", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/", name: "Figga", email: "Figga@gmail.com", access: ["member" ], lastActive: "Mar 4, 2024", dateAdded: "July 4, 2022" },
        { key: "2", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/", name: "nigga", email: "nigga@gmail.com", access: ["nigger" ], lastActive: "Mar 4, 2024", dateAdded: "July 4, 2022" },
        { key: "3", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/", name: "rigga", email: "rigga@gmail.com", access: ["member" ], lastActive: "Mar 2, 2024", dateAdded: "July 4, 2022" },
        { key: "4", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/", name: "digger", email: "digger@gmail.com", access: ["member" ], lastActive: "Mar 6, 2024", dateAdded: "July 4, 2022" },
        { key: "5", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/", name: "hamurger", email: "hamurger@gmail.com", access: ["member"], lastActive: "Mar 8, 2024", dateAdded: "July 4, 2022" },
        { key: "6", avatar: "https://steamuserimages-a.akamaihd.net/ugc/948474504894470428/A2935C316283E70322CFF16DB671B2B61C602507/", name: "youtuber", email: "youtuber@gmail.com", access: ["member"], lastActive: "Mar 6, 2024", dateAdded: "July 4, 2022" }
    ];

    return (
        <Layout style={{ padding: "24px", minHeight: "100vh", background: "#fafafa" }}>
            {/* Header */}
            <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                <Col>
                    <Title level={3}>Users <span style={{ color: "#999" }}>44</span></Title>
                </Col>
                <Col>
                    <Input
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        style={{ width: 250, marginRight: "10px" }}
                        value={searchText}
                        onChange={handleSearch}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddMemberModalVisible(true)}>Add user</Button>
                </Col>
            </Row>

            {/* Table */}
            <Table
                dataSource={data}
                pagination={false}
                rowClassName={() => "custom-table-row"}
                style={{ borderRadius: "8px", overflow: "hidden" }}
            >
                <Column
                    title="User name"
                    key="name"
                    render={(text, record) => (
                        <Row align="middle">
                            <Avatar src={record.avatar} size={40} style={{ marginRight: "10px" }} />
                            <div>
                                <div style={{ fontWeight: "bold" }}>{record.name}</div>
                                <div style={{ color: "#888" }}>{record.email}</div>
                            </div>
                        </Row>
                    )}
                />
                <Column
                    title="Access"
                    key="access"
                    render={(text, record) => (
                        <>
                            {record.access.map((role) => (
                                <Tag color={role === "Admin" ? "green" : role === "Data Export" ? "blue" : "purple"} key={role}>
                                    {role}
                                </Tag>
                            ))}
                        </>
                    )}
                />
                <Column title="Last active" dataIndex="lastActive" key="lastActive" sorter={(a, b) => new Date(a.lastActive) - new Date(b.lastActive)} />
                <Column title="Date added" dataIndex="dateAdded" key="dateAdded" sorter={(a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)}  />
                <Column
                    title=""
                    key="actions"
                    render={(text, record) => (
                        <Dropdown
                            overlay={
                                <Button danger onClick={() => showKickMemberModal(record)}>Kick Member</Button>
                            }
                            trigger={["click"]}
                        >
                            <Button icon={<MoreOutlined />} type="text" />
                        </Dropdown>
                    )}
                />
            </Table>

            {/* Modal: Add Member */}
            <Modal
                title="Add member to ??? team"
                open={isAddMemberModalVisible}
                onCancel={() => setIsAddMemberModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsAddMemberModalVisible(false)}>Cancel</Button>,
                    <Button key="ok" type="primary" onClick={() => setIsAddMemberModalVisible(false)}>OK</Button>
                ]}
            >
                <div style={{ marginBottom: "10px" }}>Names or emails</div>
                <Input placeholder="example" style={{ marginBottom: "15px" }} />
                <div style={{ marginBottom: "10px" }}>Role</div>
                <Select defaultValue="Admin" style={{ width: "100%" }}>
                    <Option value="Admin">Admin</Option>
                    <Option value="Member">Member</Option>
                </Select>
            </Modal>

            {/* Modal: Kick Member */}
            <Modal
                title="Confirm Kick Member"
                open={isKickMemberModalVisible}
                onCancel={() => setIsKickMemberModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsKickMemberModalVisible(false)}>Cancel</Button>,
                    <Button key="confirm" type="primary" danger onClick={handleKickMember}>Confirm</Button>
                ]}
            >
                <ExclamationCircleOutlined style={{ color: "red", fontSize: "24px", marginBottom: "10px" }} />
                <p>Are you sure you want to remove {selectedUser?.name} from the team?</p>
            </Modal>
        </Layout>
    );
};

export default UserManagement;