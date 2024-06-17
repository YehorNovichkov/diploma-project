'use client'

import { useAppContext } from '@/components/context/appWrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Parent() {
    const { userStore, parentStore } = useAppContext()
    const handleSelectChange = (value) => {
        parentStore.setSelectedStudentId(value)
    }
    return (
        <main>
            <div className='flex min-h-screen flex-col items-center p-24'>
                <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Вітаємо!</h1>
                <p className='leading-7 [&:not(:first-child)]:mt-6'>Для продовження роботи, оберіть категорію.</p>
                <div className='flex mt-6'>
                    <Select value={parentStore.selectedStudentId} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                            <SelectValue placeholder='Оберіть учня' />
                        </SelectTrigger>
                        <SelectContent>
                            {userStore.user.children.map((child, index) => (
                                <SelectItem key={index} value={child.id}>
                                    {`${child.name} ${child.surname} ${child.patronymic}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </main>
    )
}
