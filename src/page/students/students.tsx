import React, { useEffect, useMemo, useState } from 'react';
import { studentsService } from '../../services/student.service';
import { Button, Divider, Dropdown, Flex, Form, Input, Modal, Select, Skeleton, Space, Table } from 'antd';
import type { TableProps, MenuProps } from 'antd';
import LoadingComponent from '../../shared-components/loading-and-skeletons/loading';
import MySelectComponent from '../../shared-components/form/my-select';
import { DeleteOutlined, FormOutlined, InfoCircleOutlined, MoreOutlined } from '@ant-design/icons';
import ModalDetailComponent from './student-form/detail';
import { useNavigate } from 'react-router-dom';

//#region setup options
const pageSizeOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 25, label: '25' },
    { value: 30, label: '30' },
];

const items: MenuProps['items'] = [
    {
        label: 'ดูข้อมูล',
        key: 'view',
        icon: <InfoCircleOutlined />,
    },
    {
        label: 'แก้ไข',
        key: 'edit',
        icon: <FormOutlined />,
    },
    {
        label: 'ลบ',
        key: 'delete',
        danger: true,
        icon: <DeleteOutlined />,
    },
];
//#endregion

interface DataType {
    key: string;
    fullname: string;
    levelName: number;
    birthDate: string;
    gender: string;
    action: string;
}

const Students = () => {
    //#region Hooks
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [form] = Form.useForm();
    //#endregion

    useEffect(() => {
        fetchStudents()

        return () => {
            setStudents([]);
            setTotal(0);
        }
    }, [page, limit])

    const onPageSizeChange = (value: string | number) => {
        if (typeof value === 'string') {
            value = parseInt(value);
        }
        setLimit(value);
    }

    const fetchStudents = (values?: any) => {
        setLoading(true);
        const params = {
            page: page,
            limit: limit,
            ...values,
        }
        studentsService.studentList(params).then(res => {
            if (res.status) {
                setStudents(res.data.list);
                setTotal(res.data.total);
            } else {
                throw new Error(res.message);
            }
        }).catch(err => {
            Modal.error({
                title: 'Error',
                content: err.message,
                centered: true,
                afterClose: () => {
                    setStudents([]);
                    setTotal(0);
                }
            })
        }).finally(() => {
            setLoading(false);
        });
    }

    const onFilterFinish = (values: any) => {
        fetchStudents(values);
    }

    const onDeleteStudent = (id: string) => {
        studentsService.deleteStudent({ id }).then(res => {
            if (res.status) {
                Modal.success({
                    title: 'Success',
                    content: res.message,
                    centered: true,
                    afterClose: () => {
                        fetchStudents();
                    }
                })
            } else {
                throw new Error(res.message);
            }
        }).catch(err => {
            Modal.error({
                title: 'Error',
                content: err.message,
                centered: true,
            })
        });
    }

    const onDropdownAction = (e: any, record: DataType) => {
        switch (e.key) {
            case 'view':
                navigate(`/students/detail/${record.key}`);
                break;
            case 'edit':
                navigate(`/students/edit/${record.key}`);
                break
            case 'delete':
                Modal.confirm({
                    title: 'Are you sure?',
                    content: 'Do you want to delete this student?',
                    centered: true,
                    okType: 'danger',
                    onOk: () => onDeleteStudent(record.key),
                });
                break;
            default: break;
        }
    }

    const createStudent = () => {
        navigate('/students/create');
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'รหัสนักเรียน',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'ชื่อ-สกุล',
            dataIndex: 'fullname',
            key: 'fullName',
        },
        {
            title: 'ระดับชั้น',
            dataIndex: 'levelName',
            key: 'levelName',
        },
        {
            title: 'วัน/เดือน/ปีเกิด',
            dataIndex: 'birthdate',
            key: 'birthDate',
            render: (text) => {
                return new Date(text).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                });
            }
        },
        {
            title: 'เพศ',
            dataIndex: 'genderName',
            key: 'gender',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <Dropdown menu={{ items, onClick: (e) => onDropdownAction(e, record) }} trigger={['click']}>
                    <Button shape="circle" icon={<MoreOutlined />} />
                </Dropdown>
            )
        },
    ];

    const renderContent = useMemo(() => {
        if (loading) {
            return <LoadingComponent size='large' />
        } else if (students.length <= 0) {
            return <div>
                <h1> No results </h1>
                <p>There are no students in the database.</p>
            </div>
        } else {
            return <Table columns={columns} dataSource={students} pagination={
                {
                    current: page,
                    pageSize: limit,
                    total: total,
                    onChange: (page, pageSize) => {
                        setPage(page);
                        setLimit(pageSize);
                    }
                }
            } />
        }
    }, [students, loading, page, limit, total])

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Flex justify='space-between' align='center'>
                    {/* Filter */}
                    <Form form={form} name='students_filter' autoComplete="off" layout='inline' onFinish={onFilterFinish}>
                        <Form.Item
                            label="รหัสนักเรียน"
                            name="studentId"
                            rules={[{ required: false }]}
                        >
                            <Input placeholder="รหัสนักเรียน" />
                        </Form.Item>
                        <Form.Item
                            label="ชื่อ-สกุล"
                            name="fullname"
                            rules={[{ required: false }]}
                        >
                            <Input placeholder="ชื่อหรือนามสกุล" />
                        </Form.Item>
                        <Form.Item
                            label="ระดับชั้น"
                            name="gradeLevel"
                            rules={[{ required: false }]}
                        >
                            <Input placeholder="ระดับชั้น" />
                        </Form.Item>

                        <Button htmlType='submit' type='primary'>
                            ค้นหา
                        </Button>
                    </Form>
                    <MySelectComponent
                        options={pageSizeOptions}
                        defaultValue={limit}
                        onChange={onPageSizeChange}
                    />
                </Flex>
                <Divider />
                <Flex justify='end'>
                    <Button type='primary' onClick={createStudent}>
                        เพิ่มนักเรียน
                    </Button>
                </Flex>

                {renderContent}

            </Space>
        </>
    );
};

export default Students;