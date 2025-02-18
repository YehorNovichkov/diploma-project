'use client'

import { fetchSubjectsByName } from '@/api/subjectAPI'
import { fetchTasks } from '@/api/taskAPI'
import { ScrollArea } from '@/components//ui/scroll-area'
import { useAppContext } from '@/components/context/appWrapper'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getTimeUntilDeadline } from '@/lib/timeUntilDeadlineFormer'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { debounce } from 'lodash'
import { ALargeSmall, AlarmClock, AlarmClockOff, ArrowDown, ArrowUp, Calendar, Filter, FilterX, LibraryBigIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export default function Tasks() {
    const { userStore } = useAppContext()
    const router = useRouter()
    const limit = 10
    const [loading, setLoading] = useState(false)
    const [selectedSort, setSelectedSort] = useState('createdAt')
    const [selectedSortDirection, setSelectedSortDirection] = useState('desc')
    const [includeOverdue, setIncludeOverdue] = useState(true)
    const [filtersOff, setFiltersOff] = useState(true)
    const [filtersOn, setFiltersOn] = useState(false)

    const [tasks, setTasks] = useState([])
    const [currentTasksPage, setCurrentTasksPage] = useState(1)
    const [totalTasks, setTotalTasks] = useState(0)

    const [nameQueryValue, setNameQueryValue] = useState('')
    const [subjectQueryValue, setSubjectQueryValue] = useState('')
    const [subjectIdValue, setSubjectIdValue] = useState('')
    const [subjects, setSubjects] = useState([])
    const [subjectsLoading, setSubjectsLoading] = useState(false)
    const [subjectPopoverOpen, setSubjectPopoverOpen] = useState(false)

    const classIdValue = userStore.user.classId

    const debouncedFetchTasks = useCallback(
        debounce((limit, page, sort, sortDirection, classId, subjectId, includeOverdue, name) => {
            fetchTasks(limit, page, sort, sortDirection, classId, subjectId, includeOverdue, name, false).then((data) => {
                setTasks(data.tasks)
                setTotalTasks(data.total)
                setLoading(false)
            })
        }, 500),
        []
    )

    const debouncedFetchSubjects = useCallback(
        debounce(async (query) => {
            if (query.length > 0) {
                setSubjectsLoading(true)
                try {
                    const fetchedSubjects = await fetchSubjectsByName(query)
                    setSubjects(fetchedSubjects)
                } finally {
                    setSubjectsLoading(false)
                }
            } else {
                setSubjects([])
            }
        }, 500),
        []
    )

    const handleTasksPreviousPage = () => {
        if (!(currentTasksPage <= 1)) {
            setCurrentTasksPage((prev) => prev - 1)
        }
    }

    const handleTasksNextPage = () => {
        if (!(currentTasksPage >= Math.ceil(totalTasks / limit))) {
            setCurrentTasksPage((prev) => prev + 1)
        }
    }

    useEffect(() => {
        setLoading(true)
        debouncedFetchTasks(limit, currentTasksPage, selectedSort, selectedSortDirection, classIdValue, subjectIdValue, includeOverdue, nameQueryValue)
    }, [currentTasksPage, selectedSort, selectedSortDirection, classIdValue, subjectIdValue, nameQueryValue, includeOverdue, debouncedFetchTasks])

    useEffect(() => {
        debouncedFetchSubjects(subjectQueryValue)
    }, [subjectQueryValue, debouncedFetchSubjects])

    return (
        <main>
            <div className='flex min-h-screen flex-col p-6 lg:p-12'>
                <div className='flex items-center justify-between mb-12'>
                    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Завдання</h1>
                </div>
                <div>
                    <div className='flex flex-wrap justify-end gap-2 border rounded-md p-1 items-center'>
                        <TooltipProvider>
                            <Tooltip>
                                <Toggle asChild pressed={includeOverdue} onPressedChange={setIncludeOverdue}>
                                    <TooltipTrigger>
                                        <AlarmClockOff className='h-4 w-4' />
                                    </TooltipTrigger>
                                </Toggle>
                                <TooltipContent>Показувати прострочені</TooltipContent>
                            </Tooltip>

                            <Separator decorative orientation='vertical' className='h-9' />

                            <ToggleGroup
                                value={selectedSort}
                                onValueChange={(selectedSort) => {
                                    if (selectedSort) setSelectedSort(selectedSort)
                                }}
                                type='single'>
                                <Tooltip className='w-full'>
                                    <ToggleGroupItem asChild value='name' aria-label='Сортування за назвою'>
                                        <TooltipTrigger>
                                            <ALargeSmall className='h-4 w-4' />
                                        </TooltipTrigger>
                                    </ToggleGroupItem>
                                    <TooltipContent>Сортувати за назвою</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <ToggleGroupItem asChild value='createdAt' aria-label='Сортування за датою створення'>
                                        <TooltipTrigger>
                                            <Calendar className='h-4 w-4' />
                                        </TooltipTrigger>
                                    </ToggleGroupItem>
                                    <TooltipContent>Сортувати за датою створення</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <ToggleGroupItem asChild value='deadline' aria-label='Сортування за дедлайном'>
                                        <TooltipTrigger>
                                            <AlarmClock className='h-4 w-4' />
                                        </TooltipTrigger>
                                    </ToggleGroupItem>
                                    <TooltipContent>Сортувати за дедлайном</TooltipContent>
                                </Tooltip>
                            </ToggleGroup>

                            <Separator orientation='vertical' className='h-9' />

                            <ToggleGroup
                                value={selectedSortDirection}
                                onValueChange={(selectedSortDirection) => {
                                    if (selectedSortDirection) setSelectedSortDirection(selectedSortDirection)
                                }}
                                type='single'>
                                <ToggleGroupItem value='desc' aria-label='За спаданням'>
                                    <ArrowDown className='h-4 w-4' />
                                </ToggleGroupItem>
                                <ToggleGroupItem value='asc' aria-label='За зростанням'>
                                    <ArrowUp className='h-4 w-4' />
                                </ToggleGroupItem>
                            </ToggleGroup>

                            <Separator orientation='vertical' className='h-9' />

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Toggle pressed={filtersOn} onPressedChange={setFiltersOn}>
                                        <Filter className='h-4 w-4' />
                                    </Toggle>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Popover open={subjectPopoverOpen} onOpenChange={setSubjectPopoverOpen} modal>
                                        <PopoverTrigger asChild>
                                            <Button variant='outline' className='w-full text-left mb-2'>
                                                {subjectIdValue === '' ? (
                                                    'За предметом'
                                                ) : (
                                                    <>
                                                        <LibraryBigIcon className='mr-2 h-4 w-4' />
                                                        {subjects.find((c) => c.id === parseInt(subjectIdValue))?.name}
                                                    </>
                                                )}
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent>
                                            <Input
                                                value={subjectQueryValue}
                                                onChange={(e) => setSubjectQueryValue(e.target.value)}
                                                placeholder='Пошук предмету'
                                            />
                                            <ScrollArea className='h-[150px] mt-2'>
                                                {subjectsLoading && <Skeleton className='h-8' />}
                                                {subjects.map((subjectItem) => (
                                                    <>
                                                        <Separator className='my-2' />
                                                        <div
                                                            className='text-sm cursor-pointer hover:text-muted-foreground p-1'
                                                            key={subjectItem.id}
                                                            onClick={() => {
                                                                setFiltersOff(false)
                                                                setFiltersOn(true)
                                                                setSubjectIdValue(subjectItem.id)
                                                                setSubjectPopoverOpen(false)
                                                            }}>
                                                            {subjectItem.name}
                                                        </div>
                                                    </>
                                                ))}
                                            </ScrollArea>
                                        </PopoverContent>
                                    </Popover>
                                </PopoverContent>
                            </Popover>
                            <Toggle
                                pressed={filtersOff}
                                onClick={() => {
                                    setFiltersOff(true)
                                    setSubjectIdValue('')
                                }}>
                                <FilterX className='h-4 w-4' />
                            </Toggle>

                            <Separator orientation='vertical' className='h-9' />

                            <Input
                                value={nameQueryValue}
                                onChange={(e) => {
                                    setNameQueryValue(e.target.value)
                                }}
                                className='lg:w-[300px] w-full lg:border-none'
                                placeholder='Пошук за назвою'
                            />
                        </TooltipProvider>
                    </div>
                </div>

                <div className='mt-4'>
                    {loading ? (
                        <div className='flex min-h-screen flex-col'>
                            <div className='grid grid-cols-1 gap-4'>
                                {[...Array(3)].map((_, index) => (
                                    <Card key={index}>
                                        <CardHeader>
                                            <Skeleton className='h-4 w-[250px]' />
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 gap-4'>
                            {tasks.map((task) => (
                                <Card
                                    key={task.id}
                                    className='cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out'
                                    onClick={() => {
                                        router.push(`/workspace/student/tasks/${task.id}`)
                                    }}>
                                    <CardHeader>
                                        <div className='flex justify-between items-center align-middle'>
                                            <CardTitle>{task.name}</CardTitle>
                                            <span className='text-sm text-muted-foreground ml-2'>
                                                {format(toZonedTime(new Date(task.createdAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}
                                            </span>
                                        </div>

                                        <CardDescription>
                                            {task.class.name} • {task.subject.name} • Дедлайн:{' '}
                                            {format(toZonedTime(new Date(task.deadline), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')} (
                                            {getTimeUntilDeadline(task.deadline)})
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                    {totalTasks > limit && (
                        <Pagination className='mt-4'>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious className='hover:cursor-pointer' onClick={handleTasksPreviousPage} disabled={currentTasksPage <= 1} />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        className='hover:cursor-pointer'
                                        onClick={handleTasksNextPage}
                                        disabled={currentTasksPage >= Math.ceil(totalTasks / limit)}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </div>
        </main>
    )
}
