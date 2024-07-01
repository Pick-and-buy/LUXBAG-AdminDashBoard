import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, theme } from 'antd';

const InputSearch = (props) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 10,
    };

    const onFinish = (values) => {
        console.log('Received values of form: ', values);

        let query = "";

        if (values.name) {
            // query += `&name=/${values.name}/i`;
        }
        //Nếu điền dữ liệu thì mới query data còn ko thì sẽ ko trả về cái gì
        if (query) {
            props.handleSearchProps(query);
        }
    };

    return (
        <Form
            form={form}
            name="advanced_search"
            style={formStyle} onFinish={onFinish}
        >
            <Row gutter={24}>
                <Col span={8}>

                </Col>
                <Col span={8}>
                    <Form.Item
                        name={`name`}
                        label={`Name`}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields();
                            props.setFilter("");
                        }}
                    >
                        Clear
                    </Button>

                </Col>
            </Row>
        </Form>
    );
};

// https://stackblitz.com/run?file=demo.tsx
// https://ant.design/components/form


export default InputSearch;