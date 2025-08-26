import { Button } from '@/components/ui/button'
import { IconArrowRight } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'

type doctorAgent ={
    id:number,
    specialist:string,
    description:string,
    image:string,
    agentPrompt:string
}
type props ={
    doctorAgent:doctorAgent
}


export default function DoctorsAgentCard({doctorAgent} : props) {
  return (
    <div>
     <Image src={doctorAgent.image}
            alt={doctorAgent.specialist}
            width={200}
            height={300}
            className='w-full h-[250px] object-cover rounded-2xl'
            />
            <h2 className='font-bold text-lg mt-1'>{doctorAgent.specialist}</h2>
            <p className='line-clamp-2  text-sm text-gray-500'>{doctorAgent.description}</p>
            <Button className='w-full mt-2 cursor-pointer'>Start Consultant <IconArrowRight/> </Button>
    </div>
  )
}
