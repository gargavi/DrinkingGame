import io from "socket.io-client"; 
import Constants from "expo-constants";
import parameters from "../parameters.json"; 
let socket; 


let endpoint
if (parameters["dev"] == "false") { 
    endpoint = parameters["deployendpoint"]
} else { 
    const { manifest } = Constants;
    if (manifest && manifest.debuggerHost) {
        const uri = `http://${manifest.debuggerHost.split(':').shift()}:5000`;
        endpoint = uri;
    }
}
socket = io(endpoint); 
export {endpoint}
export default socket; 