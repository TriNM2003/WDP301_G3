import { red } from '@ant-design/colors';
import { CloseCircleOutlined, DownOutlined, ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Checkbox, Dropdown, Menu, Popconfirm, Radio, Space, Table } from 'antd'
import React from 'react'

const SiteMemberTable = ({handleRoleChange, formatRole, site, members, handleRevokeAccess}) => {
    // Hiển thị menu chọn vai trò
  const roleMenu = (record) => (
    <Menu>
      <Menu.ItemGroup title="Select role">
        <Checkbox.Group
          value={record.siteMemberRole}
          onChange={(values) => handleRoleChange(record.siteMemberId, record.siteMemberRole, values)}
          style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "5px" }}
        >
          {site?.siteRoles?.map((role, index) => {
            return (
              <Checkbox key={index} value={role} disabled={role.includes("siteOwner")}>
                {formatRole(role)}
              </Checkbox>
            );
          }) || <Checkbox key={1} value="not found">Not found</Checkbox>}
        </Checkbox.Group>
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
              disabled={record.siteMemberRole.includes("siteOwner")}
              >
                <Button style={{ width: "100%", textAlign: "left" }}>
            { 
              formatRole(record.siteMemberRole[0])
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
                  <span style={{color: red[6]}}><CloseCircleOutlined /> Revoke access</span>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          {!record.siteMemberRole.includes("siteOwner") && <Button icon={<MoreOutlined />} type="text" />}
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