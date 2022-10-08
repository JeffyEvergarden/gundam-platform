'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  };
exports.__esModule = true;
var Condition_1 = require('@/components/Condition');
var config_1 = require('@/config');
var icons_1 = require('@ant-design/icons');
var antd_1 = require('antd');
var react_1 = require('react');
var umi_1 = require('umi');
var selector_1 = require('../../FAQ/question-board/components/selector');
var selector_modal_1 = require('../../FAQ/question-board/components/selector-modal');
var sound_select_modal_1 = require('../../main-draw/drawerV2/components/sound-select-modal');
var sound_var_modal_1 = require('../../main-draw/drawerV2/components/sound-var-modal');
var model_1 = require('../model');
var style_less_1 = require('./style.less');
var FAQConfig = function (props) {
  var form = antd_1.Form.useForm()[0];
  var FormItem = antd_1.Form.Item,
    FormList = antd_1.Form.List;
  var soundRef = react_1.useRef({});
  var auditionRef = react_1.useRef({});
  var sType = antd_1.Form.useWatch(['systemConfigList', 'FAQ_INVALID_ANSWER', 'soundType'], form);
  var layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  var formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  var formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };
  var _a = model_1.useFAQModel(),
    getTableList = _a.getTableList,
    editFAQ = _a.editFAQ,
    configLoading = _a.configLoading,
    getRejectTableList = _a.getRejectTableList,
    editRejectTableList = _a.editRejectTableList;
  var _b = umi_1.useModel('gundam', function (model) {
      return {
        info: model.info,
        businessFlowId: model.businessFlowId,
        getGlobalValConfig: model.getGlobalValConfig,
      };
    }),
    info = _b.info,
    businessFlowId = _b.businessFlowId,
    getGlobalValConfig = _b.getGlobalValConfig;
  var _c = umi_1.useModel('drawer', function (model) {
      return {
        getFlowList: model.getFlowList,
        _getTreeData: model.getTreeData,
      };
    }),
    getFlowList = _c.getFlowList,
    _getTreeData = _c._getTreeData;
  var robotTypeMap = config_1['default'].robotTypeMap;
  var robotType = robotTypeMap[info.robotType] || '语音';
  var _d = react_1.useState(),
    Nconfig = _d[0],
    setNConfig = _d[1];
  var _e = react_1.useState(false),
    switchType = _e[0],
    setSwitchType = _e[1];
  var selectModalRef = react_1.useRef();
  var opRecordRef = react_1.useRef({});
  var getList = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              getTableList({ robotId: info.id, configType: 2 }).then(function (res) {
                var _a;
                // console.log(res);
                setNConfig(res === null || res === void 0 ? void 0 : res.data);
                var obj = {};
                (_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0
                  ? void 0
                  : _a.forEach(function (item) {
                      var _a, _b;
                      if (item.dataType == 4) {
                        obj[item.configKey] = item.configValue == '1' ? true : false;
                      } else {
                        obj[item.configKey] = item.configValue;
                        if (robotType === '语音') {
                          if (item.configKey == 'FAQ_INVALID_ANSWER') {
                            obj[item.configKey] = {
                              answer:
                                (item === null || item === void 0 ? void 0 : item.configValue) ||
                                '',
                              soundType:
                                (_a =
                                  item === null || item === void 0 ? void 0 : item.soundType) !==
                                  null && _a !== void 0
                                  ? _a
                                  : 1,
                              allowInterrupt:
                                (_b =
                                  item === null || item === void 0
                                    ? void 0
                                    : item.allowInterrupt) !== null && _b !== void 0
                                  ? _b
                                  : 1,
                              soundRecordList:
                                (item === null || item === void 0
                                  ? void 0
                                  : item.soundRecordList) || [],
                            };
                          }
                        }
                      }
                    });
                form.setFieldsValue({ systemConfigList: __assign({}, obj) });
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  var getRejectList = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              getRejectTableList({ robotId: info.id }).then(function (res) {
                if (res === null || res === void 0 ? void 0 : res.length) {
                  form.setFieldsValue({ recommendList: res });
                }
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  var submit = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var res, flag, _res, result1, result2, str;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            console.log(form.getFieldsValue());
            return [
              4 /*yield*/,
              form.validateFields()['catch'](function () {
                antd_1.message.warning('存在未填写项目');
              }),
            ];
          case 1:
            res = _a.sent();
            console.log(res);
            if (!res) {
              return [2 /*return*/];
            }
            _res = Nconfig.map(function (item) {
              Object.keys(res.systemConfigList).forEach(function (v) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                if ((item === null || item === void 0 ? void 0 : item.configKey) == v) {
                  if (item.dataType == 4) {
                    flag = res.systemConfigList[v];
                    item.configValue = res.systemConfigList[v] ? '1' : '0';
                  } else {
                    item.configValue = res.systemConfigList[v];
                    if (robotType === '语音') {
                      if (item.configKey == 'FAQ_INVALID_ANSWER') {
                        item.configValue =
                          ((_b =
                            (_a =
                              res === null || res === void 0 ? void 0 : res.systemConfigList) ===
                              null || _a === void 0
                              ? void 0
                              : _a[v]) === null || _b === void 0
                            ? void 0
                            : _b.answer) || '';
                        item.soundType =
                          (_e =
                            (_d =
                              (_c =
                                res === null || res === void 0 ? void 0 : res.systemConfigList) ===
                                null || _c === void 0
                                ? void 0
                                : _c[v]) === null || _d === void 0
                              ? void 0
                              : _d.soundType) !== null && _e !== void 0
                            ? _e
                            : 1;
                        item.allowInterrupt =
                          (_h =
                            (_g =
                              (_f =
                                res === null || res === void 0 ? void 0 : res.systemConfigList) ===
                                null || _f === void 0
                                ? void 0
                                : _f[v]) === null || _g === void 0
                              ? void 0
                              : _g.allowInterrupt) !== null && _h !== void 0
                            ? _h
                            : 1;
                        item.soundRecordList =
                          ((_k =
                            (_j =
                              res === null || res === void 0 ? void 0 : res.systemConfigList) ===
                              null || _j === void 0
                              ? void 0
                              : _j[v]) === null || _k === void 0
                            ? void 0
                            : _k.soundRecordList) || [];
                      }
                    }
                  }
                }
              });
              return item;
            });
            return [4 /*yield*/, editFAQ(_res)];
          case 2:
            result1 = _a.sent();
            if (!flag) return [3 /*break*/, 4];
            return [
              4 /*yield*/,
              editRejectTableList({
                robotId: info.id,
                faqRejectRecommends: flag ? form.getFieldValue('recommendList') : undefined,
              }),
            ];
          case 3:
            result2 = _a.sent();
            _a.label = 4;
          case 4:
            if (
              ((result1 === null || result1 === void 0 ? void 0 : result1.resultCode) ===
                config_1['default'].successCode &&
                (result2 === null || result2 === void 0 ? void 0 : result2.resultCode) ===
                  config_1['default'].successCode) ||
              ((result1 === null || result1 === void 0 ? void 0 : result1.resultCode) ===
                config_1['default'].successCode &&
                !result2)
            ) {
              antd_1.message.success('成功');
              getList();
              getRejectList();
            } else {
              str = '';
              if (
                (result1 === null || result1 === void 0 ? void 0 : result1.resultCode) !=
                config_1['default'].successCode
              ) {
                str += (result1 === null || result1 === void 0 ? void 0 : result1.resultDesc) || '';
              }
              if (
                (result2 === null || result2 === void 0 ? void 0 : result2.resultCode) !=
                config_1['default'].successCode
              ) {
                if (str && (result2 === null || result2 === void 0 ? void 0 : result2.resultDesc)) {
                  str += ',';
                }
                str += (result2 === null || result2 === void 0 ? void 0 : result2.resultDesc) || '';
              }
              antd_1.message.error(str);
              return [2 /*return*/];
            }
            return [2 /*return*/];
        }
      });
    });
  };
  react_1.useEffect(function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var _item;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            getFlowList(info.id);
            _getTreeData(info.id);
            _item = form.getFieldsValue();
            if (
              !((_a = _item === null || _item === void 0 ? void 0 : _item['recommendList']) ===
                null || _a === void 0
                ? void 0
                : _a.length)
            ) {
              _item.recommendList = [
                {
                  recommendBizType: null,
                  recommendId: null,
                  recommend: null,
                  recommendType: 0,
                },
              ];
              form.setFieldsValue(_item);
            }
            return [4 /*yield*/, getList()];
          case 1:
            _b.sent();
            return [4 /*yield*/, getRejectList()];
          case 2:
            _b.sent();
            return [2 /*return*/];
        }
      });
    });
  }, []);
  var getRecommendItem = function () {
    var _item = form.getFieldsValue();
    console.log(_item);
    return (_item === null || _item === void 0 ? void 0 : _item['recommendList']) || [];
  };
  // 打开弹窗
  var openModal = function (index) {
    var _a, _b;
    var _list = getRecommendItem();
    // 找出被选过的问题  （不能再选，设置为禁用项）
    var disabledQuestionKeys = _list
      .filter(function (item, i) {
        return item.recommendBizType == 1 && item.recommendId && i !== index;
      })
      .map(function (item) {
        return item.recommendId;
      });
    // 找出被选过的流程  （不能再选，设置为禁用项）
    var disabledFlowKeys = _list
      .filter(function (item, i) {
        return item.recommendBizType == 2 && item.recommendId && i !== index;
      })
      .map(function (item) {
        return item.recommendId;
      });
    // console.log(disabledQuestionKeys, disabledFlowKeys);
    // 编辑模式、要排除自己也不能被选
    // if (questionId) {
    //   disabledQuestionKeys.push(questionId);
    // }
    var openInfo = {
      showFlow: true,
      info: _list[index],
      disabledQuestionKeys: disabledQuestionKeys,
      disabledFlowKeys: disabledFlowKeys,
      selectedQuestionKeys: [],
      selectedFlowKeys: [],
    };
    // 找到已选的
    if (((_a = _list[index]) === null || _a === void 0 ? void 0 : _a.questionType) == 2) {
      openInfo.selectedFlowKeys = [_list[index].recommendId];
    } else if (((_b = _list[index]) === null || _b === void 0 ? void 0 : _b.questionType) == 1) {
      openInfo.selectedQuestionKeys = [_list[index].recommendId];
    }
    selectModalRef.current.open(openInfo);
    // 回调函数，不能重复添加、以及更改后刷新
    opRecordRef.current.callback = function (obj) {
      var _list = getRecommendItem();
      var repeatFlag = _list.findIndex(function (item, i) {
        return (
          i !== index &&
          item.recommendId == obj.recommendId &&
          item.recommendBizType == obj.recommendBizType
        );
      });
      if (repeatFlag > -1) {
        antd_1.message.warning('已添加过重复');
        return;
      }
      _list[index] = __assign({}, obj);
      form.setFieldsValue({
        recommendList: __spreadArrays(_list),
      });
    };
  };
  var confirm = function (obj) {
    var _a, _b;
    console.log(obj);
    (_b = (_a = opRecordRef.current) === null || _a === void 0 ? void 0 : _a.callback) === null ||
    _b === void 0
      ? void 0
      : _b.call(_a, obj);
  };
  var intelRecommend = function (flag, index) {
    console.log(flag);
    var formData = form.getFieldsValue();
    formData.recommendList[index].recommendBizType = undefined;
    formData.recommendList[index].recommendId = undefined;
    formData.recommendList[index].recommend = undefined;
    formData.recommendList[index].recommendType = flag ? 1 : 0;
    form.setFieldsValue(__assign({}, formData));
  };
  return react_1['default'].createElement(
    'div',
    { className: style_less_1['default']['machine-page'] },
    react_1['default'].createElement(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      react_1['default'].createElement(
        antd_1.Form,
        __assign({ form: form }, layout),
        react_1['default'].createElement(
          'div',
          { className: style_less_1['default']['antd-form'] },
          react_1['default'].createElement(
            antd_1.Space,
            { align: 'baseline' },
            react_1['default'].createElement(
              'div',
              {
                className: style_less_1['default']['title_sp'],
                style: { marginRight: '16px', marginBottom: '20px' },
              },
              'FAQ\u914D\u7F6E',
            ),
          ),
          Nconfig === null || Nconfig === void 0
            ? void 0
            : Nconfig.map(function (item) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                if ((item === null || item === void 0 ? void 0 : item.dataType) == 1) {
                  return react_1['default'].createElement(
                    FormItem,
                    // {...col}
                    {
                      // {...col}
                      label: item.configName,
                      name: ['systemConfigList', item.configKey],
                      key: 'systemConfigList' + item.configKey,
                      rules: [{ required: true }],
                    },
                    react_1['default'].createElement(antd_1.InputNumber, {
                      style: { width: 200 },
                      min:
                        (_b =
                          (_a = item === null || item === void 0 ? void 0 : item.validateRule) ===
                            null || _a === void 0
                            ? void 0
                            : _a.min) !== null && _b !== void 0
                          ? _b
                          : 0,
                      max:
                        (_d =
                          (_c = item === null || item === void 0 ? void 0 : item.validateRule) ===
                            null || _c === void 0
                            ? void 0
                            : _c.max) !== null && _d !== void 0
                          ? _d
                          : undefined,
                      step: '1',
                      precision: 0,
                      stringMode: true,
                      disabled: (
                        (_e = item === null || item === void 0 ? void 0 : item.validateRule) ===
                          null || _e === void 0
                          ? void 0
                          : _e.disabled
                      )
                        ? true
                        : false,
                    }),
                  );
                } else if ((item === null || item === void 0 ? void 0 : item.dataType) == 0) {
                  if (item.configKey == 'FAQ_INVALID_ANSWER') {
                    return react_1['default'].createElement(
                      FormItem,
                      { label: item.configName, key: item.configName, rules: [{ required: true }] },
                      react_1['default'].createElement(
                        'div',
                        { className: style_less_1['default']['diy-box'] },
                        react_1['default'].createElement(
                          'div',
                          { className: style_less_1['default']['diy-row'] },
                          react_1['default'].createElement(
                            'div',
                            { style: { display: 'flex', justifyContent: 'space-between' } },
                            react_1['default'].createElement('div', {
                              className: style_less_1['default']['zy-row'],
                              style: { paddingBottom: '6px' },
                            }),
                            react_1['default'].createElement(
                              'div',
                              { id: style_less_1['default']['soundType'] },
                              react_1['default'].createElement(
                                antd_1.Form.Item,
                                {
                                  name: ['systemConfigList', item.configKey, 'soundType'],
                                  key: item.configKey + 'soundType',
                                  initialValue: 1,
                                },
                                react_1['default'].createElement(
                                  antd_1.Radio.Group,
                                  null,
                                  react_1['default'].createElement(
                                    antd_1.Radio,
                                    { value: 1 },
                                    '\u5168\u5408\u6210',
                                  ),
                                  react_1['default'].createElement(
                                    antd_1.Radio,
                                    { value: 2 },
                                    '\u5F55\u97F3\u534A\u5408\u6210',
                                  ),
                                ),
                              ),
                              react_1['default'].createElement(
                                Condition_1['default'],
                                { 'r-if': sType == 2 },
                                react_1['default'].createElement(
                                  antd_1.Form.Item,
                                  {
                                    name: ['systemConfigList', item.configKey, 'soundRecordList'],
                                    key: item.configKey + 'soundRecordList',
                                    rules: [{ required: true, message: '请选择' }],
                                  },
                                  react_1['default'].createElement(
                                    antd_1.Button,
                                    {
                                      type: 'link',
                                      onClick: function () {
                                        var _a, _b;
                                        console.log(form.getFieldsValue());
                                        console.log(sType);
                                        if (sType == 2) {
                                          (_a =
                                            soundRef === null || soundRef === void 0
                                              ? void 0
                                              : soundRef.current) === null || _a === void 0
                                            ? void 0
                                            : _a.open(
                                                ((_b =
                                                  form.getFieldsValue()['systemConfigList'][
                                                    item.configKey
                                                  ]) === null || _b === void 0
                                                  ? void 0
                                                  : _b.soundRecordList) || [],
                                              );
                                        }
                                      },
                                    },
                                    '\u9009\u62E9',
                                  ),
                                ),
                              ),
                              react_1['default'].createElement(
                                antd_1.Button,
                                {
                                  type: 'link',
                                  onClick: function () {
                                    var _a;
                                    console.log(form.getFieldsValue());
                                    (_a =
                                      auditionRef === null || auditionRef === void 0
                                        ? void 0
                                        : auditionRef.current) === null || _a === void 0
                                      ? void 0
                                      : _a.open(
                                          form.getFieldsValue()['systemConfigList'][item.configKey],
                                        );
                                  },
                                },
                                '\u8BD5\u542C',
                              ),
                              react_1['default'].createElement(sound_var_modal_1['default'], {
                                cref: auditionRef,
                              }),
                              react_1['default'].createElement(sound_select_modal_1['default'], {
                                cref: soundRef,
                                setform: function (list, index) {
                                  var _a;
                                  var formData = form.getFieldsValue();
                                  formData['systemConfigList'][item.configKey].soundRecordList =
                                    list;
                                  formData['systemConfigList'][item.configKey].answer =
                                    (_a = list === null || list === void 0 ? void 0 : list[0]) ===
                                      null || _a === void 0
                                      ? void 0
                                      : _a.text;
                                  form.setFieldsValue(formData);
                                  console.log(formData);
                                },
                                type: 'radio',
                              }),
                            ),
                          ),
                          react_1['default'].createElement(
                            antd_1.Form.Item,
                            {
                              name: ['systemConfigList', item.configKey, 'answer'],
                              key: item.configKey + 'answer',
                              rules: [
                                {
                                  message: '请输入',
                                  required: true,
                                  validateTrigger: 'onBlur',
                                },
                              ],
                            },
                            react_1['default'].createElement(antd_1.Input.TextArea, {
                              maxLength:
                                (_g =
                                  (_f =
                                    item === null || item === void 0
                                      ? void 0
                                      : item.validateRule) === null || _f === void 0
                                    ? void 0
                                    : _f.max) !== null && _g !== void 0
                                  ? _g
                                  : 200,
                              rows: 5,
                              placeholder: '请输入',
                              showCount: true,
                            }),
                          ),
                          react_1['default'].createElement(
                            antd_1.Form.Item,
                            {
                              name: ['systemConfigList', item.configKey, 'allowInterrupt'],
                              key: item.configKey + 'allowInterrupt',
                              initialValue: 1,
                              label: '允许打断',
                            },
                            react_1['default'].createElement(
                              antd_1.Radio.Group,
                              null,
                              react_1['default'].createElement(
                                antd_1.Radio,
                                { value: 1 },
                                '\u662F',
                              ),
                              react_1['default'].createElement(
                                antd_1.Radio,
                                { value: 0 },
                                '\u5426',
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  }
                  if (item.configKey == 'FAQ_REJECT_RECOMMEND_TEXT' && switchType) {
                    return react_1['default'].createElement(
                      FormItem,
                      // {...col}
                      {
                        // {...col}
                        label: item.configName,
                        name: ['systemConfigList', item.configKey],
                        key: 'systemConfigList' + item.configKey,
                        rules: [{ required: true }],
                      },
                      react_1['default'].createElement(antd_1.Input.TextArea, {
                        style: { width: 300 },
                        maxLength:
                          (_j =
                            (_h = item === null || item === void 0 ? void 0 : item.validateRule) ===
                              null || _h === void 0
                              ? void 0
                              : _h.max) !== null && _j !== void 0
                            ? _j
                            : 200,
                      }),
                    );
                  } else if (item.configKey != 'FAQ_REJECT_RECOMMEND_TEXT') {
                    return react_1['default'].createElement(
                      FormItem,
                      // {...col}
                      {
                        // {...col}
                        label: item.configName,
                        name: ['systemConfigList', item.configKey],
                        key: 'systemConfigList' + item.configKey,
                        rules: [{ required: true }],
                      },
                      react_1['default'].createElement(antd_1.Input.TextArea, {
                        style: { width: 300 },
                        maxLength:
                          (_l =
                            (_k = item === null || item === void 0 ? void 0 : item.validateRule) ===
                              null || _k === void 0
                              ? void 0
                              : _k.max) !== null && _l !== void 0
                            ? _l
                            : 200,
                      }),
                    );
                  }
                } else if ((item === null || item === void 0 ? void 0 : item.dataType) == 4) {
                  return react_1['default'].createElement(
                    FormItem,
                    // {...col}
                    {
                      // {...col}
                      label: item.configName,
                      name: ['systemConfigList', item.configKey],
                      key: 'systemConfigList' + item.configKey,
                      valuePropName: 'checked',
                      initialValue: false,
                      shouldUpdate: function (prevValues, curValues) {
                        var _a;
                        setSwitchType(
                          (_a =
                            curValues === null || curValues === void 0
                              ? void 0
                              : curValues.systemConfigList) === null || _a === void 0
                            ? void 0
                            : _a[item.configKey],
                        );
                        return true;
                      },
                    },
                    react_1['default'].createElement(antd_1.Switch, {
                      checkedChildren: '\u5F00\u542F',
                      unCheckedChildren: '\u5173\u95ED',
                      onChange: setSwitchType,
                    }),
                  );
                }
              }),
          react_1['default'].createElement(
            Condition_1['default'],
            { 'r-show': switchType },
            react_1['default'].createElement(
              FormList,
              { name: 'recommendList' },
              function (fields, _a) {
                var add = _a.add,
                  remove = _a.remove;
                var addNew = function () {
                  var length = fields.length;
                  console.log(length);
                  // if (length >= maxRecommendLength) {
                  //   message.warning('推荐设置不能超过faq全局配置限制数量');
                  //   return;
                  // }
                  add(
                    {
                      recommendBizType: null,
                      recommendId: null,
                      recommend: null,
                      recommendType: 0,
                    },
                    length,
                  );
                };
                return react_1['default'].createElement(
                  'div',
                  null,
                  fields.map(function (field, index) {
                    var _a, _b;
                    var formData = form.getFieldsValue();
                    var intelFlag = (
                      (_b =
                        (_a =
                          formData === null || formData === void 0
                            ? void 0
                            : formData.recommendList) === null || _a === void 0
                          ? void 0
                          : _a[index]) === null || _b === void 0
                        ? void 0
                        : _b.recommendType
                    )
                      ? true
                      : false;
                    return react_1['default'].createElement(
                      antd_1.Form.Item,
                      __assign({}, index === 0 ? formItemLayout : formItemLayoutWithOutLabel, {
                        label:
                          index === 0
                            ? react_1['default'].createElement(
                                'span',
                                null,
                                react_1['default'].createElement(
                                  'span',
                                  { style: { color: 'red' } },
                                  '*',
                                ),
                                ' \u731C\u4F60\u60F3\u95EE\u914D\u7F6E',
                              )
                            : '',
                        className: style_less_1['default']['faq_zy-row_sp'],
                        // rules={[{ required: true, message: '请选择' }]}
                        key: field.key,
                      }),
                      react_1['default'].createElement(
                        antd_1.Space,
                        { align: 'baseline' },
                        fields.length > 1
                          ? react_1['default'].createElement(icons_1.MinusCircleOutlined, {
                              className: style_less_1['default']['del-bt'],
                              onClick: function () {
                                remove(index);
                              },
                            })
                          : null,
                        react_1['default'].createElement(
                          antd_1.Form.Item,
                          {
                            name: [field.name, 'recommend'],
                            fieldKey: [field.fieldKey, 'recommend'],
                            key: field.fieldKey + 'recommend',
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [
                              {
                                required: switchType
                                  ? info.robotTypeLabel === 'text'
                                    ? !intelFlag
                                    : true
                                  : false,
                                message: '请选择',
                              },
                            ],
                            // {...field}
                            noStyle: true,
                          },
                          react_1['default'].createElement(selector_1['default'], {
                            disabled: info.robotTypeLabel === 'text' ? intelFlag : false,
                            openModal: function () {
                              openModal(index);
                            },
                          }),
                        ),
                        react_1['default'].createElement(
                          Condition_1['default'],
                          { 'r-if': info.robotTypeLabel === 'text' },
                          react_1['default'].createElement(
                            'span',
                            { style: { marginLeft: '16px' } },
                            '\u667A\u80FD\u63A8\u8350',
                          ),
                          ' ',
                        ),
                        react_1['default'].createElement(
                          Condition_1['default'],
                          { 'r-if': info.robotTypeLabel === 'text' },
                          react_1['default'].createElement(
                            antd_1.Form.Item,
                            {
                              name: [field.name, 'recommendType'],
                              fieldKey: [field.fieldKey, 'recommendType'],
                              key: field.fieldKey + 'recommendType',
                              valuePropName: 'checked',
                              style: { marginBottom: 0 },
                            },
                            react_1['default'].createElement(antd_1.Switch, {
                              checkedChildren: '\u5F00\u542F',
                              unCheckedChildren: '\u5173\u95ED',
                              onChange: function (checked) {
                                intelRecommend(checked, index);
                              },
                            }),
                          ),
                        ),
                      ),
                    );
                  }),
                  react_1['default'].createElement(
                    'div',
                    { className: style_less_1['default']['recommend-box'] },
                    react_1['default'].createElement(
                      antd_1.Button,
                      {
                        type: 'link',
                        icon: react_1['default'].createElement(icons_1.PlusCircleOutlined, null),
                        onClick: addNew,
                        style: { paddingLeft: 0 },
                      },
                      '\u65B0\u589E\u6807\u51C6\u95EE',
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ),
      react_1['default'].createElement(
        antd_1.Button,
        {
          type: 'primary',
          onClick: submit,
          style: { alignSelf: 'flex-end' },
          loading: configLoading,
        },
        '\u4FDD\u5B58',
      ),
      react_1['default'].createElement(selector_modal_1['default'], {
        cref: selectModalRef,
        confirm: confirm,
      }),
    ),
  );
};
exports['default'] = FAQConfig;
