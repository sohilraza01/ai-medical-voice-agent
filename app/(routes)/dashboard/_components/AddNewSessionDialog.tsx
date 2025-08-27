// "use client"
// import React, { useState } from 'react'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import { DialogClose } from '@radix-ui/react-dialog'
// import { ArrowRight } from 'lucide-react'
// import { doctorAgent } from './DoctorsAgentCard'
// import axios from 'axios'
// import { useRouter } from 'next/navigation'
// export function AddNewSessionDialog() {
//     const [note,setNote] = useState<string>()
//     const [loading,setLoading] = useState(false);
//     const [suggestedDoctor,setSuggestedDoctor] = useState<doctorAgent>();
//     const [selectedDoctor,setSelectedDoctor] = useState<doctorAgent>();
//     const router  = useRouter();
//     const OnClickNext = async ()=>{
//       setLoading(true);
//       const result = await axios.post('/api/suggest-doctors',{
//         notes:note,
//       })
//         console.log(result.data);
//         setSuggestedDoctor(result.data);
//         setLoading(false);
//     }

//     const onStartConsultation = async ()=>{
//       setLoading(true);
//       // Save All Data into Database
//       const result = await axios.post('/api/session-chat',{
//         notes:note,
//         selectedDoctor:selectedDoctor
//       });
//       console.log(result.data);
//       if(result?.data?.sessionId){
//         console.log(result.data.sessionId);
//         // Route new Conversation Screen
//         router.push('/dashboard/medical-agent/'+ result.data.sessionId)
//       }
//       setLoading(false);
//     }


//   return (
//     <Dialog>
//         <DialogTrigger asChild>
//   <Button className='mt-4 cursor-pointer'>+ Start a Consultation</Button>
//   </DialogTrigger>
//   <DialogContent>
//     <DialogHeader>
//       <DialogTitle>Add basic Details</DialogTitle>
//       <DialogDescription asChild>
//         <div>
//             <h2>Add Symptoms or Any Other Details</h2>
//             <Textarea placeholder='Add Detail here....' className='h-[200px] mt-1'
//                 onChange={(e)=>setNote(e.target.value)}
//             />
//         </div>
//       </DialogDescription>
//     </DialogHeader>
//     <DialogFooter>
//         <DialogClose asChild >
//         <Button variant={'outline'} className='cursor-pointer'>Cancel</Button>
//         </DialogClose>

//         <Button disabled={!note} className='cursor-pointer' onClick={onStartConsultation}>Next <ArrowRight/></Button>
//     </DialogFooter>
//   </DialogContent>
// </Dialog>
//   )
// }










"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight } from "lucide-react";
import { doctorAgent } from "./DoctorsAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard"; 
import axios from "axios";
import { useRouter } from "next/navigation";

export function AddNewSessionDialog() {
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([]); 
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const [step, setStep] = useState(1); 
  const router = useRouter();

 
  const OnClickNext = async () => {
    setLoading(true);
    const result = await axios.post("/api/suggest-doctors", {
      notes: note,
    });
    console.log(result.data);
    setSuggestedDoctors(result.data);
    setStep(2); 
    setLoading(false);
  };


  const onStartConsultation = async () => {
    setLoading(true);
    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: selectedDoctor,
    });
    console.log(result.data);
    if (result?.data?.sessionId) {
      router.push("/dashboard/medical-agent/" + result.data.sessionId);
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-4 cursor-pointer">+ Start a Consultation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Add Basic Details" : "Select a Doctor"}
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              {step === 1 && (
                <>
                  <h2>Add Symptoms or Any Other Details</h2>
                  <Textarea
                    placeholder="Add Detail here...."
                    className="h-[200px] mt-1"
                    onChange={(e) => setNote(e.target.value)}
                  />
                </>
              )}

              {step === 2 && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {suggestedDoctors.map((doc) => (
                    <SuggestedDoctorCard
                      key={doc.id}
                      // @ts-ignore
                      doctorAgent={doc}
                      selectedDoctor={selectedDoctor}
                      setSelectedDoctor={setSelectedDoctor}
                    />
                  ))}
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>

          {step === 1 && (
            <Button
              disabled={!note || loading}
              className="cursor-pointer"
              onClick={OnClickNext}
            >
              Next <ArrowRight />
            </Button>
          )}

          {step === 2 && (
            <Button
              disabled={!selectedDoctor || loading}
              className="cursor-pointer"
              onClick={onStartConsultation}
            >
              Start Consultation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
