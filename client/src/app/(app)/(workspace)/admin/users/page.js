'use client'

import { fetchUsersByFullNameAndRole, fetchUsersByRole } from '@/api/userAPI'
import { AddUserDialog } from '@/components/admin/addUserDialog'
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Users() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('students')

    const [students, setStudents] = useState([])
    const [currentStudentsPage, setCurrentStudentsPage] = useState(1)
    const [totalStudents, setTotalStudents] = useState(0)
    const [studentsTabActive, setStudentsTabActive] = useState(true)
    const [studentsSearchQuery, setStudentsSearchQuery] = useState('')

    const handleStudentPreviousPage = () => {
        if (currentStudentsPage !== 1) {
            setCurrentStudentsPage((prev) => prev - 1)
        }
    }

    const handleStudentNextPage = () => {
        if (currentStudentsPage !== Math.ceil(totalStudents / limit)) {
            setCurrentStudentsPage((prev) => prev + 1)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchUsersByRole('student', limit, currentStudentsPage).then((data) => {
            setStudents(data.users)
            setTotalStudents(data.total)
            setLoading(false)
        })
        setLoading(false)
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchUsersByRole('student', limit, currentStudentsPage).then((data) => {
            setStudents(data.users)
            setTotalStudents(data.total)
            setLoading(false)
        })
        setLoading(false)
    }, [currentStudentsPage, studentsTabActive])

    useEffect(() => {
        if (studentsSearchQuery.length >= 4) {
            fetchUsersByFullNameAndRole(studentsSearchQuery, 'student').then((data) => {
                setStudents(data)
            })
        }
        if (studentsSearchQuery.length === 0) {
            setLoading(true)
            fetchUsersByRole('student', limit, currentStudentsPage).then((data) => {
                setStudents(data.users)
                setTotalStudents(data.total)
                setLoading(false)
            })
            setLoading(false)
        }
    }, [studentsSearchQuery])

    const [teachers, setTeachers] = useState([])
    const [currentTeachersPage, setCurrentTeachersPage] = useState(1)
    const [totalTeachers, setTotalTeachers] = useState(0)
    const [teachersTabActive, setTeachersTabActive] = useState(false)
    const [teachersSearchQuery, setTeachersSearchQuery] = useState('')

    const handleTeacherPreviousPage = () => {
        if (currentTeachersPage !== 1) {
            setCurrentTeachersPage((prev) => prev - 1)
        }
    }

    const handleTeacherNextPage = () => {
        if (currentTeachersPage !== Math.ceil(totalTeachers / limit)) {
            setCurrentTeachersPage((prev) => prev + 1)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchUsersByRole('teacher', limit, currentTeachersPage).then((data) => {
            setTeachers(data.users)
            setTotalTeachers(data.total)
            setLoading(false)
        })
        setLoading(false)
    }, [currentTeachersPage, teachersTabActive])

    useEffect(() => {
        if (teachersSearchQuery.length >= 4) {
            fetchUsersByFullNameAndRole(teachersSearchQuery, 'teacher').then((data) => {
                setTeachers(data)
            })
        }
        if (teachersSearchQuery.length === 0) {
            setLoading(true)
            fetchUsersByRole('teacher', limit, currentTeachersPage).then((data) => {
                setTeachers(data.users)
                setTotalTeachers(data.total)
                setLoading(false)
            })
            setLoading(false)
        }
    }, [teachersSearchQuery])

    const [parents, setParents] = useState([])
    const [currentParentsPage, setCurrentParentsPage] = useState(1)
    const [totalParents, setTotalParents] = useState(0)
    const [parentsTabActive, setParentsTabActive] = useState(false)
    const [parentsSearchQuery, setParentsSearchQuery] = useState('')

    const handleParentPreviousPage = () => {
        if (currentParentsPage !== 1) {
            setCurrentParentsPage((prev) => prev - 1)
        }
    }

    const handleParentNextPage = () => {
        if (currentParentsPage !== Math.ceil(totalParents / limit)) {
            setCurrentParentsPage((prev) => prev + 1)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchUsersByRole('parent', limit, currentParentsPage).then((data) => {
            setParents(data.users)
            setTotalParents(data.total)
            setLoading(false)
        })
        setLoading(false)
    }, [currentParentsPage, parentsTabActive])

    useEffect(() => {
        if (parentsSearchQuery.length >= 4) {
            fetchUsersByFullNameAndRole(parentsSearchQuery, 'parent').then((data) => {
                setParents(data)
            })
        }
        if (parentsSearchQuery.length === 0) {
            setLoading(true)
            fetchUsersByRole('parent', limit, currentParentsPage).then((data) => {
                setParents(data.users)
                setTotalParents(data.total)
                setLoading(false)
            })
            setLoading(false)
        }
    }, [parentsSearchQuery])

    const [admins, setAdmins] = useState([])
    const [currentAdminsPage, setCurrentAdminsPage] = useState(1)
    const [totalAdmins, setTotalAdmins] = useState(0)
    const [adminsTabActive, setAdminsTabActive] = useState(false)
    const [adminsSearchQuery, setAdminsSearchQuery] = useState('')

    const handleAdminPreviousPage = () => {
        if (currentAdminsPage !== 1) {
            setCurrentAdminsPage((prev) => prev - 1)
        }
    }

    const handleAdminNextPage = () => {
        if (currentAdminsPage !== Math.ceil(totalAdmins / limit)) {
            setCurrentAdminsPage((prev) => prev + 1)
        }
    }

    useEffect(() => {
        setLoading(true)
        fetchUsersByRole('admin', limit, currentAdminsPage).then((data) => {
            setAdmins(data.users)
            setTotalAdmins(data.total)
            setLoading(false)
        })
        setLoading(false)
    }, [currentAdminsPage, adminsTabActive])

    useEffect(() => {
        if (adminsSearchQuery.length >= 4) {
            fetchUsersByFullNameAndRole(adminsSearchQuery, 'admin').then((data) => {
                setAdmins(data)
            })
        }
        if (adminsSearchQuery.length === 0) {
            setLoading(true)
            fetchUsersByRole('admin', limit, currentAdminsPage).then((data) => {
                setAdmins(data.users)
                setTotalAdmins(data.total)
                setLoading(false)
            })
            setLoading(false)
        }
    }, [adminsSearchQuery])

    const limit = 10

    useEffect(() => {
        switch (activeTab) {
            case 'students':
                setStudentsTabActive(true)
                setTeachersTabActive(false)
                setParentsTabActive(false)
                setAdminsTabActive(false)
                break
            case 'teachers':
                setStudentsTabActive(false)
                setTeachersTabActive(true)
                setParentsTabActive(false)
                setAdminsTabActive(false)
                break
            case 'parents':
                setStudentsTabActive(false)
                setTeachersTabActive(false)
                setParentsTabActive(true)
                setAdminsTabActive(false)
                break
            case 'admins':
                setStudentsTabActive(false)
                setTeachersTabActive(false)
                setParentsTabActive(false)
                setAdminsTabActive(true)
                break
            default:
                break
        }
    }, [activeTab])

    return (
        <main>
            {loading ? (
                <div className='flex min-h-screen flex-col p-6 lg:p-12 mt-20'>
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
                <div className='flex min-h-screen flex-col p-6 lg:p-12'>
                    <div className='flex items-center justify-between mb-12'>
                        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>Користувачі</h1>
                        <AddUserDialog />
                    </div>
                    <Tabs defaultValue='students' value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className='grid w-full grid-cols-4'>
                            <TabsTrigger value='students'>Учні</TabsTrigger>
                            <TabsTrigger value='teachers'>Вчителі</TabsTrigger>
                            <TabsTrigger value='parents'>Батьки</TabsTrigger>
                            <TabsTrigger value='admins'>Адміни</TabsTrigger>
                        </TabsList>
                        <TabsContent value='students'>
                            <div className='grid grid-cols-2 gap-4 mt-4 justify-items-end'>
                                <div>
                                    <Label htmlFor='studentSearch'>
                                        <SearchIcon className='h-10' />
                                    </Label>
                                </div>
                                <div className='w-full flex'>
                                    <Input
                                        className='flex-1 mr-2'
                                        id='studentSearch'
                                        placeholder='Пошук учнів... (мінімум 4 символи)'
                                        value={studentsSearchQuery}
                                        onChange={(e) => {
                                            setStudentsSearchQuery(e.target.value)
                                        }}
                                    />
                                    <Button className='flex-initial' variant='outline' onClick={() => setStudentsSearchQuery('')}>
                                        Очистити
                                    </Button>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4 mt-4'>
                                {students.map((studentItem) => (
                                    <Card
                                        key={studentItem.id}
                                        className='cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out'
                                        onClick={() => {
                                            router.push(`users/${studentItem.id}`)
                                        }}>
                                        <CardHeader>
                                            {studentItem.name} {studentItem.surname} {studentItem.patronymic}
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                            {totalStudents > limit && studentsSearchQuery !== '' && (
                                <Pagination className='mt-4'>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                className='hover:cursor-pointer'
                                                onClick={handleStudentPreviousPage}
                                                disabled={currentStudentsPage === 1}
                                            />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext
                                                className='hover:cursor-pointer'
                                                onClick={handleStudentNextPage}
                                                disabled={currentStudentsPage === Math.ceil(totalStudents / limit)}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </TabsContent>
                        <TabsContent value='teachers'>
                            <div className='grid grid-cols-2 gap-4 mt-4 justify-items-end'>
                                <div>
                                    <Label htmlFor='teacherSearch'>
                                        <SearchIcon className='h-10' />
                                    </Label>
                                </div>
                                <div className='w-full flex'>
                                    <Input
                                        className='flex-1 mr-2'
                                        id='teacherSearch'
                                        placeholder='Пошук вчителів... (мінімум 4 символи)'
                                        value={teachersSearchQuery}
                                        onChange={(e) => {
                                            setTeachersSearchQuery(e.target.value)
                                        }}
                                    />
                                    <Button className='flex-initial' variant='outline' onClick={() => setTeachersSearchQuery('')}>
                                        Очистити
                                    </Button>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4 mt-4'>
                                {teachers.map((teacherItem) => (
                                    <Card
                                        key={teacherItem.id}
                                        className='cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out'
                                        onClick={() => {
                                            router.push(`users/${teacherItem.id}`)
                                        }}>
                                        <CardHeader>
                                            {teacherItem.name} {teacherItem.surname} {teacherItem.patronymic}
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                            {totalTeachers > limit && teachersSearchQuery === '' && (
                                <Pagination className='mt-4'>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                className='hover:cursor-pointer'
                                                onClick={handleTeacherPreviousPage}
                                                disabled={currentTeachersPage === 1}
                                            />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext
                                                className='hover:cursor-pointer'
                                                onClick={handleTeacherNextPage}
                                                disabled={currentTeachersPage === Math.ceil(totalTeachers / limit)}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </TabsContent>
                        <TabsContent value='parents'>
                            <div className='grid grid-cols-2 gap-4 mt-4 justify-items-end'>
                                <div>
                                    <Label htmlFor='parentSearch'>
                                        <SearchIcon className='h-10' />
                                    </Label>
                                </div>
                                <div className='w-full flex'>
                                    <Input
                                        className='flex-1 mr-2'
                                        id='parentSearch'
                                        placeholder='Пошук батьків... (мінімум 4 символи)'
                                        value={parentsSearchQuery}
                                        onChange={(e) => {
                                            setParentsSearchQuery(e.target.value)
                                        }}
                                    />
                                    <Button className='flex-initial' variant='outline' onClick={() => setParentsSearchQuery('')}>
                                        Очистити
                                    </Button>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4 mt-4'>
                                {parents.map((parentItem) => (
                                    <Card
                                        key={parentItem.id}
                                        className='cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out'
                                        onClick={() => {
                                            router.push(`users/${parentItem.id}`)
                                        }}>
                                        <CardHeader>
                                            {parentItem.name} {parentItem.surname} {parentItem.patronymic}
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                            {totalParents > limit && parentsSearchQuery === '' && (
                                <Pagination className='mt-4'>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                className='hover:cursor-pointer'
                                                onClick={handleParentPreviousPage}
                                                disabled={currentParentsPage === 1}
                                            />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext
                                                className='hover:cursor-pointer'
                                                onClick={handleParentNextPage}
                                                disabled={currentParentsPage === Math.ceil(totalParents / limit)}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </TabsContent>
                        <TabsContent value='admins'>
                            <div className='grid grid-cols-2 gap-4 mt-4 justify-items-end'>
                                <div>
                                    <Label htmlFor='adminSearch'>
                                        <SearchIcon className='h-10' />
                                    </Label>
                                </div>
                                <div className='w-full flex'>
                                    <Input
                                        className='flex-1 mr-2'
                                        id='adminSearch'
                                        placeholder='Пошук адмінів... (мінімум 4 символи)'
                                        value={adminsSearchQuery}
                                        onChange={(e) => {
                                            setAdminsSearchQuery(e.target.value)
                                        }}
                                    />
                                    <Button className='flex-initial' variant='outline' onClick={() => setAdminsSearchQuery('')}>
                                        Очистити
                                    </Button>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4 mt-4'>
                                {admins.map((adminItem) => (
                                    <Card
                                        key={adminItem.id}
                                        className='cursor-pointer hover:bg-muted hover:shadow-lg transition-all duration-200 ease-in-out'
                                        onClick={() => {
                                            router.push(`users/${adminItem.id}`)
                                        }}>
                                        <CardHeader>
                                            {adminItem.name} {adminItem.surname} {adminItem.patronymic}
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                            {totalAdmins > limit && adminsSearchQuery === '' && (
                                <Pagination className='mt-4'>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                className='hover:cursor-pointer'
                                                onClick={handleAdminPreviousPage}
                                                disabled={currentAdminsPage === 1}
                                            />
                                        </PaginationItem>
                                        <PaginationItem>
                                            <PaginationNext
                                                className='hover:cursor-pointer'
                                                onClick={handleAdminNextPage}
                                                disabled={currentAdminsPage === Math.ceil(totalAdmins / limit)}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </main>
    )
}
