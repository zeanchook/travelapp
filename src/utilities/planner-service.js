import sendRequest from "./send-request"

export const createPlanner = async(item) =>
{
    console.log(item)
    // const query = encodeURIComponent(item)
    const url = `/api/planner/create`
    const response = await sendRequest(url,"POST",item)
    return response;         
}

export const getPlanner = async() =>
{
    const url = `/api/planner/get`
    const response = await sendRequest(url,"GET")
    return response;         
}