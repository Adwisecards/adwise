import axiosInstance from "../agent/agent";
import apiUrls from "../constants/apiUrls";

const getMediaId = async (file, type = 'image') => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('data', file);

    return await axiosInstance.post(apiUrls["media-create"], formData).then((res) => {
        return res.data.data.mediaId
    }).catch((err) => {
        return null
    })
}
const getUrlMedia = (id) => {
    return `${process.env.REACT_APP_PRODUCTION_HOST_API}${apiUrls['media-get']}/${id}`
}
const getMediaFile = async (id) => {
    const fileLink = getUrlMedia(id);
    const file = await fetch(fileLink);
    const fileBlob = await file.blob();

    return new File([fileBlob], 'file');
}


export {
    getMediaId,
    getUrlMedia,
    getMediaFile
}
