import { useContext, useEffect, useState } from "react";
import {
  Table,
  Button,
  Dropdown,
  Menu,
  Popconfirm,
  Input,
  Space,
  Typography,
  Breadcrumb,
  Avatar,
  message,
  Image,
  Modal,
  Select,
  Form,
  Upload
} from "antd";
import {
  UserOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  MoreOutlined,
  FileImageOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom"
import { green, red } from "@ant-design/colors";
import { AppContext } from "../../context/AppContext";
import authAxios from "../../utils/authAxios";

const { Title } = Typography;

const breadCrumbItems = [
  {
    title: <a href="/home">Home</a>
  },
  {
    title: "Manage sites"
  }
]

const mockEmailOptions = [
  { value: "user1@example.com", label: "user1@example.com" },
  { value: "user2@example.com", label: "user2@example.com" },
  { value: "user3@example.com", label: "user3@example.com" },
]

const mockSiteData = [
  { key: "1", name: "SDN302", projectAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE7MmifjwAGhgzOBMwJrZQqlhOBPc24RjG9w&s", projectManager: "JohnSmith@gmail.com", projectManagerAvatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1", createAt: "11/02/2004", updateAt: "13/02/2024"},
    { key: "2", name: "WDP301", projectAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE7MmifjwAGhgzOBMwJrZQqlhOBPc24RjG9w&s", projectManager: "TriNM@gmail.com", projectManagerAvatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png", createAt: "10/02/2004", updateAt: "15/02/2024"},
]

const siteApi = "http://localhost:9999/sites"
const userApi = "http://localhost:9999/users"

// component
const ManageSites = () => {
  const [loading, setLoading] = useState(false);
  const {user, showNotification} = useContext(AppContext);
  const [fileList, setFileList] = useState([]);
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [createSiteModalVisisble, setCreateSiteModalVisisble] = useState(false);
  const [sites, setSites] = useState(mockSiteData);
  const [userEmails, setUserEmails] = useState(mockEmailOptions);
  const [selectedEmail, setSelectedEmail] = useState("");
    // search state
    const [searchTerm, setSearchTerm] = useState("");
    // top pop up message
    const [messageApi, contexHolder] = message.useMessage();



useEffect(() => {
  // get all sites
  fetchSites();
  // get user emails
  fetchUserEmails();
}, [])

const fetchSites = () => {
  // get all sites
  authAxios.get(`${siteApi}/get-all`)
  .then(res => {
    const sites = res.data.map((site, index) => {
      const siteOwner = site.siteMember.find(member => member.roles[0] === "siteOwner");
      let siteAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE7MmifjwAGhgzOBMwJrZQqlhOBPc24RjG9w&s";
      const siteOwnerEmail = siteOwner._id.email;
      const siteOwnerAvatar = siteOwner._id.userAvatar;
      if(site.siteAvatar !== "default.jpg"){
        siteAvatar = site.siteAvatar;
      }
      return {
        key: index + 1,
        siteId: site._id,
        name: site.siteName, 
        siteAvatar: siteAvatar,
        siteStatus: site.siteStatus || "not found", 
        siteOwner: siteOwnerEmail || "Not found", 
        siteOwnerAvatar: siteOwnerAvatar || "https://api.dicebear.com/7.x/miniavs/svg?seed=1", 
        createAt: formatDate(site.createdAt), 
        updateAt: formatDate(site.updatedAt)
      }
    });
    // console.log(sites)
    setSites(sites);
  })
  .catch(err => {
    console.log(err);
    nav("/home");
  });
}

const fetchUserEmails = () => {
  // get user emails
  authAxios.get(`${userApi}/all`)
  .then(res => {
    const emails = res.data.map(currUser => {
      return {
          value: currUser.email,
          label: currUser.email,
          avatar: currUser.userAvatar,
          userId: currUser._id
        }
      }
    )
    // console.log(emails);
    setUserEmails(emails);
  })
  .catch(err => console.log(err))
}


const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("vi-VN"); // "03/03/2025"
};



// hien thi avatar sau khi upload
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  // giu lai file cuoi cung
  return e?.fileList.slice(-1);
};

const handleAvatarChange = ({ fileList }) => {
  setFileList(fileList.slice(-1)); // Chỉ giữ lại một file duy nhất
};

const handleCreateSite = async () => {
  try {
      await form.validateFields();
      const values = form.getFieldsValue();
      const formData = new FormData();
      formData.append("siteName", values.siteName);
      formData.append("siteDescription", values.siteDescription);
      formData.append("siteOwner", values.siteOwner);
      if(fileList[0]){
        formData.append("siteAvatar", fileList[0].originFileObj);
        console.log("has file");
      }
      console.log("FormData Entries:");
for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
      await authAxios.post(`${siteApi}/create`, formData,{
        headers: { 
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'multipart/form-data'
      }
      }
      );
      
      messageApi.open({
          type: 'success',
          content: 'Create site successfully!',
          duration: 2
      })
      showNotification(`📑 Site ${values.siteName} has been created 👋`)
      setCreateSiteModalVisisble(false);
      fetchSites();
      fetchUserEmails();

      form.resetFields();
      setFileList([]);
      setSelectedEmail("");
      
  } catch (error) {
    console.log(error)
      messageApi.open({
          type: 'error',
          content: String(error.response?.data?.error?.message),
          duration: 2
      })
  }
};

  // dung de sort date string
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    // console.log(new Date(year, month - 1, day))
    return new Date(year, month - 1, day);
  };


  // filter by search
  const filteredSites = sites.filter((site) => {
    // filter by search
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());    
    return matchesSearch;
  });



  const handleEditSite = () => {
    messageApi.open({
      type: "success",
      content: `Edit site clicked`,
      duration: 2
   })
  }



  // handle remove site
  const handleDeactivateSite = (key, name) => {
    // call api
    
    // update fe state
    messageApi.open({
      type: "success",
      content: `Site ${name} deactivated successfully`,
      duration: 2
   })
   showNotification(`📑 Site ${name} has been deactivated`)
  };


  // table column configs
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Image src={record.siteAvatar} style={{width: '3vw', height: '3vw'}}/>{text}
        </Space>
      ),
        sorter: (a, b) => a.name.localeCompare(b.name),
      width: "30%"
    },
    { title: "Site owner",
        dataIndex: "siteOwner",
         key: "siteOwner" ,
         render: (text, record) => (
          <Space>
            <Avatar src={record.siteOwnerAvatar} style={{ fontSize: "16px" }} />
            {text}
          </Space>
        ),
        sorter: (a, b) => a.siteOwner.localeCompare(b.siteOwner),
        width: "30%"
    },
    { title: "Site status",
      dataIndex: "siteStatus",
      key: "siteStatus",
      render: (text, record) => (
        text === "active" ? 
        <span style={{color: green[6], fontWeight: "bold"}}>{text}</span> :
        <span style={{color: red[6], fontWeight: "bold"}}>{text}</span>
      ),
      sorter: (a, b) => a.siteStatus.localeCompare(b.siteStatus),
      width: "10%"
  },
    { title: "Created date",
      dataIndex: "createAt",
       key: "createAt" ,
      sorter: (a, b) => parseDate(a.createAt) - parseDate(b.createAt),
      width: "10%"
    },
    { title: "Last updated",
      dataIndex: "updateAt",
       key: "updateAt" ,
      sorter: (a, b) => parseDate(a.updateAt) - parseDate(b.updateAt),
      width: "10%"
    },
    {
      title: <div style={{textAlign: "center"}}><span>Action</span></div>,
      key: "action",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu mode="vertical">
              <Menu.Item key="deactivateSite">
                <Popconfirm
                  title="Are you sure to deactive this site?"
                  icon={<ExclamationCircleOutlined style={{ color: "gold" }} />}
                  onConfirm={() => handleDeactivateSite(record.key, record.name)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text">Deactivate</Button>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item key="editSite">
                <Button type="text" onClick={() => handleEditSite()}>Edit site</Button>
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

  // render fe
  return (
    <div style={{ padding: "30px", textAlign: "left", backgroundColor: 'white', height: "100%"}}>
      {/* hien thi message api */}
      {contexHolder}

      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "20px" }} items={breadCrumbItems} />

      {/* title and button */}
      <div style={{ display: "flex", gap: "10px",  marginRight: "20px", justifyContent: "space-between" }}>
          <Title level={2}>Sites</Title>
          <Button type="primary" style={{marginTop: "35px"}} onClick={() => setCreateSiteModalVisisble(true)}>Create site</Button>
      </div>

      <div style={{ display: "flex", marginBottom: "20px"}}>
        <div style={{ display: "flex", gap: "10px",  marginRight: "20px" }}>
          {/* search bar */}
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search site"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 400 }}
          />
        </div>
      </div>


      {/* project table */}
      <Table 
      columns={columns} 
      dataSource={filteredSites} 
      pagination={{ pageSize: 5 }}
      scroll={{ x: "max-content" }}
      style={{
        width: "100%",
        borderRadius: "5%"
      }}
      />

      {/* Modal tao site*/}
            <Modal
            title="Create new site"
            visible={createSiteModalVisisble}
            onCancel={() => setCreateSiteModalVisisble(false)}
            footer={[
              
            ]}
          >
             <Form layout="vertical" form={form} onFinish={handleCreateSite} style={{paddingLeft: '0', paddingRight: '10%'}}>
           {/* site name input */}
          <Form.Item label="Site name" name="siteName"
            rules={[
                { required: true, message: "Site name is required!" },
                { min: 3, message: "Site name must be at least 3 character"}
            ]}
            hasFeedback
          >
            <Input
              placeholder="Site name"
            />
          </Form.Item>

            {/* site description input */}
          <Form.Item label="Site description" name="siteDescription"
            hasFeedback
          >
            <Input.TextArea
              rows={2}
              placeholder="Site description"
            />
          </Form.Item>

          {/* site owner input */}
          <Form.Item label="Site owner" name="siteOwner"
            rules={[
              { required: true, message: "Site Owner is required" },
          ]}
            hasFeedback
          >
            <Select
              showSearch // Hiển thị ô tìm kiếm
              allowClear
              style={{ width: "100%" }}
              placeholder="Select user email"
              value={selectedEmail}
              onChange={setSelectedEmail}
              options={userEmails}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              } // Lọc email theo từ khóa nhập vào
              optionRender={(item) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar src={item.data.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} style={{ marginRight: 8 }} />
                  {item.label}
                </div>
              )}
            />
          </Form.Item>

          {/* site avatar input */}
          <Form.Item label="Site avatar" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload listType="picture" 
            beforeUpload={() => false} // Ngăn upload tự động
            onChange={handleAvatarChange} // Giới hạn số file
            >
              {fileList.length < 1 && (
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            )}
            </Upload>
          </Form.Item>

          <Button key="add" htmlType="submit"  disabled={loading} style={{ backgroundColor: green[6], color: "#fff", marginLeft: "2%"}}>
                {loading ? <LoadingOutlined spin /> : "Create"}
              </Button>
              <Button key="cancel" danger onClick={() => setCreateSiteModalVisisble(false)} style={{marginLeft: "2%"}}>
                Cancel
              </Button>,
        </Form>
          </Modal>

    </div>
  );
};

export default ManageSites;
