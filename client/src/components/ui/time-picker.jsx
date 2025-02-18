'use client'

import { Label } from '@/components/ui/label'
import { Clock } from 'lucide-react'
import { useRef } from 'react'
import { TimePickerInput } from './time-picker-input'

export function TimePicker({ date, setDate }) {
    const minuteRef = useRef(null)
    const hourRef = useRef(null)
    const secondRef = useRef(null)

    return (
        <div className='flex items-end gap-2'>
            <div className='grid gap-1 text-center'>
                <Label htmlFor='hours' className='text-xs'>
                    год.
                </Label>
                <TimePickerInput picker='hours' date={date} setDate={setDate} ref={hourRef} onRightFocus={() => minuteRef.current?.focus()} />
            </div>
            <div className='grid gap-1 text-center'>
                <Label htmlFor='minutes' className='text-xs'>
                    хв.
                </Label>
                <TimePickerInput
                    picker='minutes'
                    date={date}
                    setDate={setDate}
                    ref={minuteRef}
                    onLeftFocus={() => hourRef.current?.focus()}
                    onRightFocus={() => secondRef.current?.focus()}
                />
            </div>
            <div className='grid gap-1 text-center'>
                <Label htmlFor='seconds' className='text-xs'>
                    сек.
                </Label>
                <TimePickerInput picker='seconds' date={date} setDate={setDate} ref={secondRef} onLeftFocus={() => minuteRef.current?.focus()} />
            </div>
            <div className='flex h-10 items-center'>
                <Clock className='ml-2 h-4 w-4' />
            </div>
        </div>
    )
}
