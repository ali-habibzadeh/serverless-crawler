import axios, { AxiosRequestConfig, AxiosAdapter } from "axios";
import flatCache from "flat-cache";

const axiosDiskCache = flatCache.load("AxiosDiskCache", "/tmp/axios-cache");

interface ICachedResponse {
  data: any;
  status: number;
  statusText: string;
}

function getResponseAdapter(req: AxiosRequestConfig, res: ICachedResponse): AxiosAdapter {
  return () => {
    return Promise.resolve({
      request: req,
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: req.headers,
      config: req
    });
  };
}

axios.interceptors.request.use(req => {
  const url = req.url;
  const shouldCache = req.headers.cache;
  if (req.method === "get" && url && shouldCache) {
    const cachedResponse = <ICachedResponse>axiosDiskCache.getKey(url);
    if (cachedResponse) {
      req.adapter = getResponseAdapter(req, cachedResponse);
    }
  }
  return req;
});

axios.interceptors.response.use(res => {
  const shouldCache = res.config.headers.cache;
  const url = res.config.url;
  if (res.config.method === "get" && url && shouldCache) {
    axiosDiskCache.setKey(url, {
      data: res.data,
      status: res.status,
      statusText: res.statusText
    });
    axiosDiskCache.save();
  }
  return res;
});
