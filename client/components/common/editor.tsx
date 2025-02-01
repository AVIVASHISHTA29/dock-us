"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import Heading, { Level } from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Strikethrough,
  UnderlineIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          "text-primary prose-sm min-h-[150px] max-h-[150px] w-full rounded-md rounded-br-none rounded-bl-none border border-input bg-transparent px-3 py-2 border-b-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
      },
    },
    extensions: [
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "font-bold text-primary",
        },
      }),
      Underline,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <>
      <EditorContent editor={editor} />
      {editor ? <RichTextEditorToolbar editor={editor} /> : null}
    </>
  );
};

const HEADING_OPTIONS = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Title", value: "h1" },
  { label: "Heading", value: "h2" },
  { label: "Subheading", value: "h3" },
];

const RichTextEditorToolbar = ({ editor }: { editor: Editor }) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);

  const getCurrentHeadingValue = () => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) {
        return `h${i}`;
      }
    }
    return "paragraph";
  };

  const handleHeadingChange = (value: string) => {
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value.replace("h", ""));
      editor
        .chain()
        .focus()
        .toggleHeading({ level: level as Level })
        .run();
    }
  };

  const handleLinkSubmit = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkPopoverOpen(false);
      return;
    }

    const httpUrl =
      linkUrl.startsWith("http://") || linkUrl.startsWith("https://")
        ? linkUrl
        : `http://${linkUrl}`;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: httpUrl })
      .run();

    setLinkPopoverOpen(false);
    setLinkUrl("");
  };

  const openLinkPopover = () => {
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setLinkPopoverOpen(true);
  };

  return (
    <div className="border border-input bg-transparent rounded-br-md rounded-bl-md p-1 flex flex-row items-center gap-1">
      <Select
        value={getCurrentHeadingValue()}
        onValueChange={handleHeadingChange}
      >
        <SelectTrigger className="w-[130px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {HEADING_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="w-[1px] h-8" />
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="w-[1px] h-8" />
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="w-[1px] h-8" />
      <Popover open={linkPopoverOpen} onOpenChange={setLinkPopoverOpen}>
        <PopoverTrigger asChild>
          <Toggle
            size="sm"
            pressed={editor.isActive("link")}
            onPressedChange={openLinkPopover}
          >
            <LinkIcon className="h-4 w-4" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" className="mt-2">
          <div className="flex flex-col gap-2 p-2">
            <h1 className="text-sm font-medium">Link</h1>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLinkSubmit();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLinkPopoverOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleLinkSubmit}>
                Save
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RichTextEditor;
