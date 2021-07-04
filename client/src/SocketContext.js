import React , { CreateContext , useState , useRef  , useEffect} from 'react';
import {io} from 'socket.io-client'; 
import Peer from 'simple-peer';

const SocketContext = CreateContext();

const socket = io('http://localhost:5000'); 

const ContextProvider = ({children}) => { 
 
     const [stream , setStream] = useState(null);
     const [me , setMe] = useState('');
     const [call , setCall] = useState('');
     const [callAccepted , setCallAccepted] = useState(false);
     const [callEnded, setCallEnded] = useState(false);
     const [name, setName] = useState('');
     const myVideo  = useRef();
     const userVideo = useRef();
     const connectionRef = useRef();

     useEffect (() => {
        navigator.mediaDevices.getUserMedia( { video : true , audio : true})
        .then((currenStream) => { 

            setStream (currenStream);

            myVideo.current.srcObject = currenStream;
        })
        socket.on('me' , (id) => setMe(id) );
        socket.on('calluser' ,  ({ from , name :callerName  , signal}) => { 
            setCall ({isReceivedCall : true , from , name:callerName , signal})
        });
    } , []);

    const answercall = () => { 
        setCallAccepted(true);
        const peer = new Peer({initiator : false , trickle :false , stream})

        peer.on('signal' , (data) => { 
            socket.emi('answercall' , {signal :data , to: call.from}) ; 
        });

        peer.on('stream' , (currenStream) => { 
            userVideo.current.srvObject = currenStream;
        } ) ; 

        peer.signal(call.signal);

        connectionRef.current =peer ;
    }

    const callUser = (id) => { 

        const peer = new Peer({initiator : true , trickle :false , stream})

        peer.on('signal' , (data) => { 
            socket.emi('callUser' , {userToCall: id , signalData : data , from: me  , name}) ; 
        });

        peer.on('stream' , (currenStream) => { 
            userVideo.current.srcObject = currenStream;
        } ) ; 

        socket.on('callAccepted', (signal) => { 
            setCallAccepted(true) ;

            peer.signal(signal);
        }) ; 
        connectionRef.current =peer ;
    }

    const leaveCall =() => {
        
        setCallEnded(true); 
        connectionRef.current.destroy() ;

        window.location.reload(); // reload the page 

     }

     return ( 
         //everything you pass in value will be accesable in all components
         <SocketContext.Provider value = {{call , callAccepted , myVideo ,userVideo , stream , name , setName , callEnded , me , callUser , leaveCall, answercall}}> 

         {children}

         </SocketContext.Provider>

     );
}

export default {ContextProvider , SocketContext };