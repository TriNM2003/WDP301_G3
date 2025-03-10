import { useContext, useEffect, useState } from "react";
import {
  Breadcrumb,
  message,
} from "antd";
import InvitationTable from "./InvitationTable";
import InvitationSearchFilter from "./InvitationSearchFilter";
import authAxios from "../../../utils/authAxios";
import {AppContext} from "../../../context/AppContext";

const formatDate = (mongoDate) => {
  if (!mongoDate) return "";

  const date = new Date(mongoDate);
  return date.toLocaleDateString("vi-VN"); // "dd/mm/yyyy"
};


const ManageInvitations = () => {
  const {site, setSite, siteAPI, showNotification, showMessage, messageHolder} = useContext(AppContext);
  const [invitationList, setInvitationList] = useState([
    { key: "1", email: "invite1@example.com", status: "pending" },
    { key: "2", email: "invite2@example.com", status: "accept" },
    { key: "3", email: "invite3@example.com", status: "decline" },
  ]);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState(null);
  const messageApi = message.useMessage()[0];

  useEffect(() => {
    fetchInvitation();
  }, [site])

  const fetchInvitation = async () => {
    try {
      const invitationsRaw = await authAxios.get(`${siteAPI}/${site._id || "notfound"}/get-invitations-by-site`);
      const formattedInvitation = invitationsRaw.data.invitations.map((invitation, index) => {
        const isExpired = compareDates(invitation.createdAt, invitation.expireAt);
        return {
          key: index+1, invitationId:invitation._id,  receiver: invitation.receiver.email, receiverAvatar:invitation.receiver.userAvatar, createDate:formatDate(invitation.createdAt), lastUpdated: formatDate(invitation.updatedAt), expireDate: formatDate(invitation.expireAt),  status: isExpired ? "expired" : invitation.status
        }
      })
      setInvitationList(formattedInvitation);
      console.log(formattedInvitation)
    } catch (error) {
      console.log(error)
    }
  }

  const compareDates = (createDate, expireDate) => {
    if (!createDate || !expireDate) return false; // Nếu thiếu dữ liệu, trả về false

    const start = new Date(createDate).setHours(0, 0, 0, 0); // Chuẩn hóa ngày, bỏ giờ
    const end = new Date(expireDate).setHours(0, 0, 0, 0); // Chuẩn hóa ngày, bỏ giờ

    return end < start; // Nếu expireDate < createDate → Trả về true (expireDate đã quá hạn)
};

  const handleCancelInvitation = async (invitationId) => {
    console.log(invitationId)
    const response = await authAxios.delete(`${siteAPI}/${site._id}/cancel-invitation`, {data: {invitationId: invitationId}});
    const formattedInvitation = response.data.invitations.map((invitation, index) => {
      return {
        key: index+1, invitationId:invitation._id,  receiver: invitation.receiver.email, receiverAvatar:invitation.receiver.userAvatar, createDate:formatDate(invitation.createdAt), lastUpdated: formatDate(invitation.updatedAt), expireDate: formatDate(invitation.expireAt),  status: invitation.status
      }
    })
    setInvitationList(formattedInvitation);
    showMessage("success", "Invitation cancel successfully!", 2);
  };

  const filteredInvitations = invitationList.filter((invite) =>
    invite?.receiver?.toLowerCase().includes(searchEmail?.toLowerCase()) &&
    (filterStatus === "all" || !filterStatus || invite.status === filterStatus)
);


  return (
    <div style={{ padding: "40px", backgroundColor: "white" }}>
      {messageHolder}
      <Breadcrumb style={{ marginBottom: "20px" }}>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/site">Site</Breadcrumb.Item>
        <Breadcrumb.Item>Manage Invitations</Breadcrumb.Item>
      </Breadcrumb>
      <InvitationSearchFilter searchEmail={searchEmail} setSearchEmail={setSearchEmail} setFilterStatus={setFilterStatus} />
      <InvitationTable handleCancelInvitation={handleCancelInvitation} filteredInvitations={filteredInvitations} />
    </div>
  );
};

export default ManageInvitations;
