import axios from "../plugins/axios";
import urls from "../constants/urls";

const getMediaId = async (file, type = 'image') => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('data', file);

    return await axios('post', urls["media-create"], formData).then((res) => {
        return res.data.data.mediaId
    }).catch((err) => {
        return null
    })
}
const getMediaUrl = (id) => {
    if (!id) {
        return ""
    }

    return `${urls['prod-host']}${urls['media-get']}/${id}`
}
const getMediaFile = async (id) => {
    const fileLink = getMediaUrl(id);
    const file = await fetch(fileLink);
    const fileBlob = await file.blob();

    return new File([fileBlob], 'file');
}


export {
    getMediaId,
    getMediaUrl,
    getMediaFile
}
