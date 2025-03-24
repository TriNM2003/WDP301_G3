import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Spin, Result, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { AppContext } from "../../context/AppContext";
import authAxios from "../../utils/authAxios";

const ProcessingInvitation = () => {
    const hasRun = useRef(false);
    const { accessToken, siteAPI, setRefreshNoti} = useContext(AppContext);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const invitationId = queryParams.get("invitationId");
    const decision = queryParams.get("decision");

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (hasRun.current) return; // Ngăn chạy lại lần 2
        hasRun.current = true;

        if (!invitationId || !decision) {
            setErrorMessage("No invitation found!");
            setStatus("failed");
            setLoading(false);
            return;
        }

        if (!["accepted", "declined"].includes(decision)) {
            setErrorMessage("No decision found!");
            setStatus("failed");
            setLoading(false);
            return;
        }

        processInvitation();
    }, []); // Chỉ chạy một lần khi component mount

    async function processInvitation(){
        try {
            const response = await authAxios.post(`${siteAPI}/processing-invitation`, {
                invitationId: invitationId,
                decision: decision
            });

            setStatus(response.data.decision); // accepted hoặc declined
            message.success(`Invitation ${decision} successfully!`, 2)

            setRefreshNoti(prev => !prev);

            // Chỉ điều hướng sau khi UI đã cập nhật
            setTimeout(() => {
                navigate("/processing-invitation", { replace: true });
            }, 1000);
        } catch (error) {
            setStatus("failed");
            const errorMsg = error.response?.data?.message || "Unknown error occurred";
            message.error("Error: " + errorMsg, 2)
            setErrorMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px", height: "calc(100vh - 120px)" }}>
                <LoadingOutlined style={{ fontSize: "4rem" }} />
                <h3>Processing invitation...</h3>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center", marginTop: "50px", height: "calc(100vh - 120px)" }}>
            {status === "accepted" && accessToken && (
                <Result
                    status="success"
                    title="Invitation accepted!"
                    subTitle="You have successfully joined the site."
                    extra={[
                        <Button type="primary" key="site" onClick={() => navigate("/site")}>
                            Go to Site
                        </Button>,
                    ]}
                />
            )}
            {status === "accepted" && !accessToken && (
                <Result
                    status="success"
                    title="Invitation accepted!"
                    subTitle="You have successfully joined the site. Please login to view the site"
                    extra={[
                        <Button type="primary" key="site" onClick={() => navigate("/auth/login")}>
                            Login
                        </Button>,
                    ]}
                />
            )}
            {status === "declined" && (
                <Result
                    status="info"
                    title="Invitation declined"
                    subTitle="You have declined the invitation."
                    extra={[
                        <Button type="default" key="home" onClick={() => navigate("/home")}>
                            Back to Home
                        </Button>,
                    ]}
                />
            )}
            {status === "failed" && (
                <Result
                    status="error"
                    title="Invitation invalid"
                    subTitle={errorMessage == "Refresh token not found!" ? "Please login before processing request" : errorMessage}
                    extra={[
                        <Button type="default" key="home" onClick={() => navigate("/home")}>
                            Back to Home
                        </Button>,
                    ]}
                />
            )}
        </div>
    );
};

export default ProcessingInvitation;
