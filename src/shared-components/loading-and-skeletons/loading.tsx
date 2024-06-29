import { Flex, Spin, Alert } from 'antd';
import React from 'react'

//#region setup variables
const contentStyle: React.CSSProperties = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
};

const content = <div style={contentStyle} />;
//#endregion

interface LoadingComponentProps {
    size?: 'small' | 'default' | 'large';
}

export default function LoadingComponent({ size }: LoadingComponentProps) {
    return (
        <Flex gap="small" vertical align='center'>
            <Flex gap="small">
                <Spin tip="Loading" size={size}>{content}</Spin>
            </Flex>
        </Flex>
    )
}
