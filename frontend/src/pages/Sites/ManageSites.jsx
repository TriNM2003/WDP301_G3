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
  Upload,
  Row
} from "antd";
import {
  UserOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  MoreOutlined,
  FileImageOutlined,
  UploadOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom"
import { blue, green, red } from "@ant-design/colors";
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

const userApi = "http://localhost:9999/users"

// component
const ManageSites = () => {
  const {user, showNotification, siteAPI, accessToken} = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [createSiteModalVisisble, setCreateSiteModalVisisble] = useState(false);
  const [sites, setSites] = useState(mockSiteData);
  const [userEmails, setUserEmails] = useState(mockEmailOptions);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editSiteModalVisible, setEditSiteModalVisible] = useState(false);
  const [siteMemberOption, setSiteMemberOption] = useState([]);

useEffect(() => {
  // get all sites
  fetchSites();
  // get user emails
  fetchUserEmails();
}, [])

const fetchSites = () => {
  // get all sites
  authAxios.get(`${siteAPI}/get-all`)
  .then(res => {
    const sites = res.data.map((site, index) => {
      const siteOwner = site?.siteMember.find(member => member?.roles.includes("siteOwner"));
      let siteAvatar = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE7MmifjwAGhgzOBMwJrZQqlhOBPc24RjG9w&s";
      const siteOwnerEmail = siteOwner?._id.email;
      const siteOwnerAvatar = siteOwner?._id.userAvatar;
      if(site.siteAvatar !== "default.jpg"){
        siteAvatar = site.siteAvatar;
      }
      return {
        key: index + 1,
        siteId: site._id,
        name: site.siteName, 
        siteAvatar: siteAvatar,
        siteDescription: site.siteDescription,
        siteSlug: site.siteSlug,
        siteStatus: site.siteStatus || "not found", 
        siteOwner: siteOwnerEmail || "Not found",
        siteOwnerId: siteOwner._id._id || "Id not found",
        siteOwnerAvatar: siteOwnerAvatar || "https://api.dicebear.com/7.x/miniavs/svg?seed=1", 
        siteMember: site.siteMember,
        createAt: formatDate(site.createdAt), 
        updateAt: formatDate(site.updatedAt)
      }
    });
    // console.log(sites)
    setSites(sites);
  })
  .catch(err => {
    console.log(err);
    // nav("/home");
  });
}

const fetchUserEmails = () => {
  // get user emails
  authAxios.get(`${userApi}/all`)
  .then(res => {
    const emails = res.data.reduce((acc, currUser) => {
      const isInSite = currUser.site !== undefined;
      const isActive = currUser.status === "active";
      if(!isInSite && isActive){
        acc.push({
          value: currUser.email,
          label: currUser.email,
          avatar: currUser.userAvatar,
          userId: currUser._id
        }) 
      }
      return acc;
      
      }, []
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



const handleCreateSite = async () => {
  try {
      setLoading(true);
      await form.validateFields();
      const values = form.getFieldsValue();
      const formData = new FormData();
      formData.append("siteName", values.siteName);
      formData.append("siteOwner", values.siteOwner);

    // console.log(values.siteName, values.siteOwner)
      await authAxios.post(`${siteAPI}/create`, {siteName: values.siteName, siteOwner: values.siteOwner});
      
      message.success('Create site successfully!',2)
      showNotification(`📑 Site ${values.siteName} has been created 👋`)
      setCreateSiteModalVisisble(false);
      fetchSites();
      fetchUserEmails();

      form.resetFields();
      setSelectedEmail("");
      
  } catch (error) {
    console.log(error)
      message.error(String(error.response?.data?.error?.message),2)
  } finally{
    setLoading(false);
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
    const matchesSearch = site?.name.toLowerCase().includes(searchTerm?.toLowerCase());    
    return matchesSearch;
  });


  const handleFileChange = (file) => {
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  async function handleEditSite(values){
    setLoading(true);
    try {
      await authAxios.put(`${siteAPI}/${values?.siteId}/adminEdit`, {siteOwnerId: values?.siteOwner})
      
      fetchSites();
      message.success("Site updated successfully!");
      showNotification("Site Updated", `Site ${values?.siteName} has been updated!`);
      editForm.resetFields()
      setEditSiteModalVisible(false);
    } catch (error) {
      console.error("Error updating site:", error);
      message.error("Failed to update site.");
    } finally {
      setLoading(false);
    }
  }

  // handle deactivate site
  async function handleDeactivateSite(siteId, siteData){
    try {
      await authAxios.put(`${siteAPI}/${siteId}/adminDeactivate`);
      setSites(sites => 
        sites.map(site => 
          site.siteId === siteId ? {...site, siteStatus: "deactivated"} : site
        ));
    } catch (error) {
      console.error("Error deactivating site:", error);
      message.error("Failed to deactivate site.");
    } finally {
      message.success(`Site "${siteData?.siteName}" has been deactivated.`, 2)
      showNotification("Site Deactivated", `📑 Site ${siteData?.siteName} has been deactivated`)
    }
  };

  async function handleActiveSite(siteId, siteData){
    try {
      await authAxios.put(`${siteAPI}/${siteId}/active`);
      setSites(sites => 
        sites.map(site => 
          site.siteId === siteId ? {...site, siteStatus: "active"} : site
        ));
    } catch (error) {
      console.error("Error deactivating site:", error);
      message.error("Failed to deactivate site.");
    } finally {
      message.success(`Site "${siteData?.siteName}" has been activated.`, 2)
      showNotification("Site Deactivated", `📑 Site ${siteData?.siteName} has been activated`)
    }
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
              {record.siteStatus !== "deactivated" ?
              <Menu.Item key="deactivateSite">
                <Popconfirm
                  title="Are you sure to deactive this site?"
                  icon={<ExclamationCircleOutlined style={{ color: "gold" }} />}
                  onConfirm={() => handleDeactivateSite(record.siteId, {siteName: record.name})}
                  okText="Yes"
                  cancelText="No"
                >
                 <span style={{color: red[6], fontSize: "1.0rem"}}><CloseCircleOutlined /> Deactivate</span>
                </Popconfirm>
              </Menu.Item> :
                <Menu.Item key="activeSite">
                <Popconfirm
                  title="Are you sure to active this site?"
                  icon={<ExclamationCircleOutlined style={{ color: "gold" }} />}
                  onConfirm={() => handleActiveSite(record.siteId, {siteName: record.name})}
                  okText="Yes"
                  cancelText="No"
                >
                <span style={{color: green[6], fontSize: "1.0rem"}}><CheckCircleOutlined /> Active</span>
                </Popconfirm>
              </Menu.Item>
              }
              
              <Menu.Item key="editSite" onClick={() => {
                  editForm.setFieldsValue({...record, siteName: record.name})
                  const siteMemberList = sites.find(site => site.siteId === record.siteId).siteMember.map(member => {
                    return {
                      label: member._id.email,
                      value: member._id._id,
                      avatar: member._id.userAvatar
                    }
                  })
                  setSiteMemberOption(siteMemberList)
                  setEditSiteModalVisible(true);
                }}>
                <span style={{color: blue[6], fontSize: "1.0rem"}}><EditOutlined /> Edit site</span>
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


          <Button key="add" htmlType="submit"  disabled={loading} style={{ backgroundColor: green[6], color: "#fff", marginLeft: "2%"}}>
                {loading ? <LoadingOutlined spin /> : "Create"}
              </Button>
              <Button key="cancel" danger onClick={() => setCreateSiteModalVisisble(false)} style={{marginLeft: "2%"}}>
                Cancel
              </Button>,
        </Form>
          </Modal>


          {/* modal edit site */}
          <Modal
          title="Edit site"
          visible={editSiteModalVisible}
          onCancel={() => {
            setEditSiteModalVisible(false)
            editForm.resetFields()
          }}
          footer={false}
          >
        <Form layout="vertical" onFinish={handleEditSite} form={editForm}>

          <Form.Item label="siteId" name="siteId" hidden>
            <Input />
          </Form.Item>
          <div style={{textAlign: "center"}}>
            {/* Avatar Hiển Thị Ảnh */}
            <Form.Item>
              <Avatar size={100} src={editForm.getFieldValue("siteAvatar") || imagePreview || "https://via.placeholder.com/100"} />
            </Form.Item>
            {/* Upload ảnh */}
            <Form.Item name="siteAvatar">
              <Upload disabled
                showUploadList={false}
                beforeUpload={handleFileChange}
              >
                <Button icon={<UploadOutlined />} disabled>Upload Image</Button>
              </Upload>
            </Form.Item>
          </div>

          {/* site owner input */}
          <Form.Item label="Site Owner" name="siteOwner"
            rules={[
              { required: true, message: "Site Owner is required" },
          ]}
            hasFeedback
          >
            <Select
              showSearch // Hiển thị ô tìm kiếm
              style={{ width: "100%" }}
              placeholder="Select user email"
              options={siteMemberOption}
              optionRender={(option) => (
                <Space>
                  <Avatar src={option.data.avatar} />
                  {option.label}
                </Space>
              )}
            />
          </Form.Item>

          <Form.Item label="Site Name" name="siteName" rules={[
              { required: true, min: 3, message: "Site name must be at least 3 character" },
          ]}>
            <Input disabled/>
          </Form.Item>

          <Form.Item label="Site Description" name="siteDescription">
            <Input.TextArea  disabled/>
          </Form.Item>

          <Form.Item label="Site Slug" name="siteSlug" rules={[
              { required: true, message: "Site slug is required" },
          ]}>
            <Input disabled/>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
          </Modal>
    </div>
  );
};

export default ManageSites;
