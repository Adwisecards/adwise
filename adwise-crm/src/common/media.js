import axiosInstance from "../agent/agent";
import apiUrls from "../constants/urls";

const getMediaId = async (file, type = 'image') => {
    if (!file) {
        return ""
    }

    const formData = new FormData();
    formData.append('type', type);
    formData.append('data', file);

    return await axiosInstance.post(apiUrls["media-create"], formData).then((res) => {
        return res.data.data.mediaId
    }).catch((err) => {
        return null
    })
}
const getMediaUrl = (id, urlEmpty = "") => {
    if (!id) {
        return urlEmpty
    }

    return `${process.env.REACT_APP_PRODUCTION_HOST_API}${apiUrls['media-get']}/${id}`
}
const getMediaFile = async (id, type) => {
    const fileLink = getMediaUrl(id);
    const file = await fetch(fileLink);
    const fileBlob = await file.blob();

    return new File([fileBlob], 'file', {
        type: type || "image/png",
    });
}

const fileOctetStreamToPng = async (file) => {
    // file.type = 'image/jpg';

    return file;
}


export {
    getMediaId,
    getMediaUrl,
    getMediaFile,
    fileOctetStreamToPng
}
