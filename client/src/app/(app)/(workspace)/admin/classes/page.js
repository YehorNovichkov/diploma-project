'use client'

import { createClass, fetchClasses } from '@/api/classAPI'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Classes() {
    const router = useRouter()
    const [classes, setClasses] = useState([])
    const [classInputName, setClassInputName] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchClasses().then((data) => {
            setClasses(data)
            setLoading(false)
        })
    }, [])

    const handleAddClass = async () => {
        try {
            const data = await createClass(classInputName)
            setClasses([...classes, data])
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <main>
            {loading ? (
                <div className='flex min-h-screen flex-col p-6 lg:p-12 mt-20'>
                    <div className='grid grid-cols-1 gap-4'>
                        <Card>
                            <CardHeader>
                                <Skeleton className='h-4 w-[250px]' />
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Skeleton className='h-4 w-[250px]' />
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Skeleton className='h-4 w-[250px]' />
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className='flex min-h-screen flex-col p-6 lg:p-12'>
                    <div className='flex items-center justify-between mb-12'>
                        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Класи</h1>
                        <Dialog className='ml-auto'>
                            <DialogTrigger asChild>
                                <Button className='ml-auto'>
                                    <PlusIcon />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className='sm:max-w-[425px]'>
                                <DialogHeader>
                                    <DialogTitle>Додати клас</DialogTitle>
                                    <DialogDescription>Введіть назву класу та натисніть зберегти</DialogDescription>
                                </DialogHeader>
                                <div className='grid gap-4 py-4 grid-cols-4 items-center'>
                                    <Label htmlFor='class' className='text-right'>
                                        Назва
                                    </Label>
                                    <Input
                                        onChange={(e) => setClassInputName(e.target.value)}
                                        id='class'
                                        placeholder='Введіть назву класу'
                                        className='col-span-3'
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button onClick={handleAddClass}>Зберегти</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className='grid grid-cols-1 gap-4'>
                        <Accordion type='single' collapsible className='w-full'>
                            {[...Array(11).keys()].map((i) => {
                                const value = `${i + 1}-`
                                return (
                                    <AccordionItem value={value}>
                                        <AccordionTrigger>{i + 1} класи</AccordionTrigger>
                                        <AccordionContent>
                                            {(() => {
                                                const filteredClasses = classes.filter((classItem) => classItem.name.includes(value))

                                                return filteredClasses.length > 0 ? (
                                                    filteredClasses.map((classItem) => (
                                                        <Card
                                                            key={classItem.id}
                                                            className='cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out mb-1 mt-1'
                                                            onClick={() => {
                                                                router.push(`classes/${classItem.id}`)
                                                            }}>
                                                            <CardHeader>{classItem.name}</CardHeader>
                                                        </Card>
                                                    ))
                                                ) : (
                                                    <div className='text-muted-foreground'>Немає класів</div>
                                                )
                                            })()}
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </div>
                </div>
            )}
        </main>
    )
}
