import { DownOutlined, ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu, Popconfirm, Space, Table, Checkbox  } from 'antd';
import React from 'react'

const ProjectMemberTable = ({project, formatRole, handleRoleChange, handleRemoveMember, filteredMembers}) => {
      // Hiển thị menu chọn vai trò
      const roleMenu = (record, index) => (
        <Menu>
          <Menu.ItemGroup title="Select roles" key={index+ 1} eventKey='selectRole'>
            <Checkbox.Group
              value={record.projectMemberRole} // Giả sử đây là một mảng
              onChange={(selectedRoles) => handleRoleChange(
                record.key, 
                selectedRoles, 
                record.projectMemberId, 
                record.projectMemberName
              )}
              style={{ display: "flex", flexDirection: "column", padding: "10px", gap: "5px" }}
            >
              {project?.projectRoles?.map((role, index) => (
                <Checkbox key={index + 1} value={role} disabled={role === "projectManager"}>
                  {formatRole(role)}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Menu.ItemGroup>
        </Menu>
      );
      

    // columns
const columns = [
    {
      title: "Name",
      dataIndex: "projectMemberName",
      key: "projectMemberName",
      render: (text, record) => (
        <Space>
          <Avatar src={record.projectMemberAvatar} style={{ fontSize: "16px" }} />
          {text}
        </Space>
      ),
        sorter: (a, b) => a.projectMemberName.localeCompare(b.projectMemberName),
      width: "35%"
    },
    { title: "Email",
        dataIndex: "projectMemberEmail",
         key: "projectMemberEmail" ,
        sorter: (a, b) => a.projectMemberEmail.localeCompare(b.projectMemberEmail),
        width: "35%"
    },
    {
      title: "Role",
      dataIndex: "projectMemberRole",
      key: "projectMemberRole",
      render: (_, record) => (
        <Dropdown overlay={roleMenu(record)} trigger={["click"]} disabled={record.projectMemberRole === "projectManager"}>
          <Button style={{ width: "100%", textAlign: "left" }}>
            {formatRole(record.projectMemberRole)} <DownOutlined style={{ float: "right" }} />
          </Button>
        </Dropdown>
      ),
      sorter: (a, b) => a.projectMemberRole.localeCompare(b.projectMemberRole),
      width: "15%",
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
                  title="Confirm remove?"
                  icon={<ExclamationCircleOutlined style={{ color: "gold" }} />}
                  onConfirm={() => handleRemoveMember(record.key, record.projectMemberName, record.projectMemberId, record.projectMemberAvatar, record.projectMemberEmail)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text">Remove</Button>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} type="text"  disabled={record.projectMemberRole === "projectManager"}/>
        </Dropdown>
      )
      ,
      width: "15%"
    },
  ];

  return (
    <Table
      columns={columns} 
      dataSource={filteredMembers} 
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content" }}
      style={{
        width: "100%",
        borderRadius: "15px"
      }}
      />
  )
}

export default ProjectMemberTable