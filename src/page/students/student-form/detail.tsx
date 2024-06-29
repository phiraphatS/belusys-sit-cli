import { Button, DatePicker, Form, Input, InputNumber, Select, Modal, Typography, Image } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { studentsService } from '../../../services/student.service';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra'

// dayjs.extend(buddhistEra);

const { Title } = Typography;

export default function StudentDetailComponent() {
    const params = useParams();
    const location = useLocation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    const key = params.studentid;
    const typeOfComponent = useMemo(() => {
        // view, edit or create
        const pathName = location.pathname;
        if (pathName.includes('detail')) return 'view';
        if (pathName.includes('edit')) return 'edit';
        return 'create';
    }, [location.pathname])

    const readOnlyObj = useMemo(() => {
        const readOnly = typeOfComponent === 'view' ? true : false;
        return { readOnly: readOnly, inputReadOnly: readOnly}
    }, [typeOfComponent]);

    const fetchStudent = async () => {
        setLoading(true);
        studentsService.getStudent({ id: key }).then((res) => {
            if (res.status && res.data) {
                const formattedData = { ...res.data, birthDate: res.data.birthDate ? dayjs(res.data.birthDate) : null }
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

    const updateStudent = (values: any) => {
        setLoading(true);
        const formattedData = { ...values, birthDate: values.birthDate.format('YYYY-MM-DD')};
        studentsService.updateStudent({ id: key, ...formattedData }).then((res) => {
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

    const createStudent = (values: any) => {
        setLoading(true);
        const formattedData = { ...values, birthDate: values.birthDate.format('YYYY-MM-DD')};
        studentsService.createStudent(formattedData).then((res) => {
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
            createStudent(values);
        } else {
            updateStudent(values);
        }
    }

    useEffect(() => {
        if (typeOfComponent === 'create') {
            setLoading(false);
            return;
        };
        fetchStudent();

        return () => {}
    }, []);

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
                    { `${typeOfComponent === 'view' ? 'ดูข้อมูล' : typeOfComponent === 'edit' ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'}นักเรียน`}
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
                name="student_detail"
                form={form}
                labelCol={{ span: 8 }}
                style={{ paddingTop: '20px' }}
                disabled={loading}
                onFinish={onFormFinish}
                autoComplete='off'
            >
                <Form.Item
                    label="รหัสนักเรียน"
                    name="studentId"
                    wrapperCol={{ span: 6 }}
                    rules={[{ required: typeOfComponent !== 'create', message: 'กรุณากรอกรหัสนักเรียน' }]}
                >
                    <Input {...readOnlyObj} disabled={typeOfComponent === 'create'}/>
                </Form.Item>

                <Form.Item
                    label="คำนำหน้า"
                    name="prefixId"
                    wrapperCol={{ span: 4 }}
                    rules={[{ required: true, message: 'กรุณาเลือกคำนำหน้า' }]}>
                    <Select
                        {...readOnlyObj}
                        style={{ textAlign: 'left' }}
                        options={[
                            { label: 'เด็กชาย', value: 1 },
                            { label: 'เด็กหญิง', value: 2 },
                            { label: 'นาย', value: 3 },
                            { label: 'นางสาว', value: 4 },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="ชื่อ"
                    name="firstName"
                    wrapperCol={{ span: 8 }}
                    rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}>
                    <Input {...readOnlyObj} />
                </Form.Item>

                <Form.Item
                    label="นามสกุล"
                    name="lastName"
                    wrapperCol={{ span: 8 }}
                    rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}>
                    <Input {...readOnlyObj} />
                </Form.Item>

                <Form.Item
                    label="ระดับชั้น"
                    name="gradeLevelId"
                    wrapperCol={{ span: 4 }}
                    rules={[{ required: true, message: 'กรุณาเลือกระดับชั้น' }]}>
                    <Select
                        {...readOnlyObj}
                        style={{ textAlign: 'left' }}
                        options={[
                            { label: 'ป.1', value: 1 },
                            { label: 'ป.2', value: 2 },
                            { label: 'ป.3', value: 3 },
                            { label: 'ป.4', value: 4 },
                            { label: 'ป.5', value: 5 },
                            { label: 'ป.6', value: 6 },
                            { label: 'ม.1', value: 7 },
                            { label: 'ม.2', value: 8 },
                            { label: 'ม.3', value: 9 },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="เพศ"
                    name="genderId"
                    wrapperCol={{ span: 2 }}
                    rules={[{ required: true, message: 'กรุณาเลือกเพศ' }]}>
                    <Select
                        {...readOnlyObj}
                        style={{ textAlign: 'left' }}
                        options={[
                            { label: 'ชาย', value: 1 },
                            { label: 'หญิง', value: 2 },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="วัน/เดือน/ปี เกิด"
                    name="birthDate"
                    wrapperCol={{ span: 4 }}
                    rules={[{ required: true, message: 'กรุณาใส่วันเกิด' }]}>
                    <DatePicker {...readOnlyObj} format={'DD/MM/YYYY'} />
                </Form.Item>

                { (typeOfComponent === 'create' || typeOfComponent === 'edit') && (
                    <Form.Item label=' ' wrapperCol={{ span: 4 }} colon={false}>
                        <Button htmlType='submit' type='primary'> ยืนยันแก้ไข </Button>
                    </Form.Item>
                )}
            </Form>
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
