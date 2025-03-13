import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { AppContext } from '../../context/AppContext';
import axios from "axios";

const ConfirmDeactivateSite = () => {
    const navigate = useNavigate();
    const { showNotification, siteAPI, site, accessToken } = useContext(AppContext);
    const [isDeactivating, setIsDeactivating] = useState(false);

    useEffect(() => {
        if (site._id && accessToken) {
            deactivateSite(site._id);
        }
    }, [site._id, accessToken]); // 🔹 Gọi khi `site._id` có dữ liệu

    const deactivateSite = async (siteId) => {
        if (!accessToken) {
            message.error("You need to log in to deactivate the site.");
            navigate("/auth/login");
            return;
        }

        setIsDeactivating(true);
        try {
            const response = await axios.put(
                `${siteAPI}/${siteId}/deactivate`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            message.success(response.data.message || "Site deactivated successfully!");
            showNotification(response.data.message || "Site deactivated successfully!", "success");

            setTimeout(() => {
                setIsDeactivating(false);
                navigate("/home");
            }, 1500);

        } catch (error) {
            console.error("Error deactivating site:", error);
            message.error(error.response?.data?.message || "Failed to deactivate site.");
            showNotification(error.response?.data?.message || "Failed to deactivate site.", "error");
            setIsDeactivating(false);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {isDeactivating ? <Spin size="large" /> : <p>Site has been deactivated. Redirecting...</p>}
            <p>Processing your request...</p>
        </div>
    );
};

export default ConfirmDeactivateSite;