

export async function postMedia(files)
{
    const cloudName = process.env.CLOUD_NAME
    const cloudPreset = process.env.CLOUD_UPLOAD_PRESENT
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", `${cloudPreset}`);
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
    const mediaResponse = await fetch(url, {
      method: "POST",
      body: formData,
    })
    const mediaData = await mediaResponse.json();
    return mediaData
}