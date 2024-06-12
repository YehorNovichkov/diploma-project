import { fetchTaskAnswerCommentsByTaskAnswer } from '@/api/taskAnswerCommentsAPI'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { useAppContext } from '../context/appWrapper'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

export default function Comments({ taskAnswerId }) {
    const { userStore } = useAppContext()
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const commentRef = useRef()
    const commentsEndRef = useRef(null)

    useEffect(() => {
        fetchTaskAnswerCommentsByTaskAnswer(taskAnswerId)
            .then((data) => {
                setComments(data)
            })
            .catch((error) => {
                console.error('Error fetching comments:', error)
            })

        socket.emit('joinRoom', taskAnswerId)

        socket.on('comment', (comment) => {
            setComments((prevComments) => [...prevComments, comment])
        })

        return () => {
            socket.off('comment')
            socket.emit('leaveRoom', taskAnswerId)
        }
    }, [taskAnswerId])

    useEffect(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [comments])

    const handleCommentSubmit = (e) => {
        e.preventDefault()

        const comment = {
            taskAnswerId,
            text: newComment,
            author: userStore.user,
        }

        socket.emit('newComment', comment)
        setNewComment('')
    }

    return (
        <div className='w-full mx-auto space-y-4'>
            <Card>
                <CardHeader>
                    <CardTitle>Коментарі</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className='space-y-4 h-[300px] w-full'>
                        {comments.length === 0 && <p className='text-center text-muted'>Немає коментарів</p>}
                        {comments.map((comment) => (
                            <div key={comment.id} className='flex items-start space-x-3 mb-2'>
                                <Avatar className='w-8 h-8 rounded-full'>
                                    <AvatarFallback>
                                        {comment.author.name.charAt(0)}
                                        {comment.author.surname.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='flex-1'>
                                    <div className='flex items-center justify-between align-middle'>
                                        <h3 className='text-muted-foreground'>
                                            {comment.author.name} {comment.author.surname} {comment.author.patronymic}
                                        </h3>
                                        <p className='text-muted-foreground text-xs mr-3'>
                                            {format(toZonedTime(new Date(comment.createdAt), 'Europe/Kyiv'), 'dd.MM.yy HH:mm')}
                                        </p>
                                    </div>
                                    <p>{comment.text}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={commentsEndRef} />
                    </ScrollArea>
                </CardContent>
            </Card>
            <form onSubmit={handleCommentSubmit}>
                <div className='flex space-x-4'>
                    <Input
                        ref={commentRef}
                        type='text'
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder='Ваш коментар...'
                        className='flex-1 h-12'
                    />
                    <Button type='submit' className='h-12'>
                        <Send className='h-6 w-6' />
                    </Button>
                </div>
            </form>
        </div>
    )
}
