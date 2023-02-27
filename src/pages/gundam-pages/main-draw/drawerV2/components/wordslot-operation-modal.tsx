import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { useEffect, useMemo, useRef } from 'react';
import { useModel } from 'umi';
import { OPERATOR_LIST, VALUE_TYPE_LIST } from '../const';
import styles from './style.less';
import operatorImg from '@/asset/image/operator.png';
import ScriptOperator from './script-operator';

const { Item: FormItem } = Form;
const { Option } = Select;

const InnerForm: React.FC<any> = (props: any) => {
  const { name, form, title, wordSlotList } = props;
  const dataType = Form.useWatch(['operations'], form);
  const scriptRef = useRef<any>(null);

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

  const typeChange = (val: any, index: any, type: any) => {
    let formData = form.getFieldsValue();
    let dataRow = formData[name][index];
    if (type == 'typeOne') {
      dataRow.oneValue = undefined;
    }
    if (type == 'typeTwo') {
      dataRow.twoValue = undefined;
    }
    if (type == 'operator') {
      if (val == '=' || val == 'length' || val == 'empty') {
        dataRow.twoValue = undefined;
        dataRow.typeTwo = undefined;
      }
      if (val == 'empty') {
        dataRow.oneValue = undefined;
        dataRow.typeOne = undefined;
      }
      if (val == 'pyScript') {
        dataRow.oneValue = undefined;
        dataRow.typeOne = undefined;
        dataRow.typeTwo = 3;
      }
    }
    dataRow[type] = val;
    form.setFieldsValue({ ...formData });
  };

  const formatOption = (type: any) => {
    //变量
    if (type == 1) {
      return (
        <Select
          style={{ width: '100%' }}
          placeholder="请选择变量名称"
          // size="small"
          optionFilterProp="children"
          showSearch
          onChange={(val: any, opt: any) => {
            // change(i, index, 2, opt);
          }}
          getPopupContainer={(trigger) => trigger.parentElement}
        >
          {_globalVarList?.map((item: any, index: number) => {
            return (
              <Option key={index} value={item.id} opt={item}>
                {item.label}
              </Option>
            );
          })}
        </Select>
      );
    } else if (type == 2) {
      //词槽
      return (
        <Select
          style={{ width: '100%' }}
          placeholder="请选择词槽名称"
          // size="small"
          optionFilterProp="children"
          showSearch
          onChange={(val: any, opt: any) => {
            // change(i, index, 2, opt);
          }}
          getPopupContainer={(trigger) => trigger.parentElement}
        >
          {wordSlotList?.map((item: any, index: number) => {
            return (
              <Option key={index} value={item.id} opt={item}>
                {item.label}
              </Option>
            );
          })}
        </Select>
      );
    } else {
      //自定义-3
      return (
        <Input
          style={{ width: '100%' }}
          placeholder="请输入"
          maxLength={200}
          autoComplete="off"
          // size="small"
        />
      );
    }
  };

  const formatType = (type: any, index: any) => {
    return (
      <Select
        style={{ width: '100%' }}
        onChange={(val) => {
          typeChange(val, index, type);
        }}
        placeholder="请选择"
        disabled={type == 'typeTwo' ? dataType?.[index]?.operator == 'pyScript' : false}
      >
        {VALUE_TYPE_LIST?.map((item: any, index) => {
          return (
            <Option key={item.name} value={item.name}>
              {item.label}
            </Option>
          );
        })}
      </Select>
    );
  };

  useEffect(() => {
    console.log(dataType);
  }, [dataType]);

  //脚本修改
  const setScript = (val: any, index: any) => {
    let formData = form.getFieldsValue();
    let dataRow = formData[name][index];
    dataRow.twoValue = val;
    form.setFieldsValue({ ...formData });
  };

  const titleHtml = (title: any, url: any, url2?: any) => {
    return (
      <div style={url2 ? { width: '900px' } : { width: '500px' }}>
        {title}
        <br />
        <img decoding="async" src={url} style={!url2 ? { width: '100%' } : { width: '50%' }} />
        {url2 && <img decoding="async" src={url2} style={{ width: '50%' }} />}
      </div>
    );
  };

  return (
    <div>
      <FormItem label={title} className={styles['require']}></FormItem>
      <Form.List name={name}>
        {(fields, { add, remove }) => {
          const addNew = () => {
            let length = fields.length;
            console.log(length);
            add(
              {
                typeOne: undefined,
                oneValue: undefined,
                operator: undefined,
                typeTwo: undefined,
                twoValue: undefined,
                acceptType: undefined,
                acceptValue: undefined,
              },
              length,
            );
          };
          // if (fields.length == 0) {
          //   addNew();
          // }
          return (
            <div>
              <div>
                <Row
                  align="middle"
                  style={{ marginBottom: '8px', textAlign: 'center' }}
                  gutter={[8, 4]}
                >
                  <Col span={3}>
                    类型1
                    <Tip
                      title={
                        '运算值1的类型，枚举值“变量”、“词槽”、“自定义”，输入框支持 词槽/变量的内嵌属性获取。'
                      }
                    />
                  </Col>
                  <Col span={4}>
                    运算值1
                    <Tip title={'根据“类型1”联动展示，是运算的其中一个值。'} />
                  </Col>
                  <Col span={3}>
                    运算符
                    <Tip
                      img={true}
                      title={titleHtml(
                        <span>
                          {' 将“运算值1”和“运算值2”执行运算，结果赋值于“接受值”字段。'}
                          <span style={{ color: 'red' }}>
                            {
                              ' 计算结果若是浮点数，则四舍五入保留两位小数。加减乘除要求“运算值1”和“运算值2”都必须能转化为数值（如字符串“10086”可以转化为数值10086），否则运算失败。'
                            }
                          </span>
                          <ul className={styles['operatorUl']}>
                            <li>
                              <b>{'清空：将“接受值”的值置空。'}</b>
                            </li>
                            <li>
                              <b>{'赋值：将“运算值1”的值赋值给“接受值”的值，'}</b>
                              {
                                '如下图，将词槽“来电号码”的值赋值给“短信号码”；将“10086”赋值给“运营号码”。'
                              }
                            </li>

                            <li>
                              <b>{'长度赋值：'}</b>
                              {'将“运算值1”的值的'}
                              <span style={{ color: 'red' }}>{'长度'}</span>
                              {
                                '赋值给“接受值”，如下图，将词槽“人员列表”的长度赋值给”人员数量“；假设词槽“人员列表”值为["张三","李四","王五"]，则最后赋值到人员数量的值为"3"。'
                              }
                            </li>

                            <li>
                              <b>{'计算-加：将“运算值1”的值，加上“运算值2”，再赋值到“接受值”。'}</b>
                              {'如下图，将“年龄”加上自定义值“5”，再赋值到“今年年龄”。'}
                            </li>

                            <li>
                              <b>{'计算-减：将“运算值1”的值，减去“运算值2”，再赋值到“接受值”。'}</b>
                              {'如下图，将“收入”减去词槽“支出”的值，再赋值到“结余”。'}
                            </li>

                            <li>
                              <b>{'计算-乘：将“运算值1”的值，乘以“运算值2”，再赋值到“接受值”。'}</b>
                              {'如下图，将“单价”乘以变量“数量”，再赋值到“总费用”。'}
                            </li>

                            <li>
                              <b>{'计算-除：将“运算值1”的值，除以“运算值2”，再赋值到“接受值”。'}</b>
                              {'如下图，将“总费用”除以词槽“数量”，再赋值到“单价”。'}
                            </li>
                          </ul>
                        </span>,
                        operatorImg,
                      )}
                    />
                  </Col>
                  <Col span={3}>
                    类型2
                    <Tip
                      title={
                        '运算值2的类型，枚举值“变量”、“词槽”、“自定义”，输入框支持 词槽/变量的内嵌属性获取。'
                      }
                    />
                  </Col>
                  <Col span={4}>
                    运算值2
                    <Tip title={'根据“类型2”联动展示，是运算的另一个值。'} />
                  </Col>
                  <Col span={2} style={{ whiteSpace: 'nowrap' }}>
                    接受类型
                    <Tip title={'枚举为“词槽”，决定接受值的类型。'} />
                  </Col>
                  <Col span={4}>
                    接受值
                    <Tip
                      title={
                        '运算值1和运算值2经过运算后，将结果存入此字段，接受值词槽的生命周期默认全局有效。'
                      }
                    />
                  </Col>
                  <Col span={1}></Col>
                </Row>
              </div>
              {fields.map((field, index) => {
                let formData = form?.getFieldsValue?.()?.[name]?.[index];
                console.log(dataType);
                console.log(formData);

                return (
                  <Row key={index} align="middle" style={{ marginBottom: '8px' }} gutter={[8, 4]}>
                    <Col span={3}>
                      <Condition
                        r-if={
                          dataType?.[index]?.operator != 'empty' &&
                          dataType?.[index]?.operator != 'pyScript'
                        }
                      >
                        <FormItem
                          name={[field.name, 'typeOne']}
                          fieldKey={[field.name, 'typeOne']}
                          noStyle
                          rules={[{ required: true, message: '请选择' }]}
                        >
                          {formatType('typeOne', index)}
                        </FormItem>
                      </Condition>
                    </Col>
                    <Col span={4}>
                      <Condition
                        r-if={
                          dataType?.[index]?.operator != 'empty' &&
                          dataType?.[index]?.operator != 'pyScript'
                        }
                      >
                        <FormItem
                          name={[field.name, 'oneValue']}
                          fieldKey={[field.name, 'oneValue']}
                          noStyle
                          rules={[{ required: true, message: '请选择' }]}
                          shouldUpdate={true}
                        >
                          {formatOption(dataType?.[index]?.typeOne)}
                        </FormItem>
                      </Condition>
                    </Col>
                    <Col span={3}>
                      <FormItem
                        name={[field.name, 'operator']}
                        fieldKey={[field.name, 'operator']}
                        noStyle
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          placeholder="请选择"
                          onChange={(val) => {
                            typeChange(val, index, 'operator');
                          }}
                        >
                          {OPERATOR_LIST.map((item) => {
                            return (
                              <Option key={item.value} value={item.value}>
                                {item.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={3}>
                      <Condition
                        r-if={
                          dataType?.[index]?.operator != 'empty' &&
                          dataType?.[index]?.operator != '=' &&
                          dataType?.[index]?.operator != 'length'
                        }
                      >
                        <FormItem
                          name={[field.name, 'typeTwo']}
                          fieldKey={[field.name, 'typeTwo']}
                          noStyle
                          rules={[{ required: true, message: '请选择' }]}
                        >
                          {formatType('typeTwo', index)}
                        </FormItem>
                      </Condition>
                    </Col>
                    <Col span={4}>
                      <Condition
                        r-if={
                          dataType?.[index]?.operator != 'empty' &&
                          dataType?.[index]?.operator != '=' &&
                          dataType?.[index]?.operator != 'length' &&
                          dataType?.[index]?.operator != 'pyScript'
                        }
                      >
                        <FormItem
                          name={[field.name, 'twoValue']}
                          fieldKey={[field.name, 'twoValue']}
                          noStyle
                          rules={[{ required: true, message: '请选择' }]}
                        >
                          {formatOption(dataType?.[index]?.typeTwo)}
                        </FormItem>
                      </Condition>
                      <Condition
                        r-if={
                          dataType?.[index]?.operator != 'empty' &&
                          dataType?.[index]?.operator != '=' &&
                          dataType?.[index]?.operator != 'length' &&
                          dataType?.[index]?.operator == 'pyScript'
                        }
                      >
                        <a
                          style={{ display: 'block', width: '100%', textAlign: 'center' }}
                          onClick={() => {
                            scriptRef?.current?.open(dataType?.[index]?.twoValue, index);
                          }}
                        >
                          》
                        </a>
                      </Condition>
                    </Col>
                    <Col span={2}>
                      <FormItem
                        name={[field.name, 'acceptType']}
                        fieldKey={[field.name, 'acceptType']}
                        noStyle
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          onChange={(val) => {
                            typeChange(val, index, 'acceptType');
                          }}
                          placeholder="请选择"
                        >
                          {VALUE_TYPE_LIST.filter((item) => item.name == 2)?.map(
                            //只要词槽
                            (item: any, index) => {
                              return (
                                <Option key={item.name} value={item.name}>
                                  {item.label}
                                </Option>
                              );
                            },
                          )}
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem
                        name={[field.name, 'acceptValue']}
                        fieldKey={[field.name, 'acceptValue']}
                        noStyle
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        {formatOption(dataType?.[index]?.acceptType)}
                      </FormItem>
                    </Col>
                    <Col span={1}>
                      {/* 删除按钮 */}
                      <Condition r-if={fields.length > 1}>
                        <MinusCircleOutlined
                          style={{ marginLeft: '10px', fontSize: '20px', color: '#A0A0A0' }}
                          onClick={() => {
                            remove(index);
                          }}
                        />
                      </Condition>
                    </Col>
                  </Row>
                );
              })}
              <div>
                <Button
                  type="link"
                  icon={<AppstoreAddOutlined />}
                  // style={{ marginLeft: '10px' }}
                  onClick={addNew}
                >
                  新增
                </Button>
              </div>
            </div>
          );
        }}
      </Form.List>
      <ScriptOperator cref={scriptRef} setScript={setScript} />
    </div>
  );
};

export default InnerForm;
