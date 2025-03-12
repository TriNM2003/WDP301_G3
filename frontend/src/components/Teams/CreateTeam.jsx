import React, { useState, useEffect, useContext } from "react";
import { Modal, Form, Input, Button, List, Avatar, Tag, Select , message} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext";
import axios from "axios";

const { Option } = Select;


const CreateTeam = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [teamLeader, setTeamLeader] = useState(null);
  const [siteMembers, setSiteMembers] = useState([]);
  const [showList, setShowList] = useState(false);
  const [inputError, setInputError] = useState(""); // Thêm state lưu lỗi
  const { teams, user, site, accessToken , setTeams ,siteAPI} = useContext(AppContext);


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

  // Lọc user theo search term


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


  // Thêm thành viên vào danh sách team


  const handleSelectUser = (member) => {
    if (!selectedUsers.some((u) => u._id === member._id)) {
      setSelectedUsers([...selectedUsers, member]);
    }
    setSearchTerm(""); 
    // setShowList(false); 
  };


  // Xóa thành viên khỏi danh sách
  const handleRemoveUser = (id) => {
    setSelectedUsers(selectedUsers.filter(member => member._id !== id));
  };


    // Gửi yêu cầu tạo team


const handleCreateTeam = async (values) => {
  // Kiểm tra nếu input có giá trị nhưng chưa được chọn từ danh sách
  if (searchTerm && !siteMembers.some(member => 
      member.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.email.toLowerCase().includes(searchTerm.toLowerCase()))) {
    setInputError("Member not exist in this site");
    return;
  }

  // Kiểm tra nếu tất cả thành viên được chọn đều thuộc site
  const invalidMembers = selectedUsers.filter(member => 
    !siteMembers.some(siteMember => siteMember._id === member._id)
  );

  if (invalidMembers.length > 0) {
    message.error("Some selected members are not part of the site. Please check again.");
    return;
  }
  console.log("Payload gửi lên server:", {
    teamName: values.teamName,
    teamMembers: selectedUsers.map((member) => member._id),
  });
  

  try {
    const response = await axios.post(
      `http://localhost:9999/sites/${site._id}/teams/create-team`,
      {
        teamName: values.teamName,
        teamMembers: selectedUsers.map((member) => member._id),
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    axios.get(`${siteAPI}/${site._id}/teams/get-teams-in-site`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then((res) => {
      setTeams(res.data);
    })
    .catch((err) => {
      console.error("Error fetching projects in site:", err);
    });
    console.log("Response từ server:", response.data);

    message.success("Team created successfully!");
    form.resetFields();
    setSelectedUsers([]);
    setSearchTerm("");
    setInputError(""); // Xóa lỗi sau khi tạo thành công
    onCreate();
  } catch (error) {
    console.error("Error creating team:", error);
    message.error("Failed to create team.");
  }
};

  return (
    <Modal
      open={visible}
      title="Create New Team"
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleCreateTeam}>

        {/* Team Name */}
        <Form.Item
          name="teamName"
          label="Team Name"
          rules={[
            { required: true, message: "Please enter a team name!" },
            { min: 3, message: "Team name must be at least 3 characters long!" }
          ]}
        >
          <Input placeholder="Enter team name" />
        </Form.Item>




        {/* Mời thành viên vào project */}
        <Form.Item label="Add Team Members ( Optional )" validateStatus={inputError ? "error" : ""} help={inputError}>
          <div style={{ position: "relative" }}>
            <Input
              placeholder="Search by username or email"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowList(true);
                setInputError("");
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




        {/* Footer Buttons */}
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

export default CreateTeam;
