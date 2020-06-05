import axios, { AxiosRequestConfig, AxiosAdapter } from "axios";
import flatCache from "flat-cache";

const axiosDisCache = flatCache.load("AxiosDiskCache", "/tmp/axios-cache");

interface ICachedResponse {
  data: any;
  status: number;
  statusText: string;
}

function getResponseAdapter(request: AxiosRequestConfig, cachedResponse: ICachedResponse): AxiosAdapter {
  return () => {
    return Promise.resolve({
      request,
      data: cachedResponse.data,
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers: request.headers,
      config: request
    });
  };
}

axios.interceptors.request.use(request => {
  const url = request.url;
  const shouldCache = request.headers.cache;
  if (request.method === "get" && url && shouldCache) {
    const cachedResponse = <ICachedResponse>axiosDisCache.getKey(url);
    if (cachedResponse) {
      request.adapter = getResponseAdapter(request, cachedResponse);
    }
  }
  return request;
});

axios.interceptors.response.use(response => {
  const shouldCache = response.config.headers.cache;
  const url = response.config.url;
  if (response.config.method === "get" && url && shouldCache) {
    axiosDisCache.setKey(url, {
      data: response.data,
      status: response.status,
      statusText: response.statusText
    });
    axiosDisCache.save();
  }
  return response;
});
