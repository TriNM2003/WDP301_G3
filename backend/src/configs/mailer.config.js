const nodemailer = require("nodemailer")


// Cấu hình SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const sendInvitations = async () => {
    // const acceptUrl = `http://localhost:3000/site/${siteId}/processing-invitations?isAccept=true&siteId=${siteId}`;
    // const declineUrl = `http://localhost:3000/site/${siteId}/processing-invitations?isAccept=false&siteId=${siteId}`;
    const emailBody = `
                    
                    <p>Click the button below to be a site member:</p>
                    <a href="#"
                       style="padding: 10px 20px; background: #1890ff; color: #fff; text-decoration: none; border-radius: 5px;">
                        Accept invitation
                    </a>
                    <p>Or click the button below to decline the invitation:</p>
                    <a href="#"
                       style="padding: 10px 20px; background:rgb(255, 24, 24); color: #fff; text-decoration: none; border-radius: 5px;">
                        Decline invitation
                    </a>
                `;
    // Gửi đến tất cả người nhận cùng lúc
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: receivers.join(","), // Chuyển mảng email thành chuỗi
        subject: `You have been invited to site`,
        html: emailBody,
    };

    await transporter.sendMail(mailOptions);
}

const mailer = {
    sendInvitations,
}

module.exports = mailer;
