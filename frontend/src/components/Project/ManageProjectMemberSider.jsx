
import {
  Menu,
  Select,
  Typography,
  Modal,
  theme
} from "antd";
import {
  ArrowLeftOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import Sider from "antd/es/layout/Sider";

const ManageProjectMemberSider = () => {
    //sider
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.split('/').pop();

  const menuItems = [
    { key: 'back', icon: <ArrowLeftOutlined />, label: 'Project members', path: '/site/project' },
    { key: 'wdp', icon: <PictureOutlined style={{fontSize:"1.6rem"}}/>, label: <span style={{fontSize:"1.2rem", padding: 0}}>WDP301</span>, disabled: true },
    // { key: 'details', label: 'Details', path: '/site/project/details' },
    // { key: 'members', label: 'Members', path: '/site/project/members' },
    // { key: 'setting-a', label: 'Setting A', path: '/site/project/setting-a' },
    // { key: 'setting-b', label: 'Setting B', path: '/site/project/setting-b' },
    // { key: 'setting-c', label: 'Setting C', path: '/site/project/setting-c' },
  ];

  const handleClick = ({ key }) => {
    const clickedItem = menuItems.find(item => item.key === key);
    if (clickedItem && clickedItem.path) {
      navigate(clickedItem.path);
    }
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();


  return (
    <Sider width={200} style={{ background: colorBgContainer }}>
    <Menu
      mode="inline"
      selectedKeys={[currentPath]}
      style={{ height: '100%', borderRight: 0 }}
      items={menuItems}
      onClick={handleClick}
    />
    </Sider>
  )
}

export default ManageProjectMemberSider