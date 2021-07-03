import React , { createContext , useState , useRef  ,UseEffect} from 'react';
import {io} from 'socket.io-client'; 
import Peer from 'simple-peer';
import { useEffect } from 'react';

const SokcetContext = CreateContext();

const socket = io('http://localhost:5000'); 

const ContextProvider = ({children}) => { 
 
     const [stream , setStream] = useState(null);
     const [me , setMe] = useState('');
     const [call , setCall] = useState('');
     const myVideo  = useRef();

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

    }

    const callUser = () => { 

    }

    const leaveCall =() => {

     }
}