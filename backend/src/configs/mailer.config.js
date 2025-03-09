const nodemailer = require("nodemailer")


// Cấu hình SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendEmail(type, email, link) {
    let subject;
    let text;

    if (type == "verify") {
        subject = "Verify your account";
        text = `Click this link to verify your account: ${link}`;
    } else if (type == "reset") {
        subject = "Change your password";
        emailBody = `
            <h2>Change Your Password</h2>
            <p>Click the button below to change your password:</p>
            <a href="${link}" 
               style="padding: 10px 20px; background: #1890ff; color: #fff; text-decoration: none; border-radius: 5px;">
                Change password
            </a>
            <p>If you didn't request this, please ignore this email.</p>
        `;
    } else if( type == "activate"){
        subject = "Activate Your Account";
        emailBody = `
                <h2>Confirm Your Account Activation</h2>
                <p>Click the button below to activate your account:</p>
                <a href="${link}"
                   style="padding: 10px 20px; background: #1890ff; color: #fff; text-decoration: none; border-radius: 5px;">
                    Confirm Activation
                </a>
            `;
    }
    else{
        throw new Error("Invalid email type");
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text,
        html: emailBody,
    };

    return transporter.sendMail(mailOptions);
}


// unfinished
const sendInvitation = async (receiverEmail, invitationId, siteName) => {
    const acceptUrl = `http://localhost:3000/processing-invitation?invitationId=${invitationId}&decision=accepted`;
    const declineUrl = `http://localhost:3000/processing-invitation?invitationId=${invitationId}&decision=declined`;
    const emailBody = `
                    
                    <p>You have been invited to site ${siteName}, click the button below to become it's member</p>
                    <a href="${acceptUrl}"
                       style="padding: 10px 20px; background: #1890ff; color: #fff; text-decoration: none; border-radius: 5px;">
                        Accept invitation
                    </a>
                    <p>Or click the button below to decline the invitation:</p>
                    <a href="${declineUrl}"
                       style="padding: 10px 20px; background:rgb(255, 24, 24); color: #fff; text-decoration: none; border-radius: 5px;">
                        Decline invitation
                    </a>
                `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: receiverEmail,
        subject: `You have been invited to site ${siteName}`,
        html: emailBody,
    };

    await transporter.sendMail(mailOptions);
}

const mailer = {
    sendEmail,
    sendInvitation,
}

module.exports = mailer;
