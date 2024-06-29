import { Select } from 'antd'
import React from 'react'

interface MySelectComponentProps {
    options: { value: string | number, label: string }[]
    defaultValue?: string | number
    onChange?: (value: string | number) => void
}

export default function MySelectComponent({ options, defaultValue, onChange }: MySelectComponentProps) {
    return (
        <Select
            // showSearch
            placeholder="ตัวเลือก"
            defaultValue={defaultValue}
            filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={options}
            onChange={onChange}
        />
    )
}
