import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { AppContext } from '../../context/AppContext';
import axios from "axios";

const ConfirmDelete = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(AppContext);
    const [isDeleting, setIsDeleting] = useState(false);
    const hasFetched = useRef(false); // Ngăn gọi API nhiều lần

    useEffect(() => {
        // Kiểm tra nếu đã trên trang Confirm Delete
        if (window.location.pathname !== "/profile/confirm-delete") {
            window.location.href = "http://localhost:3000/profile/confirm-delete";
            return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
            message.error("You need to log in to confirm account deletion.");
            navigate("/auth/login");
            return;
        }

        if (!hasFetched.current) { // Kiểm tra nếu chưa gọi API thì mới gọi
            hasFetched.current = true; // Đánh dấu đã gọi API
            setIsDeleting(true);

            axios.delete("http://localhost:9999/users/confirm-delete", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    message.success(response.data.message, 2);
                    setTimeout(() => {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("accessTokenExp");
                        localStorage.removeItem("lastVisitedUrl");
                        localStorage.removeItem("userId");
                        setUser({});
                        navigate("/auth/login");
                    }, 1500);
                })
                .catch(error => {
                    message.error(error.response?.data?.message);
                    setTimeout(() => navigate("/auth/login"), 1500);
                })
                .finally(() => setIsDeleting(false));
        }
    }, [navigate, setUser]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {isDeleting ? <Spin size="large" /> : <p>Redirecting...</p>}
            <p>Processing your request...</p>
        </div>
    );
};

export default ConfirmDelete;