import React, { useEffect, useMemo, useState } from 'react'
import { classroomService } from '../../services/classroom.service'
import { useNavigate } from 'react-router-dom';
import type { TableProps, MenuProps } from 'antd';
import { Button, Divider, Dropdown, Flex, Form, Input, Modal, Space, Table } from 'antd';
import LoadingComponent from '../../shared-components/loading-and-skeletons/loading';
import MySelectComponent from '../../shared-components/form/my-select';
import { DeleteOutlined, FormOutlined, InfoCircleOutlined, MoreOutlined } from '@ant-design/icons';

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
  classname: string;
  academicYear: number;
  homeroomTeacher: string;
  action: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [classRooms, setClassRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [form] = Form.useForm();

  const fetchClassroom = (values?: any) => {
    setLoading(true);
    const params = {
      page: page,
      limit: limit,
      ...values,
    }
    classroomService.classroomList(params).then(res => {
      if (res.status) {
        setClassRooms(res.data.list);
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
          setClassRooms([]);
          setTotal(0);
        }
      })
    }).finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    fetchClassroom()

    return () => {
      setClassRooms([]);
      setTotal(0);
    }
  }, [page, limit])

  const onPageSizeChange = (value: string | number) => {
    if (typeof value === 'string') {
      value = parseInt(value);
    }
    setLimit(value);
  }

  const onFilterFinish = (values: any) => {
    fetchClassroom(values);
  }

  const onDeleteStudent = (id: string) => {
    classroomService.deleteClassroom({ id }).then(res => {
        if (res.status) {
            Modal.success({
                title: 'Success',
                content: res.message,
                centered: true,
                afterClose: () => {
                    fetchClassroom();
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
        navigate(`/classroom/detail/${record.key}`);
        break;
      case 'edit':
        navigate(`/classroom/edit/${record.key}`);
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

  const createClassroom = () => {
    navigate('/classroom/create')
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'เลขห้อง',
      dataIndex: 'key',
      key: 'classroomid',
    },
    {
      title: 'ชื่อห้อง',
      dataIndex: 'classname',
      key: 'classname',
    },
    {
      title: 'ปีการศึกษา',
      dataIndex: 'academicYear',
      key: 'academicYear',
    },
    {
      title: 'ชื่อครูประจําชั้น',
      dataIndex: 'homeroomTeacher',
      key: 'homeroomTeacher',
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
  ]

  const renderContent = useMemo(() => {
    if (loading) {
      return <LoadingComponent size='large' />
    } else if (classRooms.length <= 0) {
      return <div>
        <h1> No results </h1>
        <p>There are no classrooms in the database.</p>
      </div>
    } else {
      return <Table columns={columns} dataSource={classRooms} pagination={
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
  }, [classRooms, loading, page, limit, total])

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Flex justify='space-between' align='center'>
          {/* Filter */}
          <Form form={form} name='classrooms_filter' autoComplete="off" layout='inline' onFinish={onFilterFinish}>
            <Form.Item
              label="รหัสห้องเรียน"
              name="classroomId"
              rules={[{ required: false }]}
            >
              <Input placeholder="รหัสห้องเรียน" />
            </Form.Item>
            <Form.Item
              label="ชื่อห้องเรียน"
              name="className"
              rules={[{ required: false }]}
            >
              <Input placeholder="ชื่อห้องเรียน" />
            </Form.Item>
            <Form.Item
              label="ครูประจำชั้น"
              name="homeroomTeacher"
              rules={[{ required: false }]}
            >
              <Input placeholder="ครูประจำชั้น" />
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
          <Button type='primary' onClick={createClassroom}>
            เพิ่มห้องเรียน
          </Button>
        </Flex>

        {renderContent}
      </Space>
    </>
  )
}
