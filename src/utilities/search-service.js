// import { urlencoded } from "express"
import sendRequest from "./send-request"

export const searchPlaces = async(item) =>
{
    const query = encodeURIComponent(item)
    const url = `/api/searchmap/getResult/${query}`
    const response = await sendRequest(url)
    return response;         
}

export const searchDetail = async(item) =>
{
    const query = encodeURIComponent(item)
    const url = `/api/searchmap/getDetailResult/${query}`
    const response = await sendRequest(url)
    return response;         
}

export const searchVeryDetail = async(item) =>
{
    const query = encodeURIComponent(item)
    const url = `/api/searchmap/getVeryDetailResult/${query}`
    const response = await sendRequest(url)
    return response;         
}

// https://maps.googleapis.com/maps/api/place/autocomplete/json?input=c&key=AIzaSyBX7rQJzbDPH7BbvmsihiXmrFFLyoeJFCs

// https://api.locationiq.com/v1/autocomplete?key=pk.c9766614c64017cb84d3952132452df0&q=kbmall&limit=5&dedupe=1&
// https://api.locationiq.com/v1/autocomplete?key=${key}&q=kb%20mall&limit=5&dedupe=1&
// / const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=kbmall&key=AIzaSyBX7rQJzbDPH7BbvmsihiXmrFFLyoeJFCs`
//     // const url = `https://api.locationiq.com/v1/autocomplete?key=${key}&q=${query}&limit=10&dedupe=1&`