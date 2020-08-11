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
export default {
  // global
  'page.route.parameterPosition': '参数位置',
  'page.route.httpRequestHeader': 'HTTP 请求头',
  'page.route.requestParameter': '请求参数',
  'page.route.parameterName': '参数名称',
  'page.route.operationalCharacter': '运算符',
  'page.route.equal': '等于',
  'page.route.unequal': '不等于',
  'page.route.greaterThan': '大于',
  'page.route.lessThan': '小于',
  'page.route.regexMatch': '正则匹配',
  'page.route.rule': '规则',
  'page.route.name': '名称',
  'page.route.domainName': '域名',
  'page.route.path': '请求路径',
  'page.route.editTime': '编辑时间',
  'page.route.value': '参数值',
  'page.route.protocol': '协议',
  'page.route.httpHeaderName': 'HTTP 请求头名称',

  // button
  'page.route.button.returnList': '返回路由列表',

  // input
  'page.route.input.placeholder.parameterNameHttpHeader': '请求头键名，例如：HOST',
  'page.route.input.placeholder.parameterNameRequestParameter': '参数名称，例如：id',
  'page.route.input.placeholder.description': '不超过 200 个字符',
  'page.route.input.placeholder.redirectCustom': '例如：/foo/index.html',

  // form
  'page.route.form.itemRulesRequiredMessage.parameterName': '仅支持字母和数字，且只能以字母开头',
  'page.route.form.itemLabel.apiName': 'API 名称',
  'page.route.form.itemRulesPatternMessage.apiNameRule':
    '最大长度100，仅支持字母、数字、- 和 _，且只能以字母开头',
  'page.route.form.itemLabel.httpMethod': 'HTTP 方法',
  'page.route.form.itemLabel.redirect': '重定向',
  'page.route.form.itemLabel.redirectCustom': '自定义重定向',
  'page.route.form.itemExtraMessage.domain': '域名或IP，支持泛域名，如：*.test.com',
  'page.route.form.itemRulesPatternMessage.domain':
    '仅支持字母、数字和 * ，且 * 只能是在开头，支持单个 * ',
  'page.route.form.itemExtraMessage1.path':
    '1. 请求路径，如 /foo/index.html，支持请求路径前缀 /foo/* ；',
  'page.route.form.itemExtraMessage2.path': '2. /* 代表所有路径',
  'page.route.form.itemRulesPatternMessage.path': '以 / 开头，且 * 只能在最后',

  // select
  'page.route.select.option.enableHttps': '启用 HTTPS',
  'page.route.select.option.configCustom': '自定义',
  'page.route.select.option.forbidden': '禁用',
  'page.route.select.option.redirect301': '301（永久重定向）',
  'page.route.select.option.redirect302': '302（临时重定向）',
  'page.route.select.option.inputManually': '手动填写',

  // steps
  'page.route.steps.stepTitle.defineApiRequest': '定义 API 请求',
  'page.route.steps.stepTitle.defineApiBackendServe': '定义 API 后端服务',

  // panelSection
  'page.route.panelSection.title.nameDescription': '名称及其描述',
  'page.route.panelSection.title.httpOverrideRequestHeader': 'HTTP 请求头改写',
  'page.route.panelSection.title.requestOverride': '请求改写',
  'page.route.panelSection.title.requestConfigBasicDefine': '请求基础定义',
  'page.route.panelSection.title.advancedMatchRule': '高级路由匹配条件',

  'page.route.httpAction': '行为',
  'page.route.httpOverrideOrCreate': '重写/创建',

  'page.route.form.itemLabel.domainNameOrIp': '域名/IP',
  'page.route.form.itemExtraMessage.domainNameOrIp': '使用域名时，默认解析本地：/etc/resolv.conf',
  'page.route.form.itemRulesPatternMessage.domainNameOrIp': '仅支持字母、数字和 . ',
  'page.route.portNumber': '端口号',
  'page.route.weight': '权重',

  'page.route.radio.staySame': '保持原样',
  'page.route.input.placeholder.newPath': '例如：/foo/bar/index.html',
  'page.route.form.itemLabel.newPath': '新地址',
};
