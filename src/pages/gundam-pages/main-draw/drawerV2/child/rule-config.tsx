import { useState, useMemo } from 'react';
import { Form, Input, Select, Button, Space, DatePicker, InputNumber } from 'antd';
import { MinusCircleOutlined, AppstoreAddOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Condition from '@/components/Condition';
import { useModel } from 'umi';
import styles from './style.less';
import {
  ACTION_LIST,
  RUlE_LIST,
  EDGE_VAR_LIST,
  EDGE_RULE_LIST,
  selectMap,
  VALUE_TYPE_MAP,
  VALUE_TYPE_LIST,
  RULE_KEY_TYPE_MAP,
  conditionFilter,
} from '../const';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const RuleConfig = (props: any) => {
  const {
    wishList,
    wordSlotList,
    form,
    type = 'node',
    title,
    formName: _formName,
    name,
    style,
  } = props;

  // 是否是数组
  const isArray = Array.isArray(_formName);
  const key = isArray ? _formName[0] : _formName;

  const CURRENT_RULE_LIST = type === 'node' ? RUlE_LIST : [...RUlE_LIST, ...EDGE_RULE_LIST];

  // 获取当前修改
  const getItem = (i?: number, j?: number) => {
    let item: any = null;
    if (isArray) {
      _formName.forEach((key: any, index: number) => {
        if (index === 0) {
          item = form.getFieldValue(key);
        } else {
          item = item[key];
        }
      });
    } else {
      item = form.getFieldValue(_formName);
    }
    if (typeof i !== 'number') {
      return item;
    }
    if (typeof j !== 'number') {
      return item?.[i];
    }
    return item?.[i]?.rules?.[j];
  };

  const { globalVarList } = useModel('gundam' as any, (model: any) => ({
    globalVarList: model.globalVarList || [],
  }));

  const _globalVarList: any[] = useMemo(() => {
    return globalVarList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [globalVarList]);

  // 通用重新渲染
  const change = (i: number, j: number, level: number, opt?: any) => {
    // console.log(opt);
    const list = form.getFieldValue(key);
    const item: any = getItem(i, j);
    if (level === 1) {
      item.ruleKey = undefined;
      item.ruleKeyType = undefined;
      item.condition = undefined;
      item.valueType = undefined;
      item.ruleValue = undefined;
    } else if (level === 2) {
      item.ruleKeyType = opt?.opt?.type || undefined;
      item.condition = undefined;
      item.valueType = undefined;
      item.ruleValue = undefined;
    } else if (level === 3) {
      item.valueType = undefined;
      item.ruleValue = undefined;
    } else if (level === 4) {
      item.ruleValue = undefined;
    }
    form.setFieldsValue({
      [key]: [...list],
    });
  };

  return (
    <FormList name={isArray ? name : key}>
      {(outFields, { add: _add, remove: _remove }) => {
        const length = outFields.length;
        const addOutNew = () => {
          // console.log(fields);
          _add(
            {
              rules: [
                {
                  ruleType: undefined, // 选择类型
                  ruleKey: undefined, // 词槽、高级变量、变量
                  ruleKeyType: undefined, //
                  condition: undefined, // 比较条件
                  valueType: undefined, //值类型  词槽、变量 (数字、文本、时间)
                  value: undefined,
                },
              ],
            },
            length,
          );
        };

        return (
          <div>
            <div className={styles['zy-row']} style={{ marginBottom: '10px' }}>
              <div className={styles['title_sp']}>规则配置</div>
            </div>
            <div className={styles['rule-box_bg']}>
              <div style={style}>
                {outFields.map((outFields: any, i: number) => {
                  return (
                    <div key={outFields.key} className={styles['rule-box']}>
                      <FormList name={[outFields.name, 'rules']}>
                        {(fields, { add, remove }) => {
                          const length = fields.length;

                          const addNew = () => {
                            // console.log('------------form');
                            // console.log(form);
                            add(
                              {
                                ruleType: undefined,
                                ruleKey: undefined,
                                ruleKeyType: undefined,
                                condition: undefined,
                                valueType: undefined,
                                ruleValue: undefined,
                              },
                              length,
                            );
                          };

                          return (
                            <div>
                              <div className={styles['zy-row']} style={{ paddingBottom: '6px' }}>
                                <span
                                  className={styles['del-bt']}
                                  onClick={() => {
                                    _remove(i);
                                  }}
                                >
                                  <MinusCircleOutlined />
                                </span>
                                <span>{i + 1}.规则组</span>
                              </div>

                              <div className={styles['rule-box_inner']}>
                                <div style={{ display: 'flex' }}>
                                  <div className={styles['flex-one']}>
                                    {/* 关键代码 */}
                                    {/* -------------- */}
                                    {fields.map((field: any, index: number) => {
                                      const curItem = getItem(i, index);

                                      const ruleType: any = curItem?.ruleType || 0; // 规则类型

                                      const ruleKeyType: any = curItem?.ruleKeyType || 'text'; //词槽/变量类型
                                      // console.log('ruleKeyType: ' + ruleKeyType);
                                      const compareVal: any = curItem?.condition || undefined;

                                      const valueType: any = isNaN(curItem?.valueType)
                                        ? undefined
                                        : curItem?.valueType;

                                      let compareList: any[] =
                                        CURRENT_RULE_LIST.find((item: any) => {
                                          return ruleType === item.name;
                                        })?.list || []; // 比较关系下拉列表
                                      if (
                                        [selectMap['变量'], selectMap['词槽']].includes(ruleType)
                                      ) {
                                        let subList = conditionFilter(ruleKeyType);
                                        compareList = [...compareList, ...subList];
                                      }
                                      // console.log('重新渲染');
                                      // console.log(ruleType, compareList);

                                      const filter = (list: any[], type: any) => {
                                        // console.log(list, type);
                                        return (
                                          list?.filter((item: any) => {
                                            return item.type === type;
                                          }) || []
                                        );
                                      };

                                      return (
                                        <div key={field.key} className={styles['rule-list-box']}>
                                          <div
                                            style={{
                                              display: 'flex',
                                              alignItems: 'baseline',
                                              height: '40px',
                                            }}
                                          >
                                            <div style={{ width: '20px', flexShrink: 0 }}>
                                              <Condition r-if={index > -1}>
                                                <span
                                                  className={styles['del-bt']}
                                                  onClick={() => {
                                                    remove(index);
                                                  }}
                                                >
                                                  <MinusCircleOutlined />
                                                </span>
                                              </Condition>
                                            </div>
                                            <div className={styles['num']}>
                                              {index + 1}.规则类型
                                            </div>
                                            {/* 一级筛选 : 规则罗列 */}
                                            <div style={{ flex: 1 }}>
                                              <div>
                                                <FormItem
                                                  name={[field.name, 'ruleType']}
                                                  fieldKey={[field.fieldKey, 'ruleType']}
                                                  rules={[
                                                    { required: true, message: '请选择规则类型' },
                                                  ]}
                                                  style={{ width: '180px' }}
                                                >
                                                  <Select
                                                    placeholder="请选择规则类型"
                                                    size="small"
                                                    optionFilterProp="children"
                                                    showSearch
                                                    onChange={() => {
                                                      change(i, index, 1);
                                                    }}
                                                  >
                                                    {CURRENT_RULE_LIST.map(
                                                      (item: any, index: number) => {
                                                        return (
                                                          <Option
                                                            key={index}
                                                            value={item.name}
                                                            opt={item}
                                                          >
                                                            {item.label}
                                                          </Option>
                                                        );
                                                      },
                                                    )}
                                                  </Select>
                                                </FormItem>
                                              </div>
                                            </div>
                                          </div>
                                          {/* 二～四级筛选 */}
                                          <div
                                            style={{
                                              height: '40px',
                                            }}
                                          >
                                            <Space align="baseline">
                                              <div className={styles['label']}>如果</div>
                                              {/* 二级筛选 */}

                                              <Condition r-if={ruleType === selectMap['变量']}>
                                                <FormItem
                                                  name={[field.name, 'ruleKey']}
                                                  fieldKey={[field.fieldKey, 'ruleKey']}
                                                  style={{ width: '180px' }}
                                                  rules={[
                                                    { required: true, message: '请选择变量名称' },
                                                  ]}
                                                >
                                                  {/* 全局变量的情况 */}
                                                  <Select
                                                    placeholder="请选择变量名称"
                                                    size="small"
                                                    optionFilterProp="children"
                                                    showSearch
                                                    onChange={(val: any, opt: any) => {
                                                      change(i, index, 2, opt);
                                                    }}
                                                  >
                                                    {_globalVarList?.map(
                                                      (item: any, index: number) => {
                                                        return (
                                                          <Option
                                                            key={index}
                                                            value={item.name}
                                                            opt={item}
                                                          >
                                                            {item.label}
                                                          </Option>
                                                        );
                                                      },
                                                    )}
                                                  </Select>
                                                </FormItem>
                                              </Condition>

                                              <Condition r-if={ruleType === selectMap['词槽']}>
                                                <FormItem
                                                  name={[field.name, 'ruleKey']}
                                                  fieldKey={[field.fieldKey, 'ruleKey']}
                                                  style={{ width: '180px' }}
                                                  rules={[
                                                    { required: true, message: '请选择词槽名称' },
                                                  ]}
                                                >
                                                  {/* 词槽的情况 */}
                                                  <Select
                                                    placeholder="请选择词槽名称"
                                                    size="small"
                                                    optionFilterProp="children"
                                                    showSearch
                                                    onChange={(val: any, opt: any) => {
                                                      change(i, index, 2, opt);
                                                    }}
                                                  >
                                                    {wordSlotList?.map(
                                                      (item: any, index: number) => {
                                                        return (
                                                          <Option
                                                            key={index}
                                                            value={item.name}
                                                            opt={item}
                                                          >
                                                            {item.label}
                                                          </Option>
                                                        );
                                                      },
                                                    )}
                                                  </Select>
                                                </FormItem>
                                              </Condition>

                                              <Condition
                                                r-if={ruleType === selectMap['高级配置变量']}
                                              >
                                                <FormItem
                                                  name={[field.name, 'ruleKey']}
                                                  fieldKey={[field.fieldKey, 'ruleKey']}
                                                  style={{ width: '180px' }}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message: '请选择高级配置变量',
                                                    },
                                                  ]}
                                                >
                                                  {/* 全局变量的情况 */}
                                                  <Select
                                                    placeholder="请选择高级配置变量"
                                                    size="small"
                                                    optionFilterProp="children"
                                                    showSearch
                                                    onChange={() => {
                                                      change(i, index, 2);
                                                    }}
                                                  >
                                                    {EDGE_VAR_LIST?.map(
                                                      (item: any, index: number) => {
                                                        return (
                                                          <Option
                                                            key={index}
                                                            value={item.name}
                                                            opt={item}
                                                          >
                                                            {item.label}
                                                          </Option>
                                                        );
                                                      },
                                                    )}
                                                  </Select>
                                                </FormItem>
                                              </Condition>

                                              {/* 三级筛选 */}
                                              <FormItem
                                                name={[field.name, 'condition']}
                                                fieldKey={[field.fieldKey, 'condition']}
                                                style={{ width: '180px' }}
                                                rules={[
                                                  { required: true, message: '请选择比较关系' },
                                                ]}
                                              >
                                                {/* 全局变量的情况 */}
                                                <Select
                                                  placeholder="请选择比较关系"
                                                  size="small"
                                                  optionFilterProp="children"
                                                  showSearch
                                                  onChange={() => {
                                                    change(i, index, 3);
                                                  }}
                                                >
                                                  {compareList?.map((item: any, index: number) => {
                                                    return (
                                                      <Option
                                                        key={index}
                                                        value={item.name}
                                                        opt={item}
                                                      >
                                                        {item.label}
                                                      </Option>
                                                    );
                                                  })}
                                                </Select>
                                              </FormItem>

                                              {/* 四级筛选 */}
                                              {/* 意图的情况 */}
                                              <Condition
                                                r-if={[selectMap['意图名称']].includes(ruleType)}
                                              >
                                                <Condition
                                                  r-if={['==', '!=', undefined].includes(
                                                    compareVal,
                                                  )}
                                                >
                                                  <FormItem
                                                    name={[field.name, 'ruleValue']}
                                                    fieldKey={[field.fieldKey, 'ruleValue']}
                                                    style={{ width: '140px' }}
                                                    rules={[{ required: true, message: '请选择' }]}
                                                  >
                                                    <Select
                                                      placeholder="请选择意图名称"
                                                      size="small"
                                                      optionFilterProp="children"
                                                      showSearch
                                                    >
                                                      {wishList?.map((item: any, index: number) => {
                                                        return (
                                                          <Option
                                                            key={index}
                                                            value={item.name}
                                                            opt={item}
                                                          >
                                                            {item.label}
                                                          </Option>
                                                        );
                                                      })}
                                                    </Select>
                                                  </FormItem>
                                                </Condition>
                                                <Condition
                                                  r-if={['include', 'uninclude'].includes(
                                                    compareVal,
                                                  )}
                                                >
                                                  <FormItem
                                                    name={[field.name, 'ruleValue']}
                                                    fieldKey={[field.fieldKey, 'ruleValue']}
                                                    style={{ width: '140px' }}
                                                    rules={[{ required: true, message: '请选择' }]}
                                                  >
                                                    <Select
                                                      placeholder="请选择意图名称"
                                                      size="small"
                                                      optionFilterProp="children"
                                                      mode={'multiple'}
                                                      showSearch
                                                    >
                                                      {wishList?.map((item: any, index: number) => {
                                                        return (
                                                          <Option
                                                            key={index}
                                                            value={item.name}
                                                            opt={item}
                                                          >
                                                            {item.label}
                                                          </Option>
                                                        );
                                                      })}
                                                    </Select>
                                                  </FormItem>
                                                </Condition>
                                              </Condition>

                                              {/* 词槽 */}
                                              <Condition
                                                r-if={[
                                                  selectMap['词槽'],
                                                  selectMap['变量'],
                                                ].includes(ruleType)}
                                              >
                                                {/* 不能是已填充/未填充 */}
                                                <Condition
                                                  r-if={!['fill', 'unfill'].includes(compareVal)}
                                                >
                                                  <FormItem
                                                    name={[field.name, 'valueType']}
                                                    fieldKey={[field.fieldKey, 'valueType']}
                                                    style={{ width: '140px' }}
                                                    rules={[
                                                      { required: true, message: '请选择比较类型' },
                                                    ]}
                                                  >
                                                    <Select
                                                      placeholder="请选择比较类型"
                                                      size="small"
                                                      optionFilterProp="children"
                                                      showSearch
                                                      onChange={() => {
                                                        change(i, index, 4);
                                                      }}
                                                    >
                                                      {VALUE_TYPE_LIST?.map(
                                                        (item: any, index: number) => {
                                                          return (
                                                            <Option
                                                              key={index}
                                                              value={item.name}
                                                              opt={item}
                                                            >
                                                              {item.label}
                                                            </Option>
                                                          );
                                                        },
                                                      )}
                                                    </Select>
                                                  </FormItem>
                                                </Condition>
                                              </Condition>

                                              {/* 其他 */}
                                              <Condition
                                                r-if={[selectMap['输入文本']].includes(ruleType)}
                                              >
                                                <FormItem
                                                  name={[field.name, 'ruleValue']}
                                                  fieldKey={[field.fieldKey, 'ruleValue']}
                                                  style={{ width: '140px' }}
                                                  rules={[{ required: true, message: '请输入' }]}
                                                >
                                                  <Input
                                                    placeholder="请输入"
                                                    maxLength={150}
                                                    autoComplete="off"
                                                    size="small"
                                                  />
                                                </FormItem>
                                              </Condition>

                                              <Condition r-if={['系统时间'].includes(ruleType)}>
                                                <FormItem
                                                  name={[field.name, 'ruleValue']}
                                                  fieldKey={[field.fieldKey, 'ruleValue']}
                                                  style={{ width: '140px' }}
                                                  rules={[{ required: true, message: '请选择' }]}
                                                >
                                                  <DatePicker
                                                    placeholder="请选择系统时间"
                                                    size="small"
                                                  />
                                                </FormItem>
                                              </Condition>

                                              <Condition
                                                r-if={[selectMap['高级配置变量']].includes(
                                                  ruleType,
                                                )}
                                              >
                                                <FormItem
                                                  name={[field.name, 'ruleValue']}
                                                  fieldKey={[field.fieldKey, 'ruleValue']}
                                                  style={{ width: '140px' }}
                                                  rules={[{ required: true, message: '请选择' }]}
                                                >
                                                  <InputNumber
                                                    placeholder="请输入"
                                                    autoComplete="off"
                                                    size="small"
                                                    precision={0}
                                                    min={0}
                                                    max={1000000}
                                                    style={{ width: '140px' }}
                                                  />
                                                </FormItem>
                                              </Condition>
                                            </Space>
                                          </div>

                                          {/* 五级筛选 */}
                                          <Condition
                                            r-if={
                                              [selectMap['变量'], selectMap['词槽']].includes(
                                                ruleType,
                                              ) && valueType !== undefined
                                            }
                                          >
                                            <div
                                              style={{
                                                height: '40px',
                                              }}
                                            >
                                              <Space align="baseline">
                                                <div className={styles['label']}>选择值</div>

                                                <Condition
                                                  r-if={valueType === VALUE_TYPE_MAP['变量']}
                                                >
                                                  <FormItem
                                                    name={[field.name, 'ruleValue']}
                                                    fieldKey={[field.fieldKey, 'ruleValue']}
                                                    rules={[
                                                      { required: true, message: '请选择变量' },
                                                    ]}
                                                    style={{ width: '180px' }}
                                                  >
                                                    <Select
                                                      placeholder="请选择变量"
                                                      size="small"
                                                      optionFilterProp="children"
                                                      showSearch
                                                    >
                                                      {filter(_globalVarList, ruleKeyType)?.map(
                                                        (item: any, index: number) => {
                                                          return (
                                                            <Option
                                                              key={index}
                                                              value={item.name}
                                                              opt={item}
                                                            >
                                                              {item.label}
                                                            </Option>
                                                          );
                                                        },
                                                      )}
                                                    </Select>
                                                  </FormItem>
                                                </Condition>

                                                <Condition
                                                  r-if={valueType === VALUE_TYPE_MAP['词槽']}
                                                >
                                                  <FormItem
                                                    name={[field.name, 'ruleValue']}
                                                    fieldKey={[field.fieldKey, 'ruleValue']}
                                                    rules={[
                                                      { required: true, message: '请选择词槽' },
                                                    ]}
                                                    style={{ width: '180px' }}
                                                  >
                                                    <Select
                                                      placeholder="请选择词槽"
                                                      size="small"
                                                      optionFilterProp="children"
                                                      showSearch
                                                    >
                                                      {filter(wordSlotList, ruleKeyType)?.map(
                                                        (item: any, index: number) => {
                                                          return (
                                                            <Option
                                                              key={index}
                                                              value={item.name}
                                                              opt={item}
                                                            >
                                                              {item.label}
                                                            </Option>
                                                          );
                                                        },
                                                      )}
                                                    </Select>
                                                  </FormItem>
                                                </Condition>

                                                <Condition
                                                  r-if={
                                                    valueType === VALUE_TYPE_MAP['自定义'] &&
                                                    ruleKeyType === RULE_KEY_TYPE_MAP['number']
                                                  }
                                                >
                                                  <FormItem
                                                    name={[field.name, 'ruleValue']}
                                                    fieldKey={[field.fieldKey, 'ruleValue']}
                                                    rules={[{ required: true, message: '请输入' }]}
                                                  >
                                                    <InputNumber
                                                      placeholder="请输入"
                                                      autoComplete="off"
                                                      size="small"
                                                      precision={0}
                                                      min={0}
                                                      max={1000000}
                                                      style={{ width: '180px' }}
                                                    />
                                                  </FormItem>
                                                </Condition>

                                                <Condition
                                                  r-if={
                                                    valueType === VALUE_TYPE_MAP['自定义'] &&
                                                    ruleKeyType === RULE_KEY_TYPE_MAP['text']
                                                  }
                                                >
                                                  <FormItem
                                                    name={[field.name, 'ruleValue']}
                                                    fieldKey={[field.fieldKey, 'ruleValue']}
                                                    rules={[{ required: true, message: '请输入' }]}
                                                    style={{ width: '180px' }}
                                                  >
                                                    <Input
                                                      placeholder="请输入"
                                                      maxLength={150}
                                                      autoComplete="off"
                                                      size="small"
                                                    />
                                                  </FormItem>
                                                </Condition>

                                                <Condition
                                                  r-if={
                                                    valueType === VALUE_TYPE_MAP['自定义'] &&
                                                    ruleKeyType === RULE_KEY_TYPE_MAP['date']
                                                  }
                                                >
                                                  <FormItem
                                                    name={[field.name, 'ruleValue']}
                                                    fieldKey={[field.fieldKey, 'ruleValue']}
                                                    style={{ width: '180px' }}
                                                    rules={[
                                                      { required: true, message: '请选择日期' },
                                                    ]}
                                                  >
                                                    <DatePicker
                                                      placeholder="请选择日期"
                                                      size="small"
                                                    />
                                                  </FormItem>
                                                </Condition>
                                              </Space>
                                            </div>
                                          </Condition>
                                        </div>
                                      );
                                    })}

                                    {/* -------------- */}
                                  </div>
                                  <Condition r-if={length > 1}>
                                    <div className={styles['relation-text_bg']}>
                                      <div className={styles['relation-text']}>且</div>
                                    </div>
                                  </Condition>
                                </div>

                                <div>
                                  <Button
                                    type="link"
                                    icon={<PlusCircleOutlined />}
                                    style={{ marginLeft: '20px' }}
                                    onClick={addNew}
                                  >
                                    新增规则
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      </FormList>

                      <Condition r-if={i + 1 < length}>
                        <div className={styles['or-box_bg']}>
                          <div className={styles['or-box']}>或</div>
                        </div>
                      </Condition>
                    </div>
                  );
                })}
              </div>

              {/* 按钮组 */}
              <div>
                <Button type="link" icon={<AppstoreAddOutlined />} onClick={addOutNew}>
                  新增规则组
                </Button>
              </div>
            </div>
          </div>
        );
      }}
    </FormList>
  );
};

export default RuleConfig;
