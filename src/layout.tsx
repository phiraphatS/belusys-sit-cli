import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

// const items = new Array(15).fill(null).map((_, index) => ({
//     key: index + 1,
//     label: `nav ${index + 1}`,
// }));

const items = [
    {
        key: '1',
        label: 'Home',
        path: '/',
    },
    {
        key: '2',
        label: 'Students',
        path: '/students',
    },
]

type ProjLayoutProps = {
    children: React.ReactNode;
};

const ProjLayout: React.FC<ProjLayoutProps> = ({ children }) => {
    const location = useLocation();
    const currentPath = location.pathname.slice(1);
    const selectedKey = items.find((item) => item.label.toLowerCase() === currentPath)?.key;
    const navigate = useNavigate();

    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const onMenuClick = (item: any) => {
        const { key } = item;
        const path = items.find((item) => item.key === key)?.path;
        
        if (path) {
            navigate(path);
        }
    }

    const BreadcrumbEl = React.useMemo(() => {
        const pathNameArr = location.pathname.split('/').filter(Boolean);

        const items = pathNameArr.map((pathName, index) => {
            const url = `/${pathNameArr.slice(0, index + 1).join('/')}`;
            return {
                key: url,
                title: pathName,
            };
        });

        const addPrefix = [
            {
                key: '/',
                title: 'Home',
            },
            ...items,
        ]

        return (
            <Breadcrumb style={{ margin: '16px 0' }} items={addPrefix}/>
        );
    }, [location.pathname]);

    return (
        <Layout style={{ minHeight: '100vh'}}>
            <Header style={{ 
                display: 'flex', 
                alignItems: 'center',
            }}>
                <Menu
                    mode="horizontal"
                    selectedKeys={selectedKey ? [selectedKey.toString()] : ['1']}
                    items={items}
                    style={{ flex: 1, minWidth: 0}}
                    onClick={onMenuClick}
                />
            </Header>
            <Content style={{ padding: '0 48px' }}>
                { BreadcrumbEl }
                {/* <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb> */}
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                {/* Ant Design ©{new Date().getFullYear()} Created by Ant UED */}
            </Footer>
        </Layout>
    );
};

export default ProjLayout;