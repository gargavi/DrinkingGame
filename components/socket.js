import io from "socket.io-client"; 
import Constants from "expo-constants";
import parameters from "../parameters.json"; 
let socket; 

const { manifest } = Constants;
const uri = `http://${manifest.debuggerHost.split(':').shift()}:5000`;

let endpoint
if (parameters["dev"] == "false") { 
    endpoint = parameters["deployendpoint"]
} else { 
    endpoint = uri;
}
socket = io(endpoint); 
export {endpoint}
export default socket; 