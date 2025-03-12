import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Image, Menu, Popconfirm, Space, Table } from 'antd';
import React from 'react'

const ProjectsTable = ({parseDate, handleMoveToTrash, filteredProjects, setEditProjectModalVisible, setCurrentProjectSettings}) => {
    // table column configs
  const columns = [
    {
      title: "Name",
      dataIndex: "projectName",
      key: "projectName",
      render: (text, record) => (
        <Space>
          <Image src={record.projectAvatar} style={{width: '3vw', height: '3vw'}}/>{text}
        </Space>
      ),
        sorter: (a, b) => a.projectName.localeCompare(b.projectName),
      width: "30%"
    },
    { title: "Project Manager",
        dataIndex: "projectManager",
         key: "projectManager" ,
         render: (text, record) => (
          <Space>
            <Avatar src={record.projectManagerAvatar} style={{ fontSize: "16px" }} />
            {text}
          </Space>
        ),
        sorter: (a, b) => a.projectManager.localeCompare(b.projectManager),
        width: "30%"
    },
    { title: "Status",
        dataIndex: "projectStatus",
         key: "projectStatus" ,
        sorter: (a, b) => a.projectStatus.localeCompare(b.projectStatus),
        render: (text) => {
            if(text === 'archived'){
                return <span style={{color: "gray", fontWeight: "bold"}}>{text?.toUpperCase()}</span>
            }else if(text === 'active'){
                return <span style={{color: "green", fontWeight: "bold"}}>{text?.toUpperCase()}</span>
            }else{
                return <span style={{color: "red", fontWeight: "bold"}}>{text?.toUpperCase()}</span>
            }
            
        }
      },
    { title: "Created date",
      dataIndex: "createDate",
       key: "createDate" ,
      sorter: (a, b) => parseDate(a.createDate) - parseDate(b.createDate),
    },
    { title: "Last updated",
      dataIndex: "updateDate",
       key: "updateDate" ,
      sorter: (a, b) => parseDate(a.updateDate) - parseDate(b.updateDate),
    },
    {
      title: <div style={{textAlign: "center"}}><span>Action</span></div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu mode="vertical">
              <Menu.Item key="removeProject">
                <Popconfirm
                  title="Are you sure to remove this project?"
                  icon={<ExclamationCircleOutlined style={{ color: "gold" }} />}
                  onConfirm={() => handleMoveToTrash(record.projectId, record.projectName)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />} type="text" >Move to trash</Button>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item key="editProject">
                <Button type="text" icon={<EditOutlined />} onClick={() => {
                    setEditProjectModalVisible(true);
                    setCurrentProjectSettings({projectId: record.projectId, projectName: record.projectName, projectAvatar: record.projectAvatar, projectDescription: record.projectDescription})
                }}>Edit project</Button>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button icon={<MoreOutlined />} type="text" />
        </Dropdown>
      )
      ,
      width: "10%"
    },
  ];

  return (
    <Table 
    columns={columns} 
    dataSource={filteredProjects} 
    pagination={{ pageSize: 5 }}
    scroll={{ x: "max-content" }}
    style={{
      width: "100%",
      borderRadius: "5%",
      overflowY: "unset"
    }}
    />
  )
}

export default ProjectsTable