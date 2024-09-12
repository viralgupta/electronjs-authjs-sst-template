import axios from "axios"
import forge from "node-forge"
import privateKeyPem from "/private_key.txt"


const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
})

request.interceptors.request.use((config) => {
  const timestamp = Date.now().toString();

  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);  
  
  const md = forge.md.sha256.create();
  md.update(timestamp, 'utf8');
  const signature = forge.util.encode64(privateKey.sign(md));

  config.headers.timestamp = timestamp;
  config.headers.signature = signature;

  return config;
}, (error) => {
  return Promise.reject(error)
})

export default request;