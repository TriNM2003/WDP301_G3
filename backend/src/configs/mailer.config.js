const nodemailer = require("nodemailer");

// Cấu hình SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Gửi email linh hoạt
 * @param {string} type - Loại email: "verify", "reset", "activate", "invitation", "notification"
 * @param {string} email - Email người nhận
 * @param {object} additionalData - Dữ liệu bổ sung như { link, siteName, message, invitationId }
 */
async function sendEmail(type, emailAddress, additionalData = {}) {
    let subject;
    let emailBody;

    switch (type) {
        case "verify":
            subject = "[Skrumio] Verify Your Account";
            emailBody = generateEmailTemplate("Click the button below to verify your account:", additionalData.link, "Verify Account");
            break;
        case "reset":
            subject = "[Skrumio] Reset Your Password";
            emailBody = generateEmailTemplate("Click the button below to reset your password:", additionalData.link, "Reset Password");
            break;
        case "activate":
            subject = "[Skrumio] Activate Your Account";
            emailBody = generateEmailTemplate("Click the button below to activate your account:", additionalData.link, "Activate Account");
            break;
        case "invitation":
            subject = `[Skrumio] You have been invited to site ${additionalData.siteName}`;
            emailBody = `
                <p>You have been invited to site <strong>${additionalData.siteName}</strong>. Click the button below to become a member:</p>
                ${generateEmailTemplate("", `http://localhost:3000/processing-invitation?invitationId=${additionalData.invitationId}&decision=accepted`, "Accept Invitation")}
                <p>Or click the button below to decline the invitation:</p>
                ${generateEmailTemplate("", `http://localhost:3000/processing-invitation?invitationId=${additionalData.invitationId}&decision=declined`, "Decline Invitation", "rgb(255, 24, 24)")}
            `;
            break;
        case "deactivate":
            subject = `[Skrumio] Confirm deactivate site`;
            emailBody = `
                    <h2>Are you sure you want to deactivate site ${site.siteName}?</h2>
                    ${generateEmailTemplate("Click the link below to confirm deactivation:", additionalData.link, "Confirm deactivate")}
                `;
            break;
        case "notification":
            subject = "[Skrumio] You have new updates";
            emailBody = `<p>${additionalData.message || "You have a new notification from the system."}</p>`;
            break;
        default:
            throw new Error("Invalid email type");
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: emailAddress,
        subject: subject,
        html: emailBody,
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Hàm tạo template HTML cho email
 * @param {string} message - Nội dung tin nhắn
 * @param {string} link - Link liên kết
 * @param {string} buttonText - Nội dung nút bấm
 * @param {string} buttonColor - Màu của nút bấm (mặc định xanh)
 * @returns {string} - Nội dung email dạng HTML
 */
function generateEmailTemplate(message, link, buttonText, buttonColor = "#1890ff") {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <p>${message}</p>
            <a href="${link}" style="display: inline-block; padding: 10px 20px; background: ${buttonColor}; color: #fff; text-decoration: none; border-radius: 5px;">
                ${buttonText}
            </a>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;
}

// Export module
module.exports = { sendEmail };
