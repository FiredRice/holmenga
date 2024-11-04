import React, { useEffect, useRef, useState } from 'react';
import { Input, InputRef, message } from 'antd';
import './style/index.less';

interface IEditableCellProps {
    onSave?: (value: number) => void;
    children: number;
}

const EditableCell: React.FC<IEditableCellProps> = (props) => {

    const { children, onSave, ...otherProps } = props;

    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    function toggleEdit() {
        setEditing(!editing);
    }

    function save(e: any) {
        const v = parseInt(e?.target?.value);
        if (isNaN(v)) {
            message.warning('请输入数字');
            return;
        }
        toggleEdit();
        if (v === children) {
            return;
        }
        onSave?.(v);
    }

    return editing ? (
        <Input
            ref={inputRef}
            placeholder={`${children}`}
            onPressEnter={save}
            onBlur={save}
        />
    ) : (
        <div
            className='editable-cell-value-wrap'
            style={{ paddingInlineEnd: 24 }}
            onClick={toggleEdit}
        >
            {children}
        </div>
    );
};

export default EditableCell;