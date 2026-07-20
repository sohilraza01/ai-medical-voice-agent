"use client"
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {doctorAgent} from '../../_components/DoctorsAgentCard';
import { Circle, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
type SessionDetail ={
  id:number,
  notes:string,
  sessionId:string,
  report:JSON,
  selectedDoctor:doctorAgent,
  createdOn:string
}
type messages={
  role:string,
  text:string
}

export default function MedicalVoiceAgent() {
  const {sessionId} = useParams();
  const [sessionDetail,setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [currentRole,setCurrentRoll] = useState<string>();
  const [liveTranscript,setLiveTranscript] = useState<string>('');
  const [messages,setMessages] = useState<messages[]>([]);
  const [loading,setLoading] = useState(false);
// Vapi
  useEffect(()=>{
      sessionId&&GetSessionDetail();
  },[sessionId])

  const GetSessionDetail = async () =>{
    const result = await axios.get('/api/session-chat?sessionId='+sessionId);
    console.log(result.data);
    setSessionDetail(result.data);
  }


  // CallStarted Function of Vapi
  const StartCall = async()=>{
    console.log("Vapi API for AI Voice Agent");
  }

  // End Call
   const endcall = async()=>{
    console.log("End call!");
    setLoading(true);
    const result = await GenerateReport();
    setLoading(false);
   }

const GenerateReport = async () =>{
  const result  = await axios.post('/api/medical-report',{
    messages:messages,
    sessionDetail:sessionDetail,
    sessionId:sessionId
  
  })
  console.log(result.data);
  return result.data;
}


  return (
    <div className='p-5 border rounded-3xl bg-secondary'> 
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'> <Circle className={`h-4 w-4 rounded-full ${callStarted?'bg-green-500':'bg-red-500'}`}/>{callStarted?'Connected...':'Not Connected'}</h2>
        <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
      </div>
       {sessionDetail &&<div className='flex items-center flex-col mt-10'>
         <Image src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist}
        width={120}
        height={120}
        className='h-[100px] w-[100px] object-cover rounded-full'
        />
        <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
        <p className='text-sm text-gray-400'>AI Medical Voice Agent</p>
        <div className='mt-32'>
          <h2 className='text-gray-400'>Assistant Message</h2>
          <h2 className='text-lg'>User Message</h2>
        </div>
        {!callStarted ? (<Button className='mt-20' onClick={StartCall}><PhoneCall/> Start Call</Button>
        ):(
        <Button variant='destructive' onClick={}>   <PhoneOff/>Disconnect</Button>
        )}

        </div>}
    </div>
  )
}
 