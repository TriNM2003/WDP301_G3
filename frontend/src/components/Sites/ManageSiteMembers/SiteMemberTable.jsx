import { DownOutlined, ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu, Popconfirm, Radio, Space, Table } from 'antd'
import React from 'react'

const SiteMemberTable = ({handleRoleChange, formatRole, site, members, handleRevokeAccess}) => {
    // Hiển thị menu chọn vai trò
  const roleMenu = (record) => (
    <Menu>
      <Menu.ItemGroup title="Select role">
        <Radio.Group
          value={record.siteMemberRole}
          onChange={(e) => handleRoleChange(record.siteMemberId, record.siteMemberRole, e.target.value)}
          style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "5px" }}
        >
          {site?.siteRoles?.map((role, index) => {
            return (
              <Radio key={index} value={role} disabled={role === "siteOwner"}>
                {formatRole(role)}
              </Radio>
            );
          }) || <Radio key={1} value="not found">Not found</Radio>}
        </Radio.Group>
      </Menu.ItemGroup>
    </Menu>
  );
    // Cột của bảng
  const columns = [
    {
      title: "Name",
      dataIndex: "siteMemberName",
      key: "siteMemberName",
      render: (text, record) => (
        <Space>
          <Avatar src={record.siteMemberAvatar} style={{ fontSize: "16px" }} />
          {text}
        </Space>
      ),
        sorter: (a, b) => a.siteMemberName.localeCompare(b.siteMemberName),
      width: "35%"
    },
    { title: "Email",
        dataIndex: "siteMemberEmail",
         key: "siteMemberEmail" ,
        sorter: (a, b) => a.siteMemberEmail.localeCompare(b.siteMemberEmail),
        width: "35%"
    },
      {
          title: "Role",
          dataIndex: "siteMemberRole",
          key: "siteMemberRole",
          render: (_, record) => (
              <Dropdown overlay={roleMenu(record)} trigger={["click"]} 
              disabled={record.siteMemberRole === "siteOwner"}
              >
                <Button style={{ width: "100%", textAlign: "left" }}>
            { 
              formatRole(record.siteMemberRole)
            } <DownOutlined style={{ float: "right" }} />
          </Button>
              </Dropdown>
          ),
          sorter: (a, b) => a.siteMemberRole.localeCompare(b.siteMemberRole),
          width: "15%"
      },
    {
      title: <div style={{textAlign: "center"}}><span>Action</span></div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="kick">
                <Popconfirm
                  title="Confirm revoke access?"
                  icon={<ExclamationCircleOutlined style={{ color: "gold" }} />}
                  onConfirm={() => {
                    handleRevokeAccess(record.siteMemberName, record.siteMemberId)
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text">Revoke access</Button>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          {record.siteMemberRole === "siteMember" && <Button icon={<MoreOutlined />} type="text" />}
        </Dropdown>
      )
      ,
      width: "15%"
    },
  ];
  return (
    <Table 
      columns={columns} 
      dataSource={members} 
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content" }}
      style={{
        width: "100%",
        borderRadius: "15px"
      }}
      />
  )
}

export default SiteMemberTable