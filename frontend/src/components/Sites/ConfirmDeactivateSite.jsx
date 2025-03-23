import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { AppContext } from '../../context/AppContext';
import axios from "axios";

const ConfirmDeactivateSite = () => {
    const navigate = useNavigate();
    const { showNotification, siteAPI, site, accessToken, setSite } = useContext(AppContext); // ✅ Cập nhật site
    const [isDeactivating, setIsDeactivating] = useState(false);

    useEffect(() => {
        if (site?._id && accessToken) {
            deactivateSite(site._id);
        }
    }, [site?._id, accessToken]); // 🔹 Gọi khi `site._id` có dữ liệu

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

            message.success(response.data.message);
            showNotification(response.data.message, `Your site - ${site?.siteName} has been deactivated`);

            // ✅ Cập nhật site mới từ database sau khi deactivate
            fetchUpdatedSiteData();

            // ✅ Điều hướng về home
            setTimeout(() => {
                setIsDeactivating(false);
                navigate("/home");
            }, 1500);

        } catch (error) {
            console.error("Error deactivating site:", error);
            message.error(error.response?.data?.message);
            showNotification(error.response?.data?.message, `Error deactivating site - ${site?.siteName}`);
            setIsDeactivating(false);
        }
    };

    // 🔹 Hàm Fetch lại Site từ Database sau khi Deactivate
    const fetchUpdatedSiteData = async () => {
        try {
            const response = await axios.get(`${siteAPI}/${site._id}/get-by-id`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (response.data) {
                setSite(response.data); // ✅ Cập nhật site mới vào state
            } else {
                setSite(null); // ✅ Nếu không có site nào, set null
            }
        } catch (error) {
            console.error("Error fetching updated site:", error);
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