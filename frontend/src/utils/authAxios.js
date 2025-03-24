import axios from 'axios';

const authAxios = axios.create();

// mac dinh timeout la 10 phut
authAxios.defaults.timeout = 1000*60*10;


const getRefreshToken = async () => {
    try {
        // lay user id
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.log(`User id not found`);
            return null;
        }
        // lay refresh token
        const refreshToken = await axios.post("http://localhost:9999/auth/getRefreshToken", { id: userId });

        if (!refreshToken) {
            console.log(`Refresh token with user id: ${userId} not found`);
            return null;
        }

        return {
            refreshToken: refreshToken.data,
            userId: userId
        };
    } catch (error) {
        console.log(error)
    }
    
}

const getNewAccessToken = async ({refreshToken, userId}) => {
    try {
        // lay access token sau khi refresh va dat vao localStorage roi gui request
        const result = await axios.post("http://localhost:9999/auth/refresh", {
            refreshToken: refreshToken,
            id: userId
        });
        return result.data;
    } catch (error) {
        console.log(error)
    }
}


// Interceptor cho request: Kiểm tra và làm mới access token nếu cần
authAxios.interceptors.request.use(async (config) => {
    let accessToken = localStorage.getItem("accessToken");
    let accessTokenExp = localStorage.getItem("accessTokenExp");
    let refreshTokenData, newAccessToken;

    // Kiểm tra access token còn hạn không
    const isExpired = Math.floor(Date.now() / 1000) > Number(accessTokenExp);

    if (!accessToken || isExpired) {
        console.log("Access token is expired. Refreshing...");

        // Lấy refresh token
        refreshTokenData = await getRefreshToken();
        console.log("ref token data: ", refreshTokenData);

        if (!refreshTokenData || !refreshTokenData.refreshToken) {
            return Promise.reject({
                isAuthError: true,
                message: "User refresh token does not exist!"
              });
        }

        // Yêu cầu access token mới
        newAccessToken = await getNewAccessToken(refreshTokenData);

        if (!newAccessToken || !newAccessToken.accessToken) {
            return Promise.reject({
                isAuthError: true,
                message: "Error getting new access token!"
              });
        }

        // Lưu token mới vào localStorage
        localStorage.setItem("accessToken", newAccessToken.accessToken);
        localStorage.setItem("accessTokenExp",Math.floor(Date.now() / 1000) + newAccessToken.accessTokenExp);

        accessToken = newAccessToken.accessToken;
    }

    // Thêm Authorization header
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
}, (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
});



// xu ly response nhan dc tu backend
authAxios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.isAuthError) {
        console.log("Reject request: ", error.message)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessTokenExp");
        localStorage.removeItem("userId");
        window.location.href = "http://localhost:3000/auth/login";
    }
    return Promise.reject(error);
});

export default authAxios;