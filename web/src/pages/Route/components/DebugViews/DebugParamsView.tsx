/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useState } from 'react';
import { Form, Input, Row, Col, Checkbox, Select, Upload, Button } from 'antd';
import { useIntl } from 'umi';
import { MinusCircleOutlined, FileAddOutlined } from '@ant-design/icons';
import { DEFAULT_DEBUG_PARAM_FORM_DATA } from '../../constants';

import styles from './index.less';


const DebugParamsView: React.FC<RouteModule.DebugViewProps> = (props) => {
  const { formatMessage } = useIntl();
  const [valueType, setValueType] = useState(['text']);
  const [uploadFile, setUploadFile] = useState([])

  return (
    <Form name="dynamic_form_nest_item" className={styles.routeDebugDraw} form={props.form}>
      <Form.List name="params">
        {(fields, { add, remove }) => {
          console.log('in form')
          console.log(fields)
          console.log(props.form.getFieldsValue())
          console.log(valueType)
          console.log('------------')
          return (
            <>
              {fields.map((field, index) => (
                <Row gutter={24} key={field.name}>
                  <Col span={1}>
                    <Form.Item
                      name={[field.name, 'check']}
                      style={{ textAlign: 'right' }}
                      valuePropName="checked"
                    >
                      {fields.length > 1 && index !== fields.length - 1 && <Checkbox />}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item name={[field.name, 'key']}>
                      <Input
                        placeholder={formatMessage({ id: 'page.route.input.placeholder.paramKey' })}
                        onChange={() => {
                          // only last line key field input can trigger add new line event
                          if (index === fields.length - 1) {
                            add(DEFAULT_DEBUG_PARAM_FORM_DATA.params[0]);
                            setValueType([...valueType, 'text'])
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Input.Group compact>
                      <Form.Item name={[field.name, 'valueType']}>
                        <Select style={{width: 70}} onChange={(value) => {
                          console.log('in valueType change')
                          console.log(props.form.getFieldsValue())
                          console.log(`value: ${value}`)
                          console.log(`index: ${index}`)
                          console.log(`valueType: ${valueType}`)
                          valueType.splice(index,1,value)
                          setValueType([...valueType])
                          console.log('----------------------')
                        }}>
                          <Select.Option value='text'>Text</Select.Option>
                          <Select.Option value='file'>File</Select.Option>
                        </Select>
                      </Form.Item>
                      {
                        valueType[index] === 'text' && 
                        (<Form.Item name={[field.name, 'value']}>
                          <Input
                          placeholder={formatMessage({
                            id: 'page.route.input.placeholder.paramValue',
                          })}
                          />
                        </Form.Item>)
                      }
                      {
                        valueType[index] === 'file' && 
                        <Form.Item name={[field.name, 'value']} getValueFromEvent={(e) => {
                          if (Array.isArray(e)) {
                            return e;
                          }
                          return e && e.fileList;
                        }} valuePropName="file">
                          <Upload fileList={[]} onChange={(info) => {
                            uploadFile.splice(index,1,info.file.name)
                            setUploadFile([...uploadFile])
                          }}>
                            <Input disabled value={uploadFile[index]}
                              placeholder={formatMessage({
                                id: 'page.route.input.placeholder.paramValue',
                              })}
                            />
                          </Upload>
                        </Form.Item>
                      }
                    </Input.Group>
                  </Col>
                  <Col>
                    {fields.length > 1 && index !== fields.length - 1 && (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    )}
                  </Col>
                </Row>
              ))}
            </>
          );
        }}
      </Form.List>
    </Form>
  );
};

export default DebugParamsView;
