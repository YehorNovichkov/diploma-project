'use client'

import BulletList from '@tiptap/extension-bullet-list'
import Heading from '@tiptap/extension-heading'
import OrderedList from '@tiptap/extension-ordered-list'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import ToolBar from './toolbar'

export default function Tiptap({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: false,
                orderedList: false,
            }),
            Heading.configure({
                HTMLAttributes: {
                    class: 'text-4xl font-bold',
                    levels: [1],
                },
            }),
            BulletList.configure({
                HTMLAttributes: {
                    class: 'list-disc list-outside ml-4',
                },
            }),
            OrderedList.configure({
                HTMLAttributes: {
                    class: 'list-decimal list-outside ml-4',
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'rounded-md border min-h-[200px] border-input p-4',
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    })
    return (
        <div className='flex flex-col justify-stretch min-h-[250px]'>
            <ToolBar editor={editor} />
            <EditorContent editor={editor} className='mt-2' />
        </div>
    )
}
