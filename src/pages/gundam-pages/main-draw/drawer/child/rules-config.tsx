import { useState, useMemo } from 'react';
import { Drawer, Form, Input, Select, Button, Checkbox, Space, InputNumber, Radio } from 'antd';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  SettingOutlined,
  CaretUpOutlined,
  AppstoreAddOutlined,
} from '@ant-design/icons';
import LabelSelect from '../components/label-select';
import GlobalVarButton from '../components/global-var-button';
import Condition from '@/components/Condition';
import { useModel } from 'umi';
import styles from '../style.less';
import { ACTION_LIST, RUlE_LIST } from '../const';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const RuleConfig = (props: any) => {
  const { wishList, form } = props;

  const [num, setNum] = useState<any>(0);

  // 监听数组变化
  const onValuesChange = (obj: any, curObj: any) => {
    let index: number = -1;
    curObj = curObj['rule_list'];
    let item: any = obj.rule_list.find((item: any, i: number) => {
      if (item) {
        index = i;
      }
      return item;
    });
    if (index < 0) {
      return null;
    }
    let keys: any[] = Object.keys(item);
    console.log(keys);
    // 如果是rule_type 变动
    if (keys.includes('rule_type')) {
      console.log(curObj);
      curObj[index].rule_var = undefined;
      curObj[index].compare = undefined; // todo
      curObj[index].value = undefined; // todo
    } else if (keys.includes('compare')) {
      if (['fill', 'unfill'].includes(curObj[index].compare)) {
        console.log(curObj[index]);
        curObj[index].value = undefined;
      } else if (
        Array.isArray(curObj[index].value) && // 该值是数组
        !['include', 'uninclude'].includes(curObj[index].compare) //选的比较符号不是多选模式
      ) {
        curObj[index].value = curObj[index]?.value?.[1] || undefined;
      } else if (
        curObj[index].value && // 选了值
        !Array.isArray(curObj[index].value) && // 并且非数组
        ['include', 'uninclude'].includes(curObj[index].compare) // 选择了多选模式
      ) {
        curObj[index].value = [curObj[index]?.value?.[1]];
      }
    }
    setNum(num + 1); // 刷新
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
        <FormList name="rule_list">
          {(fields, { add, remove }) => {
            const addNew = () => {
              // console.log(fields);
              let length = fields.length;
              console.log(length);
              add({}, length);
            };

            return (
              <div style={{ paddingLeft: '20px' }}>
                <div className={styles['title']}>
                  触发规则
                  <Button
                    type="link"
                    icon={<AppstoreAddOutlined />}
                    style={{ marginLeft: '10px' }}
                    onClick={addNew}
                  >
                    新增规则
                  </Button>
                </div>
                <div>
                  {fields.map((field: any, index: number) => {
                    const curItem = form.getFieldValue('rule_list')?.[index];
                    const rule_type: any = curItem?.rule_type || ''; // 规则类型

                    const compareVal: any = curItem?.compare || '';

                    const compareList: any[] =
                      RUlE_LIST.find((item: any) => {
                        return rule_type === item.name;
                      })?.list || []; // 比较关系下拉列表
                    // console.log('重新渲染');
                    // console.log(rule_type, compareList);

                    return (
                      <div key={field.key} className={styles['list-box']}>
                        <div style={{ width: '30px', flexShrink: 0 }}>
                          <Button
                            icon={<MinusCircleOutlined />}
                            type="link"
                            danger
                            onClick={() => {
                              remove(index);
                            }}
                          />
                        </div>
                        <div className={styles['num']}>{index + 1}.</div>
                        {/* 规则罗列 */}
                        <Space>
                          <FormItem
                            name={[field.name, 'rule_type']}
                            fieldKey={[field.fieldKey, 'rule_type']}
                            style={{ width: '180px' }}
                          >
                            <Select placeholder="请选择规则类型" size="small">
                              {RUlE_LIST.map((item: any, index: number) => {
                                return (
                                  <Option key={index} value={item.name} opt={item}>
                                    {item.label}
                                  </Option>
                                );
                              })}
                            </Select>
                          </FormItem>

                          <FormItem
                            name={[field.name, 'rule_var']}
                            fieldKey={[field.fieldKey, 'rule_var']}
                            style={{ width: '180px' }}
                          >
                            {/* 全局变量的情况 */}
                            <Select placeholder="请选择变量/词槽名称" size="small">
                              {tableList.map((item: any, index: number) => {
                                return (
                                  <Option key={index} value={item.name} opt={item}>
                                    {item.label}
                                  </Option>
                                );
                              })}
                            </Select>
                          </FormItem>

                          <FormItem
                            name={[field.name, 'compare']}
                            fieldKey={[field.fieldKey, 'compare']}
                            style={{ width: '140px' }}
                          >
                            {/* 全局变量的情况 */}
                            <Select placeholder="请选择比较关系" size="small">
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
                          <Condition r-if={['用户意图'].includes(rule_type)}>
                            <Condition r-if={['==', '!=', undefined].includes(compareVal)}>
                              <FormItem
                                name={[field.name, 'value']}
                                fieldKey={[field.fieldKey, 'value']}
                                style={{ width: '120px' }}
                              >
                                <Select placeholder="请选择用户意图" size="small">
                                  {wishList.map((item: any, index: number) => {
                                    return (
                                      <Option key={index} value={item.name} opt={item}>
                                        {item.label}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </FormItem>
                            </Condition>
                            <Condition r-if={['include', 'uninclude'].includes(compareVal)}>
                              <FormItem
                                name={[field.name, 'value']}
                                fieldKey={[field.fieldKey, 'value']}
                                style={{ width: '120px' }}
                              >
                                <Select placeholder="请选择用户意图" size="small" mode={'multiple'}>
                                  {wishList.map((item: any, index: number) => {
                                    return (
                                      <Option key={index} value={item.name} opt={item}>
                                        {item.label}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </FormItem>
                            </Condition>
                          </Condition>

                          {/* 槽值填充状态 */}
                          <Condition r-if={['槽值填充状态'].includes(rule_type)}>
                            <Condition r-if={!['fill', 'unfill'].includes(compareVal)}>
                              <FormItem
                                name={[field.name, 'value']}
                                fieldKey={[field.fieldKey, 'value']}
                                style={{ width: '120px' }}
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
                          <Condition r-if={['当前用户输入文本'].includes(rule_type)}>
                            <FormItem
                              name={[field.name, 'value']}
                              fieldKey={[field.fieldKey, 'value']}
                              style={{ width: '120px' }}
                            >
                              <Input
                                placeholder="请输入"
                                maxLength={150}
                                autoComplete="off"
                                size="small"
                              />
                            </FormItem>
                          </Condition>

                          <Condition r-if={['变量'].includes(rule_type)}>
                            <FormItem
                              name={[field.name, 'value']}
                              fieldKey={[field.fieldKey, 'value']}
                              style={{ width: '120px' }}
                            >
                              <Select placeholder="请选择变量" size="small">
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
                        </Space>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
        </FormList>
      </Form>
    </div>
  );
};

export default RuleConfig;
