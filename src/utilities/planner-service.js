import sendRequest from "./send-request"

export const createPlanner = async(item) =>
{
    const url = `/api/planner/create`
    const response = await sendRequest(url,"POST",item)
    return response;         
}

export const getPlanner = async(item) =>
{
    const url = `/api/planner/get`
    const response = await sendRequest(url,"PATCH",item)
    return response;         
}

export const getDetailPlanner = async(item) =>
{
    const url = `/api/planner/getDetails/${item}`
    const response = await sendRequest(url,"GET")
    return response;         
}

export const getEachDetailPlanner = async(item) =>
{
    const url = `/api/planner/getEachDetails/${item}`
    const response = await sendRequest(url,"GET")
    return response;         
}

export const addLocationItem = async(planneritemsid,body) =>
{
    console.log(planneritemsid,body)
    const url = `/api/planner/add/${planneritemsid}/itinerary`
    const response = await sendRequest(url,"POST",body)
    return response;         
}

export const patchOrderLocation = async(body) =>
{
    console.log(body)
    const url = `/api/planner/update/order`
    const response = await sendRequest(url,"PATCH",body)
    return response;         
}

export const patchItinneraryItem = async(body) =>
{
    console.log(body);
    const url = `/api/planner/update/itinerary`
    const response = await sendRequest(url,"PATCH",body)
    return response;         
}

export const deletePlanner = async(id) =>
{
    const url = `/api/planner/delete/planner/${id}`
    const response = await sendRequest(url,"DELETE")
    return response; 
}

export const patchPlannerStatus = async(id,body) =>
{
    const url = `/api/planner/update/planner/${id}`
    const response = await sendRequest(url,"PATCH",body)
    return response; 
}

export const getUserStats = async(item) =>
{
    const url = `/api/planner/getUserStats`
    const response = await sendRequest(url,"PATCH",item)
    return response; 
}

export const getStats = async() =>
{
    const url = `/api/planner/getStats`
    const response = await sendRequest(url,"GET")
    return response; 
}

export const deleteItineraryItem = async(id) =>
{
    const url = `/api/planner/delete/itineraryitems/${id}`
    const response = await sendRequest(url,"DELETE")
    return response; 
}