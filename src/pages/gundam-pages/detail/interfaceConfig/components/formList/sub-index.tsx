import { useState, useMemo } from 'react';
import { Form, Input, Select, Button, Space, DatePicker, InputNumber } from 'antd';
import { MinusCircleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import Condition from '@/components/Condition';
import { useModel } from 'umi';
import styles from './style.less';
import {
  ParamsTypeList,
  BooleanList,
  ParamsWayList,
  SystemParamsList,
  RequiredList,
  typeMap,
} from './config';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const extra = {
  autoComplete: 'off',
};

const RequestConfig = (props: any) => {
  const { form, style, name = 'testRequestParamList' } = props;

  const _width = 160;

  // 监听数组变化

  return (
    <FormList name={name}>
      {(outFields, { add: _add, remove: _remove }) => {
        return (
          <div>
            <div className={styles['zy-row']} style={{ alignItems: 'center' }}>
              <div className={styles['title']}>请求参数:</div>
              <div className={styles['mr']}>参数名称</div>
              <div className={styles['mr']}>参数值</div>
            </div>
            {outFields?.length === 0 && (
              <div
                className={styles['zy-row']}
                style={{ alignItems: 'center', marginBottom: '14px' }}
              >
                <div className={styles['title']}></div>
                <div className={styles['mr']}>-</div>
                <div className={styles['mr']}>-</div>
              </div>
            )}

            <div style={style}>
              {outFields.map((field: any, _index: number) => {
                const curItem = form.getFieldValue()?.[name]?.[_index];
                console.log(curItem);
                let dataType = curItem?.dataType || 0;
                dataType = typeMap[dataType];
                return (
                  <div key={field.key} className={styles['list-box']}>
                    <div className={styles['num']}>{_index + 1}.</div>
                    <div className={styles['mr']}>{curItem.paramName}</div>
                    {/* 规则罗列 */}
                    <Space>
                      {/* 文本 */}
                      <Condition r-if={['text'].includes(dataType)}>
                        <FormItem
                          name={[field.name, 'paramValue']}
                          style={{ width: '200px' }}
                          rules={[{ required: true, message: '请输入' }]}
                        >
                          <Input placeholder="请输入" maxLength={200} autoComplete="off" />
                        </FormItem>
                      </Condition>

                      {/* 数字 */}
                      <Condition r-if={['number'].includes(dataType)}>
                        <FormItem
                          name={[field.name, 'paramValue']}
                          style={{ width: '200px' }}
                          rules={[{ required: true, message: '请输入数字' }]}
                        >
                          <InputNumber
                            placeholder="请输入数字"
                            {...extra}
                            autoComplete="off"
                            style={{ width: '200px' }}
                          />
                        </FormItem>
                      </Condition>

                      {/* boolean */}
                      <Condition r-if={['boolean'].includes(dataType)}>
                        <FormItem
                          name={[field.name, 'paramValue']}
                          style={{ width: '200px' }}
                          rules={[{ required: true, message: '请选择' }]}
                        >
                          <Select
                            placeholder="请选择布尔值"
                            size="small"
                            optionFilterProp="children"
                            showSearch
                          >
                            {BooleanList?.map((item: any, index: number) => {
                              return (
                                <Option key={index} value={item.name}>
                                  {item.label}
                                </Option>
                              );
                            })}
                          </Select>
                        </FormItem>
                      </Condition>

                      {/* 数组 */}
                      <Condition r-if={['array'].includes(dataType)}>
                        <FormItem
                          name={[field.name, 'paramValue']}
                          style={{ width: '200px' }}
                          rules={[{ required: true, message: '请输入' }]}
                        >
                          <Input.TextArea placeholder="请输入" maxLength={200} autoComplete="off" />
                        </FormItem>
                      </Condition>

                      {/* 日期 */}
                      <Condition r-if={['date'].includes(dataType)}>
                        <FormItem
                          name={[field.name, 'paramValue']}
                          style={{ width: '200px' }}
                          rules={[{ required: true, message: '请选择日期' }]}
                        >
                          <DatePicker placeholder="请选择日期" style={{ width: '200px' }} />
                        </FormItem>
                      </Condition>

                      {/* 时间 */}
                      <Condition r-if={['datetime'].includes(dataType)}>
                        <FormItem
                          name={[field.name, 'paramValue']}
                          style={{ width: '200px' }}
                          rules={[{ required: true, message: '请选择时间' }]}
                        >
                          <DatePicker
                            showTime
                            placeholder="请选择时间"
                            style={{ width: '200px' }}
                          />
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
  );
};

export default RequestConfig;
