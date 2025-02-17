import axios from 'axios';

const authAxios = axios.create();

// mac dinh timeout la 10 phut
authAxios.defaults.timeout = 1000*60*10;


const getNewAccessToken = async () => {
    // lay user id
    const userId = localStorage.getItem("userId");
    // lay refresh token
    const refreshToken = await axios.post("http://localhost:9999/auth/getRefreshToken", {id: userId});

    if(!refreshToken){
        console.log(`Refresh token with user id: ${userId} not found`);
    }

    // lay access token sau khi refresh va dat vao localStorage roi gui request
    const result = await axios.post("http://localhost:9999/auth/refresh", {
     refreshToken: refreshToken.data,
     id: userId
    });


    if(result.status === 200){
        return result.data;
        // localStorage.setItem("accessToken", result.data.accessToken);
        // console.log(result.data);
        // confirm.headers.authorization = `Bearer ${result.data.accessToken}`;
    }else{
        console.log("Error refreshing token:", result.response.data.message);
        return null
    }
}

// dieu kien truoc khi gui request
authAxios.interceptors.request.use(async(confirm) => {
    //check accesss token truoc khi gui request
    const accessToken = localStorage.getItem("accessToken");
    const accessTokenExp = localStorage.getItem("accessTokenExp");
    let result;
    if (accessToken) {
        // check token expiration
        const isExpired = Math.floor(Date.now() / 1000) > Number(accessTokenExp);
        // const isExpired = Date.now() *1000 > localStorage.getItem("accessTokenExp");
        if(isExpired){
            console.log("Access token is expired. Getting new access token...");
            result = await getNewAccessToken();
            if(!result){
                console.log("Error getting new access token");
                return Promise.reject("Error getting new access token");
            }else{
                localStorage.setItem("accessToken", result.accessToken);
                localStorage.setItem("accessTokenExp", Math.floor(Date.now() / 1000) + result.accessTokenExp);
                confirm.headers.authorization = `Bearer ${result.accessToken}`;
            }
            
        }else{
            confirm.headers.authorization = `Bearer ${accessToken}`;
        }
    }else{
        result = await getNewAccessToken();
        if(!result){
            console.log("Error getting new access token");
            return Promise.reject("Error getting new access token");
        }else{
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("accessTokenExp", Math.floor(Date.now() / 1000) + result.accessTokenExp);
            confirm.headers.authorization = `Bearer ${result.accessToken}`;
        }
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
