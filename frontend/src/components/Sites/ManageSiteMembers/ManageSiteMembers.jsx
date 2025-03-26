import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import authAxios from "../../../utils/authAxios";
import ManageSiteMemberBreadCrump from "./ManageSiteMemberBreadCrump";
import SiteMemberTable from "./SiteMemberTable";
import ManageSiteMemberFilter from "./ManageSiteMemberFilter";
import InviteMemberModal from "./InviteMemberModal";
import SearchInviteOption from "./SearchInviteOption";
import { message } from "antd";


function formatRole(text) {
  // Chèn khoảng trắng trước các chữ in hoa (trừ chữ đầu tiên)
  let result = text.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Viết hoa chữ cái đầu của mỗi từ
  return result.replace(/\b\w/g, char => char.toUpperCase());
}

const ManageSiteMembers = () => {
  const {user, site, setSite, siteAPI, userApi, showNotification, showMessage, messageHolder, setRefreshNoti} = useContext(AppContext);

  const [tableData, setTableData] = useState([]);
  const [invitaionEmails, setInvitationEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterRole, setSelectedFilterRole] = useState(null);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState();
  const [inviteLoading, setInviteLoading] = useState();
  const [changeRoleLoading, setChangeRoleLoading] = useState(false);
  const [revokeAccessLoading, setRevokeAccessLoading] = useState(false);

useEffect(() => {
  console.clear();
  fetchData();
},[site])

const fetchData = async () => {
  try {
  const siteMemberData = await authAxios.get(`${siteAPI}/${site?._id}/get-site-members`);
  const memberData = siteMemberData.data.map((member, index) => {
    return { key: index+1,
       siteMemberId: member._id._id,
        siteMemberName: member._id.username,
         siteMemberEmail: member._id.email,
          siteMemberRole: member.roles,
           siteMemberAvatar: member._id.userAvatar }
  })
  setTableData(memberData)

  const systemRoles =  await authAxios.get("http://localhost:9999/systemRoles/get-all");
  const adminRoleId = systemRoles?.data.find(role => role.roleName === "admin")?._id;

  // get user emails
    const allEmailData = await authAxios.get(`${userApi}/all`);
    const emails = allEmailData.data.reduce((acc, currUser) => {
      const isActive = currUser.status === "active"
      const isSiteMember = currUser.site === user.site;
      const isNotInSite = currUser.site === undefined;
      const isAdmin = currUser?.roles.includes(adminRoleId);
      if (!isSiteMember && isActive && isNotInSite && !isAdmin) {
        acc.push({
          value: currUser.email,
          label: currUser.email,
          avatar: currUser.userAvatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
          userId: currUser._id
        })
      }
      return acc;
    }, [])
    setInvitationEmails(emails);
    console.log(emails)
  } catch (error) {
    console.log(error)
  }
 }

  const handleInviteMember = async () => {
    if(selectedEmail === "" || selectedEmail === undefined){
      showMessage("error", "Please select use email to invite", 2);
      return;
    }
    try {
      setInviteLoading(true)
      const invitedUserId = invitaionEmails.find(item => item.value === selectedEmail).userId;
      // console.log(selectedEmail)
      await authAxios.post(`${siteAPI}/${site._id}/invite-member`, { receiverId: invitedUserId })
      showMessage("success", `Send invitation to ${selectedEmail.toString()} successfully !`, 2)
      showNotification(`👋 Invitation have been sent to ${selectedEmail.toString()} ✉`);
      setSelectedEmail();
      setInviteModalVisible(false);
      setRefreshNoti(prev => !prev);
      await fetchData();
    } catch (error) {
      console.log(error)
    } finally {
      setInviteLoading(false);
    }

  }

  // Xử lý tìm kiếm
  let filteredMembers = tableData;
  if(selectedFilterRole !== "All"){
    filteredMembers = tableData.filter(
        (member) =>
          member.siteMemberName?.toLowerCase().includes(searchTerm?.toLowerCase()) &&
          (!selectedFilterRole || member.siteMemberRole.includes(selectedFilterRole))
      );
  }else{
    filteredMembers = tableData.filter(
      (member) =>
        member.siteMemberName?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }


  // Xử lý xóa thành viên bằng Popconfirm
  const handleRevokeAccess = async (name, sitememberid) => {
    try {
      setRevokeAccessLoading(true);
      if(!siteAPI && !site._id){
        showMessage("error", "Site data not found", 2);
        return;
      }
      const result = await authAxios.delete(`${siteAPI}/${site._id}/revoke-site-member-access/${sitememberid}`);
      if(result.data.siteMember.siteMember === null){
        showMessage("error", `Error revoking site member!`, 2);
      }
      // console.log(result.data)
      const memberData = result?.data?.siteMember?.siteMember?.map((member, index) => {
        return { key: index+1, siteMemberId: member._id._id, siteMemberName: member._id.username, siteMemberEmail: member._id.email, siteMemberRole: member.roles, siteMemberAvatar: member._id.userAvatar }
      }) || []
      setTableData(memberData);
      // get user emails
      const allEmailData = await authAxios.get(`${userApi}/all`);
      const emails = allEmailData.data.reduce((acc, currUser) => {
        const isActive = currUser.status === "active"
        const isSiteMember = currUser.site === user.site;
        const isNotInSite = currUser.site === undefined;
        if (!isSiteMember && isActive && isNotInSite) {
          acc.push({
            value: currUser.email,
            label: currUser.email,
            avatar: currUser.userAvatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
            userId: currUser._id
          })
        }
        return acc;
      }, [])
      setInvitationEmails(emails);
      showMessage("success", `Revoke access 🔒 member ${name} successfully!`, 2);
      showNotification(`Member ${name} has been revoke access 🔒 from site ${site.siteName}`);
      setRefreshNoti(prev => !prev);
    } catch (error) {
      console.log(error)
    } finally{
      setRevokeAccessLoading(false);
    }
  };


  // Xử lý đổi vai trò
  const handleRoleChange = async (siteMemberId, oldRole, newRole, siteMemberEmail) => {
    try {
      setChangeRoleLoading(true);
      // console.log("role changed", siteMemberId, oldRole, newRole)
      if (oldRole.includes("siteOwner")) {
        message.warning("Cannot change site owner role", 2);
        return;
      }
      if (newRole.includes("siteOwner")) {
        message.warning("Cannot change role to site owner");
        return;
      }
      if (newRole.length === 0) {
        message.warning("Member must have at least 1 role", 2);
        return;
      }
      await authAxios.put(`${siteAPI}/${site._id}/change-site-member-roles`, {siteMemberId: siteMemberId, roles: newRole});
      message.success("Change site member role successfully");
      showNotification("Site",`Site member ${siteMemberEmail} role has been changed`);
      setRefreshNoti(prev => !prev);
      await fetchData();
    } catch (error) {
      console.log(error)
    } finally{
      setChangeRoleLoading(false)
    }
    
  };

  

  return (
    <div style={{ padding: "40px", textAlign: "left", backgroundColor: 'white', height: "calc(100vh - 90px)", width: "100%"}}>
      {/* hien thi message api */}
      {messageHolder}
      <ManageSiteMemberBreadCrump />
      {/* search and invite */}
      <SearchInviteOption searchTerm={searchTerm} setSearchTerm={setSearchTerm} setInviteModalVisible={setInviteModalVisible}/>
      {/* filter */}
      <ManageSiteMemberFilter site={site} formatRole={formatRole} setSelectedFilterRole={setSelectedFilterRole} />
      {/* Bảng danh sách thành viên */}
      <SiteMemberTable loading={changeRoleLoading} handleRoleChange={handleRoleChange} formatRole={formatRole} site={site} members={filteredMembers} handleRevokeAccess={handleRevokeAccess} revokeAccessLoading={revokeAccessLoading}/>
      {/* Modal mời thành viên */}
      <InviteMemberModal inviteModalVisible={inviteModalVisible} setInviteModalVisible={setInviteModalVisible} handleInviteMember={handleInviteMember} selectedEmail={selectedEmail} setSelectedEmail={setSelectedEmail} userEmails={invitaionEmails} inviteLoading={inviteLoading} />
    </div>
  );
};

export default ManageSiteMembers;
