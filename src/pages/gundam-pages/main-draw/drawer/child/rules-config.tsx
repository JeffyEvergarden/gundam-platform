import { useState, useMemo } from 'react';
import { Form, Input, Select, Button, Space, DatePicker } from 'antd';
import { MinusCircleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import Condition from '@/components/Condition';
import { useModel } from 'umi';
import styles from '../style.less';
import { ACTION_LIST, RUlE_LIST } from '../const';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const RuleConfig = (props: any) => {
  const { wishList, wordSlotList, form } = props;

  // 监听数组变化
  const onValuesChange = (obj: any, curObj: any) => {
    // console.log(obj, curObj);
    // return null;
    let curIndex: number = -1;
    let index: number = -1;
    let item: any = obj.list.find((item: any, i: number) => {
      if (item) {
        curIndex = i;
      }
      return item;
    });
    if (!item) {
      return;
    }
    if (curIndex < 0) {
      return;
    }
    item = item['ruleList'].find((item: any, i: number) => {
      if (item) {
        index = i;
      }
      return item;
    });
    // ----------------
    if (index < 0) {
      return;
    }
    // 找出变动对象
    curObj = curObj['list'][curIndex]['ruleList'];

    let keys: any[] = Object.keys(item);
    // console.log(keys);
    if (keys.length > 1) {
      console.log('删除/新增'); // 变动参数多代表是删除/新增
      // setNum(num + 1);
      return;
    }
    // console.log('-----------');
    // console.log(obj, curObj, keys);
    const formObj: any = form.getFieldsValue();
    const list: any = formObj['list'];
    const ruleList: any[] = list[curIndex]?.ruleList;
    // 如果是rule_type 变动
    if (keys.includes('ruleType')) {
      curObj[index].ruleKey = undefined;
      curObj[index].condition = undefined; // todo
      curObj[index].ruleValue = undefined; // todo
    } else if (keys.includes('condition')) {
      if (['fill', 'unfill'].includes(curObj[index].condition)) {
        // console.log(curObj[index]);
        curObj[index].ruleValue = undefined;
      } else if (
        Array.isArray(curObj[index].ruleValue) && // 该值是数组
        !['include', 'uninclude'].includes(curObj[index].condition) //选的比较符号不是多选模式
      ) {
        curObj[index].ruleValue = curObj[index]?.ruleValue?.[1] || undefined;
      } else if (
        curObj[index].ruleValue && // 选了值
        !Array.isArray(curObj[index].ruleValue) && // 并且非数组
        ['include', 'uninclude'].includes(curObj[index].condition) // 选择了多选模式
      ) {
        curObj[index].ruleValue = [curObj[index]?.ruleValue?.[1]];
      }
    }
    // 直接更改curObj[index] 无效
    ruleList[index] = curObj[index];
    list[curIndex].ruleList = [...curObj];
    form.setFieldsValue({
      list: [...list],
    });
    // setNum(num + 1); // 刷新
    return;
  };

  const { globalVarList } = useModel('gundam' as any, (model: any) => ({
    globalVarList: model.globalVarList || [],
  }));

  const tableList: any[] = useMemo(() => {
    return globalVarList.map((item: any, index: number) => {
      return {
        ...item,
        index: index,
      };
    });
  }, [globalVarList]);

  return (
    <div>
      <Form form={form} onValuesChange={onValuesChange}>
        <FormList name="list">
          {(outFields, { add: _add, remove: _remove }) => {
            const addOutNew = () => {
              // console.log(fields);
              let length = outFields.length;
              _add(
                {
                  ruleList: [
                    {
                      ruleType: undefined,
                      ruleKey: undefined,
                      condition: undefined,
                      value: undefined,
                    },
                  ],
                },
                length,
              );
            };

            return (
              <div>
                <div>
                  <Button
                    type="link"
                    icon={<AppstoreAddOutlined />}
                    style={{ marginLeft: '10px' }}
                    onClick={addOutNew}
                  >
                    新增规则组
                  </Button>
                </div>
                {outFields.map((outFields: any, i: number) => {
                  return (
                    <div key={outFields.key}>
                      <FormList name={[outFields.name, 'ruleList']}>
                        {(fields, { add, remove }) => {
                          const addNew = () => {
                            // console.log(fields);
                            let length = fields.length;
                            add(
                              {
                                ruleType: undefined,
                                ruleKey: undefined,
                                condition: undefined,
                                ruleValue: undefined,
                              },
                              length,
                            );
                          };

                          return (
                            <div>
                              <div className={styles['zy-row']}>
                                <span style={{ width: '30px' }}>{i + 1}、</span>
                                <Button
                                  type="link"
                                  icon={<AppstoreAddOutlined />}
                                  style={{ marginLeft: '20px' }}
                                  onClick={addNew}
                                >
                                  新增规则
                                </Button>

                                <Button
                                  type="link"
                                  danger
                                  icon={<AppstoreAddOutlined />}
                                  style={{ marginLeft: '20px' }}
                                  onClick={() => {
                                    _remove(i);
                                  }}
                                >
                                  删除该规则组
                                </Button>
                              </div>
                              <div>
                                {fields.map((field: any, index: number) => {
                                  const curItem =
                                    form.getFieldValue('list')?.[i]?.['ruleList']?.[index];
                                  const ruleType: any = curItem?.ruleType || ''; // 规则类型

                                  const compareVal: any = curItem?.condition || '';

                                  const compareList: any[] =
                                    RUlE_LIST.find((item: any) => {
                                      return ruleType === item.name;
                                    })?.list || []; // 比较关系下拉列表
                                  // console.log('重新渲染');
                                  // console.log(ruleType, compareList);

                                  return (
                                    <div key={field.key} className={styles['list-box']}>
                                      <div style={{ width: '30px', flexShrink: 0 }}>
                                        <Condition r-if={index > 0}>
                                          <Button
                                            icon={<MinusCircleOutlined />}
                                            type="link"
                                            danger
                                            onClick={() => {
                                              remove(index);
                                            }}
                                          />
                                        </Condition>
                                      </div>
                                      <div className={styles['num']}>{index + 1}.</div>
                                      {/* 规则罗列 */}
                                      <Space>
                                        <FormItem
                                          name={[field.name, 'ruleType']}
                                          fieldKey={[field.fieldKey, 'ruleType']}
                                          rules={[{ required: true, message: '请选择规则类型' }]}
                                          style={{ width: '180px' }}
                                        >
                                          <Select
                                            placeholder="请选择规则类型"
                                            size="small"
                                            showSearch
                                          >
                                            {RUlE_LIST.map((item: any, index: number) => {
                                              return (
                                                <Option key={index} value={item.name} opt={item}>
                                                  {item.label}
                                                </Option>
                                              );
                                            })}
                                          </Select>
                                        </FormItem>

                                        <Condition r-if={ruleType === '变量'}>
                                          <FormItem
                                            name={[field.name, 'ruleKey']}
                                            fieldKey={[field.fieldKey, 'ruleKey']}
                                            style={{ width: '180px' }}
                                            rules={[{ required: true, message: '请选择变量名称' }]}
                                          >
                                            {/* 全局变量的情况 */}
                                            <Select
                                              placeholder="请选择变量名称"
                                              size="small"
                                              showSearch
                                            >
                                              {tableList.map((item: any, index: number) => {
                                                return (
                                                  <Option key={index} value={item.name} opt={item}>
                                                    {item.label}
                                                  </Option>
                                                );
                                              })}
                                            </Select>
                                          </FormItem>
                                        </Condition>

                                        <Condition r-if={ruleType !== '变量'}>
                                          <FormItem
                                            name={[field.name, 'ruleKey']}
                                            fieldKey={[field.fieldKey, 'ruleKey']}
                                            style={{ width: '180px' }}
                                            rules={[{ required: true, message: '请选择词槽名称' }]}
                                          >
                                            {/* 全局变量的情况 */}
                                            <Select
                                              placeholder="请选择词槽名称"
                                              size="small"
                                              showSearch
                                            >
                                              {wordSlotList.map((item: any, index: number) => {
                                                return (
                                                  <Option key={index} value={item.name} opt={item}>
                                                    {item.label}
                                                  </Option>
                                                );
                                              })}
                                            </Select>
                                          </FormItem>
                                        </Condition>

                                        <FormItem
                                          name={[field.name, 'condition']}
                                          fieldKey={[field.fieldKey, 'condition']}
                                          style={{ width: '140px' }}
                                          rules={[{ required: true, message: '请选择比较关系' }]}
                                        >
                                          {/* 全局变量的情况 */}
                                          <Select
                                            placeholder="请选择比较关系"
                                            size="small"
                                            showSearch
                                          >
                                            {compareList.map((item: any, index: number) => {
                                              return (
                                                <Option key={index} value={item.name} opt={item}>
                                                  {item.label}
                                                </Option>
                                              );
                                            })}
                                          </Select>
                                        </FormItem>

                                        {/* 意图的情况 */}
                                        <Condition r-if={['用户意图'].includes(ruleType)}>
                                          <Condition
                                            r-if={['==', '!=', undefined].includes(compareVal)}
                                          >
                                            <FormItem
                                              name={[field.name, 'ruleValue']}
                                              fieldKey={[field.fieldKey, 'ruleValue']}
                                              style={{ width: '120px' }}
                                              rules={[{ required: true, message: '请选择' }]}
                                            >
                                              <Select
                                                placeholder="请选择用户意图"
                                                size="small"
                                                showSearch
                                              >
                                                {wishList.map((item: any, index: number) => {
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
                                            r-if={['include', 'uninclude'].includes(compareVal)}
                                          >
                                            <FormItem
                                              name={[field.name, 'ruleValue']}
                                              fieldKey={[field.fieldKey, 'ruleValue']}
                                              style={{ width: '120px' }}
                                              rules={[{ required: true, message: '请选择' }]}
                                            >
                                              <Select
                                                placeholder="请选择用户意图"
                                                size="small"
                                                mode={'multiple'}
                                                showSearch
                                              >
                                                {wishList.map((item: any, index: number) => {
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

                                        {/* 槽值填充状态 */}
                                        <Condition r-if={['槽值填充状态'].includes(ruleType)}>
                                          <Condition
                                            r-if={!['fill', 'unfill'].includes(compareVal)}
                                          >
                                            <FormItem
                                              name={[field.name, 'ruleValue']}
                                              fieldKey={[field.fieldKey, 'ruleValue']}
                                              style={{ width: '120px' }}
                                              rules={[{ required: true, message: '请选择' }]}
                                            >
                                              <Input
                                                placeholder="请输入"
                                                maxLength={150}
                                                autoComplete="off"
                                                size="small"
                                              />
                                            </FormItem>
                                          </Condition>
                                        </Condition>

                                        {/* 槽值填充状态 */}
                                        <Condition r-if={['当前用户输入文本'].includes(ruleType)}>
                                          <FormItem
                                            name={[field.name, 'ruleValue']}
                                            fieldKey={[field.fieldKey, 'ruleValue']}
                                            style={{ width: '120px' }}
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

                                        <Condition r-if={['变量'].includes(ruleType)}>
                                          <FormItem
                                            name={[field.name, 'ruleValue']}
                                            fieldKey={[field.fieldKey, 'ruleValue']}
                                            style={{ width: '120px' }}
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
                                            style={{ width: '120px' }}
                                            rules={[{ required: true, message: '请选择' }]}
                                          >
                                            <DatePicker placeholder="请选择系统时间" size="small" />
                                          </FormItem>
                                        </Condition>
                                      </Space>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }}
                      </FormList>
                    </div>
                  );
                })}
              </div>
            );
          }}
        </FormList>
      </Form>
    </div>
  );
};

export default RuleConfig;
