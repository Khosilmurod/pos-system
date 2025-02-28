import axios from 'axios';
import {PATH_PREFIX, Authorization} from "./path_controller";
import React, {Component} from 'react';
import {toast, ToastContainer} from "react-toastify";

export function beforeUpload(file) {
    const isJPG = file.type == "image/jpeg";
    const isPNG = file.type == "image/png";
    return !isJPG && !isPNG;
}
export async function customRequest (options) {
    const datas = new FormData();
    datas.append("attachment", options.file);
    const {data}= await axios({
        url: PATH_PREFIX + "/api/file/save",
        method: "post",
        data: datas,
        headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
            "X-Requested-With": "XMLHttpRequest"
        }
    });
    return data;
}