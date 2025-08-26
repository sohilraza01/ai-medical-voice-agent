import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import DoctorsAgentList from './_components/DoctorsAgentList'

export default function Dashboard() {
  return (
    <div>
        <div className='flex justify-between items-center'>
        <h2 className='font-bold text-2xl'>My Dashboard</h2>
        <Button className='cursor-pointer'>+ Consult with Doctor</Button>
        </div>
        <HistoryList/>
        <DoctorsAgentList/>
    </div>
  )
}
