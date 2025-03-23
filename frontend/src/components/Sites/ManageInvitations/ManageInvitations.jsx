import { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Breadcrumb,
  Button,
  Input,
  message,
  Popconfirm,
  Select,
  Table,
} from "antd";
import InvitationTable from "./InvitationTable";
import InvitationSearchFilter from "./InvitationSearchFilter";
import authAxios from "../../../utils/authAxios";
import {AppContext} from "../../../context/AppContext";
import Title from "antd/es/typography/Title";
import { SearchOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { green, red } from "@ant-design/colors";

const formatDate = (mongoDate) => {
  if (!mongoDate) return "";

  const date = new Date(mongoDate);
  return date.toLocaleDateString("vi-VN"); // "dd/mm/yyyy"
};


const ManageInvitations = () => {
  const {site, setSite, siteAPI} = useContext(AppContext);
  const [invitationList, setInvitationList] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvitation();
  }, [site])

  const columns = [
    {
        title: "",
        dataIndex: "key",
        key: "key",
      },
    {
        title: "Receiver",
        dataIndex: "receiver",
        key: "receiver",
        render: (_, record) => (
            <span key={record.index}>
                <Avatar src={record.receiverAvatar || ""} style={{marginRight: "2%"}}/>
                {record.receiver}
            </span>
          ),
        sorter: (a,b) => a.receiver.localeCompare(b.receiver)
      },
    {
      title: "Create date",
      dataIndex: "createDate",
      key: "createDate",
      sorter: (a,b) => new Date(a.createDate) - new Date(b.createDate),
      defaultSortOrder: "descend",
      render: (text) => formatDate(text)
    },
    {
        title: "Last updated",
        dataIndex: "lastUpdated",
        key: "lastUpdated",
        sorter: (a,b) => new Date(a.lastUpdated) - new Date(b.lastUpdated),
        render: (text) => formatDate(text)
      },
      {
        title: "Expire date",
        dataIndex: "expireDate",
        key: "expireDate",
        sorter: (a,b) => new Date(a.expireDate) - new Date(b.expireDate),
        render: (text) => formatDate(text)
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (text) => (
          <span style={{ color: text === "accepted" ? green[6] : text === "declined" ? red[6] : "inherit", fontWeight: "bold" }}>
            {text?.toUpperCase() || "Error"}
          </span>
        ),
        sorter: (a,b) => a.status.localeCompare(b.status)
      },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.status === "pending" ? (
          <Popconfirm
            title="Are you sure to cancel this invitation?"
            onConfirm={() => {
                handleCancelInvitation(record.invitationId)
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={loading}>Cancel</Button>
          </Popconfirm>
        ) : null,
    },
  ];

  const fetchInvitation = async () => {
    try {
      const invitationsRaw = await authAxios.get(`${siteAPI}/${site?._id}/get-invitations-by-site`);
      const formattedInvitation = invitationsRaw.data.invitations.map((invitation, index) => {
        const isExpired = new Date(invitation.expireAt) < new Date();
        return {
          key: index+1, invitationId:invitation._id,
          receiver: invitation.receiver.email,
          receiverAvatar:invitation.receiver.userAvatar,
          createDate:invitation.createdAt,
          lastUpdated: invitation.updatedAt,
          expireDate: invitation.expireAt,
          status: isExpired ? "expired" : invitation.status
        }
      })
      setInvitationList(formattedInvitation);
      console.log(formattedInvitation)
    } catch (error) {
      console.log(error)
    }
  }



  const handleCancelInvitation = async (invitationId) => {
    try {
      setLoading(true);
      await authAxios.delete(`${siteAPI}/${site._id}/cancel-invitation`, {data: {invitationId: invitationId}});
      fetchInvitation();
      message.success("Invitation cancel successfully!", 2);
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  
  };

  const filteredInvitations = invitationList.filter((invite) =>
    invite?.receiver?.toLowerCase().includes(searchEmail?.toLowerCase()) &&
    (filterStatus === "all" || !filterStatus || invite.status === filterStatus)
);


  return (
    <div style={{ padding: "40px", backgroundColor: "white" }}>
      <Breadcrumb style={{ marginBottom: "20px" }}>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/site">Site</Breadcrumb.Item>
        <Breadcrumb.Item>Manage Invitations</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{display: "flex" , flexWrap: "wrap", justifyContent:"start"}}>
      <div style={{width: "100%", textAlign: "start"}}>
        <Title level={2} style={{ marginTop: 0, marginBottom: "2%"}}>Invitations</Title>
      </div>

    <Input
        prefix={<SearchOutlined />}
        style={{width: "30vw"}}
        placeholder="Search by email"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
      />

      <Select
        placeholder="Filter by status"
        style={{ width: "10vw",marginLeft: "5%"}}
        allowClear
        onChange={(value) => setFilterStatus(value)}
      >
        <Option value="all">All</Option>
        <Option value="pending">Pending</Option>
        <Option value="accepted">Accepted</Option>
        <Option value="declined">Declined</Option>
        <Option value="expired">Expired</Option>
        <Option value="cancelled">Cancelled</Option>
      </Select>
      
    </div>


    <Table columns={columns} dataSource={filteredInvitations} pagination={{ pageSize: 5 }} style={{marginTop: "2%"}} />
    </div>
  );
};

export default ManageInvitations;
