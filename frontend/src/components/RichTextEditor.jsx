// src/RichTextEditor.jsx
import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import FontSize from 'tiptap-extension-font-size';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import { LineHeight } from '../extensions/LineHeight';

import {
  Bold, Italic, Underline as UnderlineIcon,
  Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Link as LinkIcon
} from 'lucide-react';

const ToolbarButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 border rounded-md flex items-center justify-center text-sm transition 
      ${active ? 'bg-blue-500 text-white border-blue-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
  >
    {children}
  </button>
);

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 border-b pb-3 mb-4">
      {/* Text formatting */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
        <Bold size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
        <Italic size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}>
        <UnderlineIcon size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')}>
        <Strikethrough size={18} />
      </ToolbarButton>

      {/* Text alignment */}
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })}>
        <AlignLeft size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })}>
        <AlignCenter size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })}>
        <AlignRight size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })}>
        <AlignJustify size={18} />
      </ToolbarButton>

      {/* Heading */}
      {[1, 2, 3].map(level => (
        <ToolbarButton
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          active={editor.isActive('heading', { level })}
        >
          <span className="text-sm font-bold">H{level}</span>
        </ToolbarButton>
      ))}

      {/* Font size */}
      <select
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        value={editor.getAttributes('textStyle').fontSize || '16px'}
        className="border text-sm px-2 py-1 rounded bg-white"
      >
        {['12px','14px','16px','18px','20px','24px','32px'].map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>

      {/* Line height */}
      <select
        onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
        value={editor.getAttributes('paragraph').lineHeight || '1.5'}
        className="border text-sm px-2 py-1 rounded bg-white"
      >
        {['1', '1.25', '1.5', '1.75', '2', '2.5', '3'].map(height => (
          <option key={height} value={height}>{height}</option>
        ))}
      </select>

      {/* Lists */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
        <List size={18} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
        <ListOrdered size={18} />
      </ToolbarButton>

      {/* Quote */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}>
        <Quote size={18} />
      </ToolbarButton>

      {/* Link */}
      <ToolbarButton
        onClick={() => {
          const url = window.prompt('Masukkan URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        active={editor.isActive('link')}
      >
        <LinkIcon size={18} />
      </ToolbarButton>
    </div>
  );
};

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      TextStyle,
      FontSize,
      LineHeight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      Link,
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  return (
    <div className="border rounded-md p-4 bg-white shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-full min-h-[200px]" />
    </div>
  );
};

export default RichTextEditor;
