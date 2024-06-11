import { Bold, Heading1, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'
import { Toggle } from './toggle'

export default function ToolBar({ editor }) {
    if (!editor) return null

    return (
        <div className='flex border border-input bg-transparent rounded-md p-1'>
            <Toggle size='sm' pressed={editor.isActive('heading')} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                <Heading1 className='h-4 w-4' />
            </Toggle>
            <Toggle size='sm' pressed={editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()}>
                <Bold className='h-4 w-4' />
            </Toggle>
            <Toggle size='sm' pressed={editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()}>
                <Italic className='h-4 w-4' />
            </Toggle>
            <Toggle size='sm' pressed={editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()}>
                <Strikethrough className='h-4 w-4' />
            </Toggle>
            <Toggle size='sm' pressed={editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()}>
                <List className='h-4 w-4' />
            </Toggle>
            <Toggle size='sm' pressed={editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered className='h-4 w-4' />
            </Toggle>
        </div>
    )
}
