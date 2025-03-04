import { useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Select,
  Input,
  Typography,
  Breadcrumb,
  message,
} from "antd";
import {
  SearchOutlined,
  MailOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { green, red } from "@ant-design/colors";

const { Title } = Typography;
const { Option } = Select;

const ManageInvitations = () => {
  const [invitationList, setInvitationList] = useState([
    { key: "1", email: "invite1@example.com", status: "pending" },
    { key: "2", email: "invite2@example.com", status: "accept" },
    { key: "3", email: "invite3@example.com", status: "decline" },
  ]);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const messageApi = message.useMessage()[0];

  const handleDeleteInvitation = (key) => {
    setInvitationList(invitationList.filter((invite) => invite.key !== key));
    messageApi.success("Pending invitation deleted successfully!");
  };

  const filteredInvitations = invitationList.filter((invite) =>
    invite.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
    (!filterStatus || invite.status === filterStatus)
  );

  const columns = [
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <span style={{ color: text === "accept" ? green[6] : text === "decline" ? red[6] : "inherit" }}>
          {text}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status === "pending" ? (
          <Popconfirm
            title="Are you sure to delete this invitation?"
            onConfirm={() => handleDeleteInvitation(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div style={{ padding: "40px", backgroundColor: "white" }}>
      <Breadcrumb style={{ marginBottom: "20px" }}>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/site">Site</Breadcrumb.Item>
        <Breadcrumb.Item>Manage Invitations</Breadcrumb.Item>
      </Breadcrumb>

      <Input
        prefix={<SearchOutlined />}
        placeholder="Search by email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <Select
        placeholder="Filter by status"
        style={{ width: "100%", marginBottom: 10 }}
        allowClear
        onChange={(value) => setFilterStatus(value)}
      >
        <Option value="pending">Pending</Option>
        <Option value="accept">Accept</Option>
        <Option value="decline">Decline</Option>
      </Select>

      <Table columns={columns} dataSource={filteredInvitations} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default ManageInvitations;
