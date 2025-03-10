import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import authAxios from "../../../utils/authAxios";
import ManageSiteMemberBreadCrump from "./ManageSiteMemberBreadCrump";
import SiteMemberTable from "./SiteMemberTable";
import ManageSiteMemberFilter from "./ManageSiteMemberFilter";
import InviteMemberModal from "./InviteMemberModal";
import SearchInviteOption from "./SearchInviteOption";


const formatRole = (memberRole) => {
  let role;
      if(memberRole === "siteOwner" || memberRole === "Owner"){
        role = "Site Owner"
      }else if(memberRole === "siteMember" || memberRole === "Member"){
        role = "Site Member"
      }else{
        role = "Undefined?"
      }
  return role;
}

const ManageSiteMembers = () => {
  const {user, site, setSite, siteAPI, userApi, showNotification, showMessage, messageHolder} = useContext(AppContext);

  const [tableData, setTableData] = useState([]);
  const [invitaionEmails, setInvitationEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterRole, setSelectedFilterRole] = useState(null);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState();


useEffect(() => {
  console.clear();
  fetchData();
},[site])

const fetchData = async () => {
  try {
  const siteMemberData = await authAxios.get(`${siteAPI}/${site?._id}/get-site-members`);
  const memberData = siteMemberData.data.map((member, index) => {
    return { key: index+1, siteMemberId: member._id._id, siteMemberName: member._id.username, siteMemberEmail: member._id.email, siteMemberRole: member.roles[0], siteMemberAvatar: member._id.userAvatar }
  })
  setTableData(memberData)

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
  } catch (error) {
    console.log(error)
  }
 }

  const handleInviteMember = async () => {
    try {
      const invitedUserId = invitaionEmails.find(item => item.value === selectedEmail).userId;
    console.log(selectedEmail)
    await authAxios.post(`${siteAPI}/${site._id}/invite-member`, {receiverId: invitedUserId})
    showMessage("success", `Send invitation to ${selectedEmail.toString()} successfully !`, 2)
    showNotification(`👋 Invitation have been sent to ${selectedEmail.toString()} ✉`);
    setSelectedEmail();
    setInviteModalVisible(false);
    await fetchData();
    } catch (error) {
      console.log(error)
    }
    
  }

  // Xử lý tìm kiếm
  let filteredMembers = tableData;
  if(selectedFilterRole !== "All"){
    filteredMembers = tableData.filter(
        (member) =>
          member.siteMemberName?.toLowerCase().includes(searchTerm?.toLowerCase()) &&
          (!selectedFilterRole || member.siteMemberRole === selectedFilterRole)
      );
  }else{
    filteredMembers = tableData.filter(
      (member) =>
        member.siteMemberName?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }


  // Xử lý xóa thành viên bằng Popconfirm
  const handleRevokeAccess = async (name, sitememberid) => {
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
      return { key: index+1, siteMemberId: member._id._id, siteMemberName: member._id.username, siteMemberEmail: member._id.email, siteMemberRole: member.roles[0], siteMemberAvatar: member._id.userAvatar }
    }) || []
    setTableData(memberData);
    setInvitationEmails(invitaionEmails.filter(item => item.userId !== sitememberid) || invitaionEmails);
    showMessage("success", `Revoke access 🔒 member ${name} successfully!`, 2);
    showNotification(`Member ${name} has been revoke access 🔒 from site ${site.siteName}`);
  };


  // Xử lý đổi vai trò
  const handleRoleChange = (siteMemberId, oldRole, newRole) => {
    console.log("role changed", siteMemberId, oldRole, newRole)
    // setSiteMembers(siteMembers.map((member) => (member.key === key ? { ...member, siteMemberRole: formatRole(newRole) } : member)));
  };

  

  return (
    <div style={{ padding: "40px", textAlign: "left", backgroundColor: 'white', height: "calc(100vh - 90px)", width: "100%"}}>
      {/* hien thi message api */}
      {messageHolder}
      <ManageSiteMemberBreadCrump />
      {/* search and invite */}
      <SearchInviteOption searchTerm={searchTerm} setSearchTerm={setSearchTerm} setInviteModalVisible={setInviteModalVisible} />
      {/* filter */}
      <ManageSiteMemberFilter site={site} formatRole={formatRole} setSelectedFilterRole={setSelectedFilterRole} />
      {/* Bảng danh sách thành viên */}
      <SiteMemberTable handleRoleChange={handleRoleChange} formatRole={formatRole} site={site} members={filteredMembers} handleRevokeAccess={handleRevokeAccess}/>
      {/* Modal mời thành viên */}
      <InviteMemberModal inviteModalVisible={inviteModalVisible} setInviteModalVisible={setInviteModalVisible} handleInviteMember={handleInviteMember} selectedEmail={selectedEmail} setSelectedEmail={setSelectedEmail} userEmails={invitaionEmails} />
    </div>
  );
};

export default ManageSiteMembers;
