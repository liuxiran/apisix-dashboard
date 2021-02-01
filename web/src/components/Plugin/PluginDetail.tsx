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
import React, { useEffect, useRef } from 'react';
import {
  Button,
  notification,
  PageHeader,
  Switch,
  Form,
  Select,
  Divider,
  Drawer,
  Alert,
} from 'antd';
import { useIntl } from 'umi';
import CodeMirror from '@uiw/react-codemirror';
import { js_beautify } from 'js-beautify';
import { LinkOutlined } from '@ant-design/icons';
import Ajv from 'ajv';
import type { DefinedError } from 'ajv';
import addFormats from 'ajv-formats';
import jsf from 'json-schema-faker';
import {pathOr} from 'ramda'
import YAML from 'yaml'

import { fetchSchema } from './service';

type Props = {
  name: string;
  type?: 'global' | 'scoped';
  schemaType: PluginComponent.Schema;
  initialData: Record<string, any>;
  pluginList: PluginComponent.Meta[];
  readonly?: boolean;
  visible: boolean;
  onClose?: () => void;
  onChange?: (data: any) => void;
};

const ajv = new Ajv();
addFormats(ajv);

const FORM_ITEM_LAYOUT = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 16,
  },
};

// NOTE: This function has side effect because it mutates the original schema data
const injectDisableProperty = (schema: Record<string, any>) => {
  // NOTE: The frontend will inject the disable property into schema just like the manager-api does
  if (!schema.properties) {
    // eslint-disable-next-line
    schema.properties = {};
  }
  // eslint-disable-next-line
  (schema.properties as any).disable = {
    type: 'boolean',
  };
  return schema;
};

const PluginDetail: React.FC<Props> = ({
  name,
  type = 'scoped',
  schemaType = 'route',
  visible,
  pluginList = [],
  readonly = false,
  initialData = {},
  onClose = () => {},
  onChange = () => {},
}) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const ref = useRef<any>(null);
  const data = initialData[name] || {};
  const pluginType = pluginList.find((item) => item.name === name)?.type;

  useEffect(() => {
    form.setFieldsValue({
      disable: initialData[name] && !initialData[name].disable,
      scope: 'global',
    });
  }, []);

  const enhance = (schema, parents = []) => (item) => {
      console.log('----log in enhance--');
      console.log(schema);
      const key = item.key.value
      console.log(key)
      const path = [
        ...parents.map((parent) => ['properties', parent]),
        ['properties', key]
      ].flat()
      console.log(path)
    
      if (['title', 'description'].find((f) => path[path.length - 1] === f)) {
        return
      }
    
      const comments = [`# ${pathOr(key, [...path, 'title'], schema)} ##`, '']
    
      const description = pathOr('', [...path, 'description'], schema)
      if (description) {
        comments.push(' ' + description.split('\n').join('\n '), '')
      }
    
      const defaultValue = pathOr('', [...path, 'default'], schema)
      if (defaultValue || defaultValue === false) {
        comments.push(' Default value: ' + defaultValue, '')
      }
    
      const enums = pathOr('', [...path, 'enum'], schema)
      if (enums && Array.isArray(enums)) {
        comments.push(
          ' One of:',
          ...YAML.stringify(enums)
            .split('\n')
            .map((i) => ` ${i}`)
        ) // split always returns one empty object so no need for newline
      }
    
      const min = pathOr('', [...path, 'minimum'], schema)
      if (min || min === 0) {
        comments.push(` Minimum value: ${min}`, '')
      }
    
      const max = pathOr('', [...path, 'maximum'], schema)
      if (max || max === 0) {
        comments.push(` Maximum value: ${max}`, '')
      }
    
      const examples = pathOr('', [...path, 'examples'], schema)
      if (examples) {
        comments.push(
          ' Examples:',
          ...YAML.stringify(examples)
            .split('\n')
            .map((i) => ` ${i}`)
        ) // split always returns one empty object so no need for newline
      }
    
      let hasChildren
      if (item.value.items) {
        item.value.items.forEach((item) => {
          if (item.key) {
            enhance(schema, [...parents, key])(item)
            hasChildren = true
          }
        })
      }
    
      /* const showEnvVarBlockForObject = pathOr(
        '',
        [...path, 'showEnvVarBlockForObject'],
        schema
      )
      if (!hasChildren || showEnvVarBlockForObject) {
        const env = [...parents, key].map((i) => i.toUpperCase()).join('_')
        comments.push(
          ' Set this value using environment variables on',
          ' - Linux/macOS:',
          `    $ export ${env}=<value>`,
          ' - Windows Command Line (CMD):',
          `    > set ${env}=<value>`,
          ''
        )
    
        // Show this if the config property is an object, to call out how to specify the env var
        if (hasChildren) {
          comments.push(
            ' This can be set as an environment variable by supplying it as a JSON object.',
            ''
          )
        }
      } */
    
      item.commentBefore = comments.join('\n')
      item.spaceBefore = true
    }

  const validateData = (pluginName: string, value: PluginComponent.Data) => {
    return fetchSchema(pluginName, schemaType).then((test) => {
      console.log('------schema------');
      const schema = {
				"$comment": "this is a mark for our injected plugin schema",
				"anyOf": [{
					"required": ["discovery"]
				}, {
					"required": ["token_endpoint"]
				}],
				"properties": {
					"audience": {
						"maxLength": 100,
						"minLength": 1,
						"type": "string"
					},
					"disable": {
						"type": "boolean"
					},
					"discovery": {
						"maxLength": 4096,
						"minLength": 1,
						"type": "string"
					},
					"grant_type": {
						"default": "urn:ietf:params:oauth:grant-type:uma-ticket",
						"enum": ["urn:ietf:params:oauth:grant-type:uma-ticket"],
						"maxLength": 100,
						"minLength": 1,
						"type": "string"
					},
					"keepalive": {
						"default": true,
						"type": "boolean"
					},
					"keepalive_pool": {
						"default": 5,
						"minimum": 1,
						"type": "integer"
					},
					"keepalive_timeout": {
						"default": 60000,
						"minimum": 1000,
						"type": "integer"
					},
					"permissions": {
						"items": {
							"maxLength": 100,
							"minLength": 1,
							"type": "string"
						},
						"type": "array",
						"uniqueItems": true
					},
					"policy_enforcement_mode": {
						"default": "ENFORCING",
						"enum": ["ENFORCING", "PERMISSIVE"],
						"type": "string"
					},
					"ssl_verify": {
						"default": true,
						"type": "boolean"
					},
					"timeout": {
						"default": 3000,
						"minimum": 1000,
						"type": "integer"
					},
					"token_endpoint": {
						"maxLength": 4096,
						"minLength": 1,
						"type": "string"
					}
				},
				"type": "object"
			};
      console.log('------jsf---------------');
      console.log(jsf.option)
      jsf.option({
        alwaysFakeOptionals: true,
        useExamplesValue: true,
        useDefaultValue: true,
        minItems: 1,
        random: () => 0
      })
      console.log(JSON.stringify(jsf.generate(schema)));
      console.log('----------------');
      // console.log('----enhance schema------');
      // console.log(enhance(schema, [])(''));
      //console.log(YAML.parseDocument(YAML.stringify(jsf.generate(schema))))
      console.log('----------------');
      const values = jsf.generate(schema)
      const doc = YAML.parseDocument(YAML.stringify(values))

      const comments = [`# ${pathOr('', ['title'], schema)}`, '']
      console.log(pathOr('',['title'], schema))
      console.log(comments)
      const description = pathOr('', ['description'], schema)
      console.log(description)
      if (description) {
        comments.push(' ' + description)
      }
      console.log(comments)
      doc.commentBefore = comments.join('\n')
      doc.spaceAfter = false
      doc.spaceBefore = false

      doc.contents.items.forEach(enhance(schema, []))

      console.log(doc)
      console.log(doc.toString())
      console.log('-------------------------------')

      return new Promise((resolve) => {
        if (schema.oneOf) {
          (schema.oneOf || []).forEach((item: any) => {
            injectDisableProperty(item);
          });
        } else {
          injectDisableProperty(schema);
        }
        const validate = ajv.compile(schema);
        if (validate(value)) {
          resolve(value);
          return;
        }

        // eslint-disable-next-line
        for (const err of validate.errors as DefinedError[]) {
          let description = '';
          switch (err.keyword) {
            case 'enum':
              description = `${err.dataPath} ${err.message}: ${err.params.allowedValues.join(
                ', ',
              )}`;
              break;
            case 'minItems':
            case 'type':
              description = `${err.dataPath} ${err.message}`;
              break;
            case 'oneOf':
            case 'required':
              description = err.message || '';
              break;
            default:
              description = `${err.schemaPath} ${err.message}`;
          }
          notification.error({
            message: 'Invalid plugin data',
            description,
          });
        }
      });
    });
  };

  const formatCodes = () => {
    try {
      if (ref.current) {
        ref.current.editor.setValue(
          js_beautify(ref.current.editor.getValue(), {
            indent_size: 2,
          }),
        );
      }
    } catch (error) {
      notification.error({
        message: 'Format failed',
      });
    }
  };

  return (
    <>
      <Drawer
        title={`Plugin: ${name}`}
        visible={visible}
        placement="right"
        closable={false}
        onClose={onClose}
        width={700}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {' '}
            <Button onClick={onClose} key={1}>
              {formatMessage({ id: 'component.global.cancel' })}
            </Button>
            <Button
              key={2}
              type="primary"
              onClick={() => {
                try {
                  const editorData = JSON.parse(ref.current?.editor.getValue());
                  validateData(name, editorData).then((value) => {
                    onChange({ formData: form.getFieldsValue(), codemirrorData: value });
                  });
                } catch (error) {
                  notification.error({
                    message: 'Invalid JSON data',
                  });
                }
              }}
            >
              {formatMessage({ id: 'component.global.submit' })}
            </Button>
          </div>
        }
      >
        <style>
          {`
        .site-page-header {
          border: 1px solid rgb(235, 237, 240);
          margin-top:10px;
        }
      `}
        </style>

        <Form {...FORM_ITEM_LAYOUT} style={{ marginTop: '10px' }} form={form}>
          <Form.Item label="Enable" valuePropName="checked" name="disable">
            <Switch
              defaultChecked={initialData[name] && !initialData[name].disable}
              disabled={readonly}
            />
          </Form.Item>
          {type === 'global' && (
            <Form.Item label="Scope" name="scope">
              <Select disabled>
                <Select.Option value="global">Global</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
        <Divider orientation="left">Data Editor</Divider>
        <PageHeader
          title=""
          subTitle={
            pluginType === 'auth' && schemaType !== 'consumer' ? (
              <Alert message={`${name} does not require configuration`} type="warning" />
            ) : (
              <>Current plugin: {name}</>
            )
          }
          ghost={false}
          extra={[
            <Button
              type="default"
              icon={<LinkOutlined />}
              onClick={() => {
                if (name.startsWith('serverless')) {
                  window.open(
                    'https://github.com/apache/apisix/blob/master/doc/plugins/serverless.md',
                  );
                } else {
                  window.open(
                    `https://github.com/apache/apisix/blob/master/doc/plugins/${name}.md`,
                  );
                }
              }}
              key={1}
            >
              Document
            </Button>,
            <Button type="primary" onClick={formatCodes} key={2}>
              Format
            </Button>,
          ]}
        />
        <CodeMirror
          ref={(codemirror) => {
            ref.current = codemirror;
            if (codemirror) {
              // NOTE: for debug & test
              window.codemirror = codemirror.editor;
            }
          }}
          value={JSON.stringify(data, null, 2)}
          options={{
            mode: 'json-ld',
            readOnly: readonly ? 'nocursor' : '',
            lineWrapping: true,
            lineNumbers: true,
            showCursorWhenSelecting: true,
            autofocus: true,
          }}
        />
      </Drawer>
    </>
  );
};

export default PluginDetail;
