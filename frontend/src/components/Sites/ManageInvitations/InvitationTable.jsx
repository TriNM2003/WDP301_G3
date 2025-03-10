import { green, red } from '@ant-design/colors';
import { Avatar, Button, Popconfirm, Table } from 'antd';
import React from 'react'

const InvitationTable = ({handleCancelInvitation, filteredInvitations}) => {
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
              )
          },
        {
          title: "Create date",
          dataIndex: "createDate",
          key: "createDate",
        },
        {
            title: "Last updated",
            dataIndex: "lastUpdated",
            key: "lastUpdated",
          },
          {
            title: "Expire date",
            dataIndex: "expireDate",
            key: "expireDate",
          },
          {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text) => (
              <span style={{ color: text === "accepted" ? green[6] : text === "declined" ? red[6] : "inherit", fontWeight: "bold" }}>
                {text.toUpperCase() || "Error"}
              </span>
            ),
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
                <Button danger>Cancel</Button>
              </Popconfirm>
            ) : null,
        },
      ];


  return (
    <Table columns={columns} dataSource={filteredInvitations} pagination={{ pageSize: 5 }} />
  )
}

export default InvitationTable