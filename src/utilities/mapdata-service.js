import sendRequest from "./send-request"

export const getMapData = async() =>
{

    const url = `/api/map/getJSON`
    const response = await sendRequest(url)
    // console.log(response)
    return response;         
}
