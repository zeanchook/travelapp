import sendRequest from "./send-request";

export const getMapData = async (id) => {
  const url = `/api/map/getJSON/${id}`;
  const response = await sendRequest(url);
  return response;
};

export const getMapDataByUser = async (name) => {
  const url = `/api/map/getJSONByUser/${name}`;
  const response = await sendRequest(url);
  return response;
};
