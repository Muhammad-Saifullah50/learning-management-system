'use client'
import { Chapter } from "@prisma/client"
import { useEffect, useState } from "react";
import { Draggable, Droppable, DropResult, DragDropContext } from '@hello-pangea/dnd'
import { cn } from "@/lib/utils";

interface ChapterListProps {
    items: Chapter[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
}
const ChapterList = ({ items, onReorder, onEdit }: ChapterListProps) => {

    const [mounted, setMounted] = useState(false);
    const [chapters, setChapters] = useState<Chapter[]>(items);

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    useEffect(() => {
        setChapters(items)
    }, [items])


    return (
        <DragDropContext
            onDragEnd={() => { }}
        >
            <Droppable droppableId='chapters'>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters.map((chapter, index) => {
                            <Draggable
                                key={chapter.id}
                                draggableId={chapter.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        className={cn("flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm"),
                                            chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                        }
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}>

                                    </div>
                                )}
                            </Draggable>
                        })}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default ChapterList
