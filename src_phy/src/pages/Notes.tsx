import { useState } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { ChevronLeft, ChevronRight, Home, Bold, Italic, List, Heading} from "lucide-react";
import { Link } from "react-router";
import { useStore } from "../store/useStore";

export default function Notes() {
  const { subject } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentFile, setCurrentFile] = useState("notes_1.md");

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: `
      <h2>My Notes</h2>
      <p>Start typing here...</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none',
      },
    },
  });

  const dummyFiles = ["notes_1.md", "notes_2.md", "notes_3.md"];

  return (
    <div className={`flex h-screen bg-background text-foreground theme-${subject}`}>
      {sidebarOpen && (
        <div className="w-48 bg-card border-r border-border flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <h2 className="text-sm font-semibold">My Notes</h2>
            <button onClick={() => setSidebarOpen(false)} className="opacity-70 hover:opacity-100">
              <ChevronLeft size={20}/>
            </button>
          </div>
          <div className="flex-1 p-2 overflow-auto">
            {dummyFiles.map((f) => (
              <button
                key={f}
                className={`block w-full text-left text-sm py-1 px-2 rounded hover:bg-muted ${
                  currentFile === f ? "bg-muted" : ""
                }`}
                onClick={() => setCurrentFile(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col relative">
        <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)} 
                className="bg-card rounded hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <ChevronRight size={20}/>
              </button>
            )}

            <Link to="/" className="bg-card rounded px-1 py-1 text-xs hover:bg-accent hover:text-accent-foreground transition-colors">
              <Home size={16} />
            </Link>

            <h1 className="font-semibold text-sm opacity-90">{currentFile}</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="border-b border-border p-2 flex gap-2 bg-card">
            {/* buttons for text heading, bold, italics and more*/}
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-secondary ${editor?.isActive('bold') ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-secondary ${editor?.isActive('italic') ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-secondary ${editor?.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Heading size={16} />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-secondary ${editor?.isActive('bulletList') ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <List size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <EditorContent editor={editor} className="prose prose-invert min-h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}