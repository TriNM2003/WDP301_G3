import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { message, Spin } from "antd";
import { AppContext } from '../../context/AppContext';
import axios from "axios";

const ConfirmDelete = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(AppContext);
    const [isDeleted, setIsDeleted] = useState(false);
    const hasFetched = useRef(false); // Ngăn gọi API nhiều lần

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            message.error("You need to log in to confirm account deletion.");
            navigate("/auth/login");
            return;
        }

        if (!hasFetched.current) { // Kiểm tra nếu chưa gọi API thì mới gọi
            hasFetched.current = true; // Đánh dấu đã gọi API

            axios.delete("http://localhost:9999/users/confirm-delete", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    if (!isDeleted) {
                        setIsDeleted(true); // Đánh dấu đã xóa
                        message.success(response.data.message, 2);
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("accessTokenExp");
                        localStorage.removeItem("userId");
                        setUser({});
                        setTimeout(() => navigate("/auth/login"), 1000);
                    }
                })
                .catch(error => {
                    if (!isDeleted) {
                        message.error(error.response?.data?.message);
                        setTimeout(() => navigate("/auth/login"), 1000);
                    }
                });
        }
    }, [navigate, isDeleted, setUser]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Spin size="large" />
            <p>Processing your request...</p>
        </div>
    );
};

export default ConfirmDelete;