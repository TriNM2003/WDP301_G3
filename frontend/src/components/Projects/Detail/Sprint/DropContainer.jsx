import { useDroppable } from '@dnd-kit/core';
import React from 'react'

const DropContainer = ({ id, children }) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: { sprint: { _id: id } }, // để truyền sprint id khi over
    });

    return (
        <div ref={setNodeRef}
            style={{
                minHeight: 50,
                border: isOver ? '2px dashed #1890ff' : '',
                transition: 'border 0.2s ease',
                padding: '4px', 
            }}>
            {children}
        </div>
    );
}

export default DropContainer
