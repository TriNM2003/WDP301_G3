import React, { useState, useEffect, useContext } from "react";
import { Modal, Form, Input, Button, List, Avatar, Tag, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const CreateProject = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const { site, accessToken, setProjects, user } = useContext(AppContext); // Lấy user hiện tại
  const [searchTerm, setSearchTerm] = useState("");
  const [siteMembers, setSiteMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showList, setShowList] = useState(false);

  // Lấy danh sách thành viên trong site (bỏ qua user đang tạo project)
  useEffect(() => {
    if (site._id && accessToken) {
      axios
        .get(`http://localhost:9999/sites/${site._id}/members`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          setSiteMembers(res.data.filter(member => member._id !== user._id)); // Loại bỏ user hiện tại
        })
        .catch((err) => {
          console.error("Error fetching site members:", err);
        });
    }
  }, [site, accessToken, user]);

  // Lọc thành viên theo từ khóa tìm kiếm
  const filteredUsers = searchTerm
    ? siteMembers.filter(
        (member) =>
          member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : siteMembers; 

  // Chỉ hiển thị tối đa 5 thành viên, nếu nhiều hơn sẽ có scroll
  const visibleUsers = filteredUsers.slice(0, 5);

  // Chọn thành viên vào danh sách
  const handleSelectUser = (member) => {
    if (!selectedUsers.some((u) => u._id === member._id)) {
      setSelectedUsers([...selectedUsers, member]);
    }
    setSearchTerm(""); // Reset ô tìm kiếm sau khi chọn
    setShowList(false); // Ẩn danh sách sau khi chọn
  };

  // Xóa thành viên khỏi danh sách đã chọn
  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter((member) => member._id !== id));
  };

  // Kiểm tra thành viên có hợp lệ không
  const isValidMembers = () => {
    return selectedUsers.every(member => 
      siteMembers.some(siteMember => siteMember._id === member._id)
    );
  };

  // Gửi yêu cầu tạo project
  const handleCreateProject = async (values) => {
    if (!isValidMembers()) {
      message.error("Some members are not in the site. Please check again.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9999/sites/${site._id}/projects/create`,
        {
          projectName: values.projectName,
          projectMember: selectedUsers.map((member) => member._id),
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setProjects((prev) => [...prev, response.data.project]);
      message.success("Project created successfully!");
      form.resetFields();
      setSelectedUsers([]); // Reset danh sách sau khi tạo
      onCreate();
    } catch (error) {
      console.error("Error creating project:", error);
      message.error("Failed to create project.");
    }
  };

  return (
    <Modal open={visible} title="Create New Project" onCancel={onCancel} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleCreateProject}>
        {/* Nhập tên project */}
        <Form.Item
          name="projectName"
          label="Project Name"
          rules={[{ required: true, message: "Please enter a project name!" }]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>

        {/* Mời thành viên vào project */}
        <Form.Item label="Invite Project Members">
          <div style={{ position: "relative" }}>
            <Input
              placeholder="Search by username or email"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowList(true);
              }}
              style={{ paddingRight: "40px" }}
            />

            {/* Icon User */}
            <UserOutlined
              onClick={() => setShowList(!showList)} // Toggle danh sách
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#1890ff",
                fontSize: "18px",
              }}
            />
          </div>

          {/* Hiển thị danh sách thành viên (tối đa 5) */}
          {showList && (
            <List
              bordered
              size="small"
              dataSource={visibleUsers}
              style={{
                maxHeight: "200px",
                overflowY: "auto", // Thanh scroll nếu nhiều hơn 5 người
                marginTop: "5px",
                borderRadius: "4px",
              }}
              renderItem={(member) => (
                <List.Item
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectUser(member)}
                >
                  <Avatar src={member.userAvatar} size="small" style={{ marginRight: 8 }} />
                  {member.username} ({member.email})
                </List.Item>
              )}
            />
          )}

          {/* Danh sách thành viên đã chọn */}
          <div style={{ marginTop: "10px" }}>
            {selectedUsers.map((member) => (
              <Tag
                key={member._id}
                closable
                onClose={() => handleRemoveUser(member._id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <Avatar src={member.userAvatar} size="small" style={{ marginRight: 5 }} />
                {member.username}
              </Tag>
            ))}
          </div>
        </Form.Item>

        {/* Nút tạo project */}
        <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
          <Button key="cancel" onClick={onCancel} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button key="create" type="primary" onClick={() => form.submit()}>
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProject;
