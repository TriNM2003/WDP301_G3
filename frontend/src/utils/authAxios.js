import axios from 'axios';

const authAxios = axios.create();

// mac dinh timeout la 10 phut
authAxios.defaults.timeout = 1000*60*10;

// dieu kien truoc khi gui request
authAxios.interceptors.request.use(async (confirm) => {
    //check accesss token truoc khi gui request
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        confirm.headers.authorization = `Bearer ${accessToken}`;
    }else{
        // lay user id
        const userId = localStorage.getItem("userId");
        // lay refresh token
        const refreshToken = await axios.post("http://localhost:9999/auth/getRefreshToken", {id: userId});

        // lay access token sau khi refresh va dat vao localStorage roi gui request
        await axios.post("http://localhost:9999/auth/refresh", {
         // refresh token
         refreshToken
        }).then((res) => {
            if (res.status === 200) {
                localStorage.setItem("accessToken", res.data.accessToken);
                confirm.headers.authorization = `Bearer ${res.data.accessToken}`;
            }
        }).catch((error) => {
            console.log("Error refreshing token:", error);
        });
    }
    return confirm;
}, (error) => {
    console.log("Error request:", error);
    return Promise.reject(error);
});


// xu ly response nhan dc tu backend
authAxios.interceptors.response.use((response) => {
    return response;
}, (error) => {
    console.log("Error response:", error.response);
    return Promise.reject(error);
});

export default authAxios;
