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
import React, { useEffect, useState } from 'react';
import Form, { FormInstance } from 'antd/es/form';
import Radio from 'antd/lib/radio';
import { Input, Row, Col, InputNumber, Button, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';

import { FORM_ITEM_LAYOUT, FORM_ITEM_WITHOUT_LABEL } from '@/pages/Route/constants';
import PanelSection from '@/components/PanelSection';
import styles from '../../Create.less';
import { fetchUpstreamList } from '../../service';

interface Props extends RouteModule.Data {
  form: FormInstance;
}
const RequestRewriteView: React.FC<Props> = ({ data, form, disabled, onChange }) => {
  const { step2Data } = data;
  const [upstearms, setUpstreams] = useState<{ id: string; name: string }[]>();
  const upstreamDisabled = disabled || !!step2Data.upstream_id;
  const { formatMessage } = useIntl();

  useEffect(() => {
    // eslint-disable-next-line no-shadow
    fetchUpstreamList().then(({ data }) => {
      setUpstreams([
        { name: formatMessage({ id: 'page.route.select.option.inputManually' }), id: null },
        ...data,
      ]);
      if (step2Data.upstream_id) {
        onChange({ upstream_id: step2Data.upstream_id });
      }
    });
  }, []);
  const renderUpstreamMeta = () => (
    <Form.List name="upstreamHostList">
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, index) => (
            <Form.Item
              required
              key={field.key}
              {...(index === 0 ? FORM_ITEM_LAYOUT : FORM_ITEM_WITHOUT_LABEL)}
              label={
                index === 0 ? formatMessage({ id: 'page.route.form.itemLabel.domainNameOrIp' }) : ''
              }
              extra={
                index === 0
                  ? formatMessage({ id: 'page.route.form.itemExtraMessage.domainNameOrIp' })
                  : ''
              }
            >
              <Row style={{ marginBottom: '10px' }} gutter={16}>
                <Col span={9}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name={[field.name, 'host']}
                    rules={[
                      {
                        required: true,
                        message: `${formatMessage({
                          id: 'component.global.pleaseEnter',
                        })} ${formatMessage({ id: 'page.route.form.itemLabel.domainNameOrIp' })}`,
                      },
                      {
                        pattern: new RegExp(
                          /(^([1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])(\.(25[0-5]|1\d{2}|2[0-4]\d|[1-9]?\d)){3}$|^(?![0-9.]+$)([a-zA-Z0-9_-]+)(\.[a-zA-Z0-9_-]+){0,}$)/,
                          'g',
                        ),
                        message: formatMessage({
                          id: 'page.route.form.itemRulesPatternMessage.domainNameOrIp',
                        }),
                      },
                    ]}
                  >
                    <Input
                      placeholder={formatMessage({
                        id: 'page.route.form.itemLabel.domainNameOrIp',
                      })}
                      disabled={upstreamDisabled}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name={[field.name, 'port']}
                    rules={[
                      {
                        required: true,
                        message: `${formatMessage({
                          id: 'component.global.pleaseEnter',
                        })} ${formatMessage({ id: 'page.route.portNumber' })}`,
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder={formatMessage({ id: 'page.route.portNumber' })}
                      disabled={upstreamDisabled}
                      min={1}
                      max={65535}
                    />
                  </Form.Item>
                </Col>
                <Col span={4} offset={1}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name={[field.name, 'weight']}
                    rules={[
                      {
                        required: true,
                        message: `${formatMessage({
                          id: 'component.global.pleaseEnter',
                        })} ${formatMessage({ id: 'page.route.weight' })}`,
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder={formatMessage({ id: 'page.route.weight' })}
                      disabled={upstreamDisabled}
                      min={0}
                      max={1000}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  {!upstreamDisabled &&
                    (fields.length > 1 ? (
                      <MinusCircleOutlined
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    ) : null)}
                </Col>
              </Row>
            </Form.Item>
          ))}
          {!upstreamDisabled && (
            <Form.Item {...FORM_ITEM_WITHOUT_LABEL}>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                }}
              >
                <PlusOutlined /> {formatMessage({ id: 'component.global.create' })}
              </Button>
            </Form.Item>
          )}
        </>
      )}
    </Form.List>
  );

  const renderTimeUnit = () => <span style={{ margin: '0 8px' }}>ms</span>;

  return (
    <PanelSection title={formatMessage({ id: 'page.route.panelSection.title.requestOverride' })}>
      <Form
        {...FORM_ITEM_LAYOUT}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
        initialValues={step2Data}
      >
        <Form.Item
          label={formatMessage({ id: 'page.route.protocol' })}
          name="upstream_protocol"
          rules={[
            {
              required: true,
              message: `${formatMessage({ id: 'component.global.pleaseChoose' })} ${formatMessage({
                id: 'page.route.protocol',
              })}`,
            },
          ]}
        >
          <Radio.Group
            onChange={(e) => {
              onChange({ upstream_protocol: e.target.value });
            }}
            name="upstream_protocol"
            disabled={disabled}
          >
            <Radio value="keep">{formatMessage({ id: 'page.route.radio.staySame' })}</Radio>
            <Radio value="http">HTTP</Radio>
            <Radio value="https">HTTPS</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'page.route.path' })}>
          <Radio.Group
            defaultValue={step2Data.upstreamPath === undefined ? 'keep' : 'modify'}
            onChange={(e) => {
              onChange({ upstreamPath: e.target.value === 'keep' ? undefined : '' });
            }}
            disabled={disabled}
          >
            <Radio value="keep">{formatMessage({ id: 'page.route.radio.staySame' })}</Radio>
            <Radio value="modify">{formatMessage({ id: 'component.global.edit' })}</Radio>
          </Radio.Group>
        </Form.Item>
        {step2Data.upstreamPath !== undefined && (
          <Form.Item
            label={formatMessage({ id: 'page.route.form.itemLabel.newPath' })}
            name="upstreamPath"
            rules={[
              {
                required: true,
                message: `${formatMessage({
                  id: 'component.global.pleaseChoose',
                })} ${formatMessage({ id: 'page.route.form.itemLabel.newPath' })}`,
              },
            ]}
          >
            <Input
              disabled={disabled}
              placeholder={formatMessage({ id: 'page.route.input.placeholder.newPath' })}
            />
          </Form.Item>
        )}
        <Form.Item label={formatMessage({ id: 'menu.upstream' })} name="upstream_id">
          <Select
            onChange={(value) => {
              onChange({ upstream_id: value });
            }}
            disabled={disabled}
          >
            {(upstearms || []).map((item) => {
              return (
                <Select.Option value={item.id} key={item.id}>
                  {item.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        {renderUpstreamMeta()}
        <Form.Item label={formatMessage({ id: 'component.global.connectionTimeout' })} required>
          <Form.Item
            name={['timeout', 'connect']}
            noStyle
            rules={[
              {
                required: true,
                message: `${formatMessage({ id: 'component.global.pleaseEnter' })} ${formatMessage({
                  id: 'component.global.connectionTimeout',
                })}`,
              },
            ]}
          >
            <InputNumber disabled={upstreamDisabled} />
          </Form.Item>
          {renderTimeUnit()}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'component.global.sendTimeout' })} required>
          <Form.Item
            name={['timeout', 'send']}
            noStyle
            rules={[
              {
                required: true,
                message: `${formatMessage({ id: 'component.global.pleaseEnter' })} ${formatMessage({
                  id: 'component.global.sendTimeout',
                })}`,
              },
            ]}
          >
            <InputNumber disabled={upstreamDisabled} />
          </Form.Item>
          {renderTimeUnit()}
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'component.global.receiveTimeout' })} required>
          <Form.Item
            name={['timeout', 'read']}
            noStyle
            rules={[
              {
                required: true,
                message: `${formatMessage({ id: 'component.global.pleaseEnter' })} ${formatMessage({
                  id: 'component.global.receiveTimeout',
                })}`,
              },
            ]}
          >
            <InputNumber disabled={upstreamDisabled} />
          </Form.Item>
          {renderTimeUnit()}
        </Form.Item>
      </Form>
    </PanelSection>
  );
};

export default RequestRewriteView;
