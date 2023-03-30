let nodeEnv = process.env.NODE_ENV;
let nodeEnv_BaseURL = process.env.REACT_APP_CLOUD_FUNCTIONS_BASE_URL;

let _BaseURL_PROD = "https://us-central1-antqueuelive.cloudfunctions.net/";
let _BaseURL_DEV1 = "http://localhost:5001/antqueuelive/us-central1/";
let _BaseURL_DEV2 = "https://us-central1-antqueuetest-ce4e9.cloudfunctions.net/";
let _BaseURL_DEV3 = "http://localhost:5001/antqueuetest-ce4e9/us-central1/";

const config = {
    env: "production",
    baseURL: _BaseURL_PROD,
    // baseURL: _BaseURL_DEV1,
    // baseURL: nodeEnv === "production" ? nodeEnv_BaseURL : nodeEnv_BaseURL.replace("antqueuetest-ce4e9", "antqueuelive"),
    apiKey: "AIzaSyDLC0kopf1rYN8OaVXitspRC_xp-mzM3hQ",
    authDomain: "antqueuelive.firebaseapp.com",
    databaseURL: "https://antqueuelive.firebaseio.com",
    projectId: "antqueuelive",
    storageBucket: "antqueuelive.appspot.com",
    messagingSenderId: "265569781100",
    appId: "1:265569781100:web:2cfa2afd1854cf43",
    stripePublishKey:
        "pk_live_51H43cBAI3IyfQO1oe6FAPzCNO5WBpxgIYEs4xvxI8jTVjsYX2bEWiztJ7rYwm9yjX90nM2zAGCUMl9ydIsx9VCVr00AEb5r8J2",
};

// const config = {
//     env: "development",
//     baseURL: _BaseURL_DEV2,
//     // baseURL:_BaseURL_DEV3,
//     apiKey: "AIzaSyB7OKvbx-NWQcM70T4dEnoTDt3aAeEkJ2A",
//     authDomain: "antqueuetest-ce4e9.firebaseapp.com",
//     databaseURL: "https://antqueuetest-ce4e9.firebaseio.com",
//     projectId: "antqueuetest-ce4e9",
//     storageBucket: "antqueuetest-ce4e9.appspot.com",
//     messagingSenderId: "341478783416",
//     appId: "1:341478783416:web:37313bb2057c0a99",
//     // measurementId: "G-SG477HKZB3",
//     stripePublishKey: "pk_test_51Irml9DpmEfhoHkUYVkVigRts5ubkUQBTbqWOc2RyYtH4pSIQLpIdYLg9lbqASdJFsaWuiMrGK1wy7tbUZ9FkU3d000uso6yMu"
// }

export default config;
