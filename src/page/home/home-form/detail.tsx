import { Button, DatePicker, Form, Input, InputNumber, Select, Modal, Typography, Image, Divider, Table, Flex, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra'
import { classroomService } from '../../../services/classroom.service';
import type { TableProps, MenuProps } from 'antd';
import LoadingComponent from '../../../shared-components/loading-and-skeletons/loading';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

// dayjs.extend(buddhistEra);

const { Title } = Typography;

const pageSizeOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 25, label: '25' },
    { value: 30, label: '30' },
];

interface DataType {
    key: string;
    fullname: string;
    levelName: number;
    birthDate: string;
    gender: string;
    action: string;
}

export default function HomeFormComponent() {
    const params = useParams();
    const location = useLocation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [loadingStudent, setLoadingStudent] = useState(true);
    const [loadingStudentNotInClassroom, setLoadingStudentNotInClassroom] = useState(true);
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [studentNotInClassroom, setStudentNotInClassroom] = useState([]);
    const [studentNotInClassroomTotal, setStudentNotInClassroomTotal] = useState(0);
    const [studentNotInClassroomPage, setStudentNotInClassroomPage] = useState(1);
    const [studentNotInClassroomLimit, setStudentNotInClassroomLimit] = useState(5);

    const key = params.classroomid;
    const typeOfComponent = useMemo(() => {
        // view, edit or create
        const pathName = location.pathname;
        if (pathName.includes('detail')) return 'view';
        if (pathName.includes('edit')) return 'edit';
        return 'create';
    }, [location.pathname])

    const readOnlyObj = useMemo(() => {
        const readOnly = typeOfComponent === 'view' ? true : false;
        return { readOnly: readOnly, inputReadOnly: readOnly }
    }, [typeOfComponent]);

    const fetchClassroom = async () => {
        setLoading(true);
        classroomService.getClassroom({ id: key }).then((res) => {
            if (res.status && res.data) {
                const formattedData = { ...res.data, academicYear: res.data.academicYear ? dayjs(res.data.academicYear) : null }
                form.setFieldsValue(formattedData)
            } else {
                throw new Error(res.message);
            }
        }).catch((error) => {
            Modal.error({
                title: 'Error',
                content: error.message,
                centered: true,
                afterClose: () => {
                    form.resetFields();
                }
            });
        }).finally(() => setLoading(false));
    };

    const fetchStudentsInClassRoom = () => {
        setLoadingStudent(true);
        const params = {
            id: key,
            page: page,
            limit: limit,
        }
        classroomService.getStudentInClassroom(params).then(res => {
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
            });
        }).finally(() => setLoadingStudent(false));
    }

    const fetchStudentsNotInClassRoom = () => {
        setLoadingStudentNotInClassroom(true);
        const params = {
            id: key,
            page: studentNotInClassroomPage,
            limit: studentNotInClassroomLimit,
        }
        classroomService.getStudentNotInClassroom(params).then(res => {
            if (res.status) {
                setStudentNotInClassroom(res.data.list);
                setStudentNotInClassroomTotal(res.data.total);
            } else {
                throw new Error(res.message);
            }
        }).catch(err => {
            Modal.error({
                title: 'Error',
                content: err.message,
                centered: true,
                afterClose: () => {
                    setStudentNotInClassroom([]);
                    setStudentNotInClassroomTotal(0);
                }
            });
        }).finally(() => setLoadingStudentNotInClassroom(false));
    }

    const updateClassroom = (values: any) => {
        setLoading(true);
        const parseAcademicYear = { ...values, academicYear: values.academicYear.format('YYYY') };
        classroomService.updateClassroom({ id: key, ...parseAcademicYear }).then((res) => {
            if (res.status) {
                Modal.success({
                    title: 'Success',
                    content: 'Update student successfully',
                    centered: true,
                    afterClose: () => {
                        window.history.back();
                    }
                });
            } else {
                throw new Error(res.message);
            }
        }).catch((error) => {
            Modal.error({
                title: 'Error',
                content: error.message,
                centered: true,
            });
        }).finally(() => setLoading(false));
    }

    const createClassroom = (values: any) => {
        setLoading(true);
        const parseAcademicYear = { ...values, academicYear: values.academicYear.format('YYYY') };
        classroomService.createClassroom(parseAcademicYear).then((res) => {
            if (res.status) {
                Modal.success({
                    title: 'Success',
                    content: 'Create student successfully',
                    centered: true,
                    afterClose: () => {
                        window.history.back();
                    }
                });
            } else {
                throw new Error(res.message);
            }
        }).catch((error) => {
            Modal.error({
                title: 'Error',
                content: error.message,
                centered: true,
            });
        }).finally(() => setLoading(false));
    }

    const onFormFinish = (values: any) => {
        if (typeOfComponent === 'create') {
            createClassroom(values);
        } else {
            updateClassroom(values);
        }
    }

    useEffect(() => {
        if (typeOfComponent === 'create') {
            setLoading(false);
            return;
        };
        fetchClassroom();

        return () => { }
    }, []);

    useEffect(() => {
        fetchStudentsInClassRoom()

        return () => {
            setStudents([]);
            setTotal(0);
        }
    }, [page, limit])

    useEffect(() => {
        fetchStudentsNotInClassRoom()

        return () => {
            setStudentNotInClassroom([]);
            setStudentNotInClassroomTotal(0);
        }
    },[studentNotInClassroomPage, studentNotInClassroomLimit])

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
        }
    ];

    const removeStudentFromClassroom = (studentId: string) => {
        Modal.confirm({
            title: 'Are you sure?',
            content: 'Do you want to delete this student?',
            centered: true,
            okType: 'danger',
            onOk: () => {
                classroomService.removeStudentFromClassroom({ studentId: studentId, classroomId: key }).then(res => {
                    if (res.status) {
                        Modal.success({
                            title: 'Success',
                            content: 'Remove student from classroom successfully',
                            centered: true,
                            afterClose: () => {
                                fetchStudentsInClassRoom();
                                fetchStudentsNotInClassRoom();
                            }
                        });
                    } else {
                        throw new Error(res.message);
                    }
                }).catch(err => {
                    Modal.error({
                        title: 'Error',
                        content: err.message,
                        centered: true,
                    });
                });
            },
        });
    }

    const columnsStudentInClassroom: TableProps<DataType>['columns'] = [
        ...columns,
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    danger 
                    shape="circle" 
                    type='primary' 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeStudentFromClassroom(record.key)}
                />
            ),
        }
    ]

    const columnsStudentNotInClassroom: TableProps<DataType>['columns'] = [
        ...columns,
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    shape="circle" 
                    type='primary' 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                        classroomService.addStudentToClassroom({ studentId: record.key, classroomId: key }).then(res => {
                            if (res.status) {
                                Modal.success({
                                    title: 'Success',
                                    content: 'Add student to classroom successfully',
                                    centered: true,
                                    afterClose: () => {
                                        fetchStudentsInClassRoom();
                                        fetchStudentsNotInClassRoom();
                                    }
                                });
                            } else {
                                throw new Error(res.message);
                            }
                        }).catch(err => {
                            Modal.error({
                                title: 'Error',
                                content: err.message,
                                centered: true,
                            });
                        });
                    }}
                />
            ),
        }
    ]

    const renderContent = useMemo(() => {
        if (loadingStudent) {
            return <LoadingComponent size='large' />
        } else if (students.length <= 0) {
            return <div>
                <h1> No results </h1>
                <p>There are no students in the database.</p>
            </div>
        } else {
            return <Table columns={columnsStudentInClassroom} dataSource={students} pagination={
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
    }, [students, loadingStudent, page, limit, total])

    const renderStudentNotInClassroom = useMemo(() => {
        if (loadingStudentNotInClassroom) {
            return <LoadingComponent size='large' />
        } else if (studentNotInClassroom.length <= 0) {
            return <div>
                <h1> No results </h1>
                <p>There are no students in the database.</p>
            </div>
        } else {
            return <Table columns={columnsStudentNotInClassroom} dataSource={studentNotInClassroom} pagination={
                {
                    current: studentNotInClassroomPage,
                    pageSize: studentNotInClassroomLimit,
                    total: studentNotInClassroomTotal,
                    onChange: (page, pageSize) => {
                        setStudentNotInClassroomPage(page);
                        setStudentNotInClassroomLimit(pageSize);
                    }
                }
            } />
        }
    }, [studentNotInClassroom, loadingStudentNotInClassroom, studentNotInClassroomPage, studentNotInClassroomLimit, studentNotInClassroomTotal])
    return (
        <>
            <div style={{ position: 'relative' }}>
                <Title
                    level={1}
                    style={{
                        position: 'absolute',
                        zIndex: '2',
                        top: '40%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        textTransform: 'uppercase',
                    }}
                >
                    {`${typeOfComponent === 'view' ? 'ดูข้อมูล' : typeOfComponent === 'edit' ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'}ห้องเรียน`}
                </Title>
                <Image
                    width={'100%'}
                    height={200}
                    preview={false}
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center -24rem',
                        filter: 'brightness(50%)',
                    }}
                    src="/assets/images/student-detail-page.jpg"
                />
            </div>
            <Form
                name="classroom_detail"
                form={form}
                labelCol={{ span: 8 }}
                style={{ paddingTop: '20px' }}
                disabled={loading}
                onFinish={onFormFinish}
                autoComplete='off'
            >
                <Form.Item
                    label="รหัสห้องเรียน"
                    name="classroomId"
                    wrapperCol={{ span: 6 }}
                    rules={[{ required: typeOfComponent !== 'create', message: 'กรุณากรอกรหัสห้องเรียน' }]}
                >
                    <Input {...readOnlyObj} disabled={typeOfComponent === 'create'} />
                </Form.Item>

                <Form.Item
                    label="ชื่อห้องเรียน"
                    name="className"
                    wrapperCol={{ span: 8 }}
                    rules={[{ required: true, message: 'กรุณากรอกชื่อห้องเรียน' }]}>
                    <Input {...readOnlyObj} />
                </Form.Item>

                <Form.Item
                    label="ปีการศึกษา"
                    name="academicYear"
                    wrapperCol={{ span: 4 }}
                    rules={[{ required: true, message: 'กรุณาใส่ปีการศึกษา' }]}>
                    <DatePicker {...readOnlyObj} picker="year" format={'YYYY'} />
                </Form.Item>

                <Form.Item
                    label="ครูประจำชั้น"
                    name="homeroomTeacher"
                    wrapperCol={{ span: 8 }}
                    rules={[{ required: true, message: 'กรุณากรอกครูประจำชั้น' }]}>
                    <Input {...readOnlyObj} />
                </Form.Item>

                {(typeOfComponent === 'create' || typeOfComponent === 'edit') && (
                    <Form.Item label=' ' wrapperCol={{ span: 4 }} colon={false}>
                        <Button htmlType='submit' type='primary'> ยืนยันแก้ไข </Button>
                    </Form.Item>
                )}
            </Form>
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4}>นักเรียนในห้องเรียน</Title>
                {renderContent}
            </Space>
            <Divider />
            <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4}>นักเรียนที่ยังไม่มีห้องเรียน</Title>
                {renderStudentNotInClassroom}
            </Space>
            <Image
                width={'100%'}
                height={200}
                preview={false}
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center -24rem',
                    filter: 'brightness(50%)',
                }}
                src="/assets/images/footer-image.jpg"
            />
        </>
    )
}
