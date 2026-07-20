// "use client"
// import axios from 'axios';
// import { useParams } from 'next/navigation'
// import React, { useEffect, useState } from 'react'
// import {doctorAgent} from '../../_components/DoctorsAgentCard';
// import { Circle, PhoneCall, PhoneOff } from 'lucide-react';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// type SessionDetail ={
//   id:number,
//   notes:string,
//   sessionId:string,
//   report:JSON,
//   selectedDoctor:doctorAgent,
//   createdOn:string
// }
// type messages={
//   role:string,
//   text:string
// }

// export default function MedicalVoiceAgent() {
//   const {sessionId} = useParams();
//   const [sessionDetail,setSessionDetail] = useState<SessionDetail>();
//   const [callStarted, setCallStarted] = useState(false);
//   const [currentRole,setCurrentRoll] = useState<string>();
//   const [liveTranscript,setLiveTranscript] = useState<string>('');
//   const [messages,setMessages] = useState<messages[]>([]);
//   const [loading,setLoading] = useState(false);
// // Vapi
//   useEffect(()=>{
//       sessionId&&GetSessionDetail();
//   },[sessionId])

//   const GetSessionDetail = async () =>{
//     const result = await axios.get('/api/session-chat?sessionId='+sessionId);
//     console.log(result.data);
//     setSessionDetail(result.data);
//   }


//   // CallStarted Function of Vapi
//   const StartCall = async()=>{
//     console.log("Vapi API for AI Voice Agent");
//   }

//   // End Call
//    const endCall = async()=>{
//     console.log("End call!");
//     setLoading(true);
//     const result = await GenerateReport();
//     setLoading(false);
//    }

// const GenerateReport = async () =>{
//   const result  = await axios.post('/api/medical-report',{
//     messages:messages,
//     sessionDetail:sessionDetail,
//     sessionId:sessionId
  
//   })
//   console.log(result.data);
//   return result.data;
// }


//   return (
//     <div className='p-5 border rounded-3xl bg-secondary'> 
//       <div className='flex justify-between items-center'>
//         <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'> <Circle className={`h-4 w-4 rounded-full ${callStarted?'bg-green-500':'bg-red-500'}`}/>{callStarted?'Connected...':'Not Connected'}</h2>
//         <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
//       </div>
//        {sessionDetail &&<div className='flex items-center flex-col mt-10'>
//          <Image src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist}
//         width={120}
//         height={120}
//         className='h-[100px] w-[100px] object-cover rounded-full'
//         />
//         <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
//         <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>
//         <div className='mt-32'>
//           <h2 className='text-gray-400'>Assistant Message</h2>
//           <h2 className='text-lg'>User Message</h2>
//         </div>
//         {!callStarted ? (<Button className='mt-20' onClick={StartCall}><PhoneCall/> Start Call</Button>
//         ):(
//         <Button variant='destructive' onClick={endCall}>   <PhoneOff/>Disconnect</Button>
//         )}

//         </div>}
//     </div>
//   )
// }
 






"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { Circle, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type doctorAgent = {
  id: number,
  specialist: string,
  description: string,
  image: string,
  agentPrompt: string,
  voiceId: string,
  subscriptionRequired: boolean
}

type SessionDetail ={
  id:number,
  notes:string,
  sessionId:string,
  report:JSON,
  selectedDoctor:doctorAgent,
  createdOn:string
}

type Message = {
  role: 'user' | 'assistant',
  text: string
}

export default function MedicalVoiceAgent() {
  const [sessionDetail,setSessionDetail] = useState<SessionDetail>();
  const {sessionId} = useParams();

  const [callStarted, setCallStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [liveUserText, setLiveUserText] = useState('');
  const [assistantText, setAssistantText] = useState('');
  const [seconds, setSeconds] = useState(0);

  const messagesRef = useRef<Message[]>([]);
  const recognitionRef = useRef<any>(null);
  const callActiveRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionDetailRef = useRef<SessionDetail>();
  const isSpeakingRef = useRef(false);

  useEffect(()=>{
      sessionId&&GetSessionDetail();
  },[sessionId])

  useEffect(() => {
    sessionDetailRef.current = sessionDetail;
  }, [sessionDetail]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  const GetSessionDetail = async () =>{
    const result = await axios.get('/api/session-chat?sessionId='+sessionId);
    console.log('Session data:', result.data);
    setSessionDetail(result.data);
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  const speak = (text: string) => {
    return new Promise<void>((resolve) => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
        if (callActiveRef.current) startListening();
      };
      window.speechSynthesis.speak(utterance);
    });
  }

  const getAIResponse = async () => {
    const currentSession = sessionDetailRef.current;

    if (!currentSession?.selectedDoctor?.agentPrompt) {
      console.error('Agent prompt missing, sessionDetailRef:', currentSession);
      if (callActiveRef.current) startListening();
      return;
    }

    try {
      const result = await axios.post('/api/medical-agent', {
        agentPrompt: currentSession.selectedDoctor.agentPrompt,
        messages: messagesRef.current
      });
      const aiText = result.data.response;
      setAssistantText(aiText);
      messagesRef.current = [...messagesRef.current, { role: 'assistant', text: aiText }];
      await speak(aiText);
    } catch (error) {
      console.error('AI response error:', error);
      if (callActiveRef.current) startListening();
    }
  }

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition Chrome browser mein hi kaam karta hai.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        event.results[i].isFinal ? (final += transcript) : (interim += transcript);
      }
      setLiveUserText(interim || final);

      if (final) {
        messagesRef.current = [...messagesRef.current, { role: 'user', text: final }];
        setLiveUserText('');
        getAIResponse();
      }
    };

    recognition.onend = () => {
      if (callActiveRef.current && !isSpeakingRef.current) {
        setTimeout(() => callActiveRef.current && startListening(), 300);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  const StartCall = async () => {
    const currentSession = sessionDetailRef.current;
    if (!currentSession) return;

    setCallStarted(true);
    callActiveRef.current = true;
    messagesRef.current = [];

    timerRef.current = setInterval(() => setSeconds(prev => prev + 1), 1000);

    const greeting = `Hello, I'm your ${currentSession.selectedDoctor.specialist}. How can I help you today?`;
    setAssistantText(greeting);
    messagesRef.current = [{ role: 'assistant', text: greeting }];
    await speak(greeting);
  }

  const EndCall = () => {
    setCallStarted(false);
    callActiveRef.current = false;
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    setSeconds(0);
    setLiveUserText('');
    setAssistantText('');
  }

  return (
    <div className='p-5 border rounded-3xl bg-secondary'> 
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'>
          <Circle className={`h-4 ${callStarted ? 'text-green-500 fill-green-500' : ''}`}/>
          {callStarted ? 'Connected' : 'Not Connected'}
        </h2>
        <h2 className='font-bold text-xl text-gray-400'>{formatTime(seconds)}</h2>
      </div>
       {sessionDetail &&<div className='flex items-center flex-col mt-10'>
         <Image src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist}
        width={120}
        height={120}
        className={`h-[100px] w-[100px] object-cover rounded-full ${isSpeaking ? 'animate-pulse' : ''}`}
        />
        <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
        <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>
        <div className='mt-32 text-center px-5 min-h-[60px]'>
          <h2 className='text-gray-400'>{assistantText}</h2>
          <h2 className='text-lg'>{liveUserText}</h2>
        </div>
        {!callStarted ? (
          <Button className='mt-20' onClick={StartCall}><PhoneCall/> Start Call</Button>
        ) : (
          <Button className='mt-20' variant='destructive' onClick={EndCall}><PhoneOff/> End Call</Button>
        )}
        </div>}
    </div>
  )
}