import { useState, useMemo } from 'react';
import { Form, Input, Select, Button, Space, DatePicker, InputNumber } from 'antd';
import { MinusCircleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import Condition from '@/components/Condition';
import { useModel } from 'umi';
import styles from './style.less';
import { ParamsTypeList, BooleanList, ParamsWayList, paramValueList, RequiredList } from './config';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const RequestConfig = (props: any) => {
  const { form, style, name = 'requestParamList' } = props;

  const _width = 136;

  const onWayChange = (val: any, index: number) => {
    let formData: any = form.getFieldsValue()?.[name] || [];
    // console.log(form.getFieldsValue(), formData);
    if (val === 1) {
      formData[index].require = 1;
      formData[index].paramValue = '$UUID36';
    } else {
      formData[index].paramValue = undefined;
    }
    form.setFieldsValue({ [name]: [...formData] });
  };

  const onRequiredChange = (val: any, index: number) => {
    let formData: any = form.getFieldsValue()?.[name] || [];
    const _paramValueType = formData[index].paramValueType;
    if (_paramValueType === 0) {
      // 用户输入
      formData[index].paramValue = undefined; // 不准天
    } else if (val === 0) {
      formData[index].paramValue = undefined;
    } else {
      formData[index].paramValue = undefined;
    }
    form.setFieldsValue({ [name]: [...formData] });
  };

  // 监听数组变化

  return (
    <FormList name={name}>
      {(outFields, { add: _add, remove: _remove }) => {
        const addOutNew = () => {
          // console.log(fields);
          let length = outFields.length;
          _add(
            {
              paramName: undefined,
              paramKey: undefined,
              dataType: 0,
              paramValueType: 0,
              require: 1,
              paramValue: undefined,
            },
            length,
          );
        };

        return (
          <div>
            <div className={styles['zy-row']} style={{ alignItems: 'center' }}>
              <div className={styles['title']}>请求参数:</div>
              <div className={styles['mr']}>参数名称</div>
              <div className={styles['mr']}>参数ID</div>
              <div className={styles['mr']}>参数类型</div>
              <div className={styles['mr']}>输入方式</div>
              <div className={styles['mr']} style={{ width: '100px' }}>
                是否必填
              </div>
              <div className={styles['mr']} style={{ width: '80px' }}>
                系统参数
              </div>
              <Button
                type="link"
                size="large"
                icon={<AppstoreAddOutlined />}
                onClick={addOutNew}
              ></Button>
            </div>
            {outFields?.length === 0 && (
              <div
                className={styles['zy-row']}
                style={{ alignItems: 'center', marginBottom: '14px' }}
              >
                <div className={styles['title']}></div>
                <div className={styles['mr']}>-</div>
                <div className={styles['mr']}>-</div>
                <div className={styles['mr']}>-</div>
                <div className={styles['mr']}>-</div>
                <div className={styles['mr']} style={{ width: '100px' }}>
                  -
                </div>
                <div className={styles['mr']}>-</div>
              </div>
            )}

            <div style={style}>
              {outFields.map((field: any, _index: number) => {
                const curItem = form.getFieldValue()?.[name]?.[_index];

                const dataType: any = curItem?.dataType || ''; // 参数类型

                const paramValueType: any = curItem?.paramValueType; // 输入方式

                const require = curItem?.require;

                const isRequiredDisabled = paramValueType === 1; // 为 系统输入 时不准填
                const isSysParamsDisabled = require === 0 || paramValueType === 0; // 必填为否，不准填

                return (
                  <div key={field.key} className={styles['list-box']}>
                    <div className={styles['num']}>{_index + 1}.</div>
                    {/* 规则罗列 */}
                    <Space>
                      {/* 参数名称 */}
                      <FormItem
                        name={[field.name, 'paramName']}
                        rules={[{ required: true, message: '请输入参数名称' }]}
                        style={{ width: _width + 'px' }}
                      >
                        <Input
                          placeholder="请输入参数名称"
                          maxLength={50}
                          autoComplete="off"
                          size="small"
                        />
                      </FormItem>

                      {/* 参数ID */}
                      <FormItem
                        name={[field.name, 'paramKey']}
                        rules={[{ required: true, message: '请输入参数ID' }]}
                        style={{ width: _width + 'px' }}
                      >
                        <Input
                          placeholder="请输入参数ID"
                          maxLength={50}
                          autoComplete="off"
                          size="small"
                        />
                      </FormItem>

                      {/* 参数类型 */}
                      <FormItem
                        name={[field.name, 'dataType']}
                        rules={[{ required: true, message: '请选择参数类型' }]}
                        style={{ width: _width + 'px' }}
                      >
                        <Select
                          placeholder="请选择参数类型"
                          size="small"
                          optionFilterProp="children"
                          showSearch
                        >
                          {ParamsTypeList?.map((item: any, index: number) => {
                            return (
                              <Option key={index} value={item.value} opt={item}>
                                {item.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>

                      {/* 输入方式 */}
                      <FormItem
                        name={[field.name, 'paramValueType']}
                        rules={[{ required: true, message: '请选择输入方式' }]}
                        style={{ width: _width + 'px' }}
                      >
                        <Select
                          placeholder="请选择输入方式"
                          size="small"
                          optionFilterProp="children"
                          showSearch
                          onChange={(val) => {
                            onWayChange(val, _index);
                          }}
                        >
                          {ParamsWayList?.map((item: any, index: number) => {
                            return (
                              <Option key={index} value={item.name} opt={item}>
                                {item.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>

                      {/* 是否必填 */}
                      <FormItem
                        name={[field.name, 'require']}
                        rules={[{ required: true, message: '请选择是否必填' }]}
                        style={{ width: '100px' }}
                      >
                        <Select
                          placeholder="是否必填"
                          size="small"
                          optionFilterProp="children"
                          showSearch
                          disabled={isRequiredDisabled}
                          onChange={(val) => {
                            onRequiredChange(val, _index);
                          }}
                        >
                          {RequiredList?.map((item: any, index: number) => {
                            return (
                              <Option key={index} value={item.name} opt={item}>
                                {item.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>

                      {/* 系统参数 */}
                      <FormItem
                        name={[field.name, 'paramValue']}
                        rules={[{ required: !isSysParamsDisabled, message: '请选择系统参数' }]}
                        style={{ width: _width + 'px' }}
                      >
                        <Select
                          placeholder="请选择系统参数"
                          size="small"
                          optionFilterProp="children"
                          showSearch
                          disabled={isSysParamsDisabled}
                        >
                          {paramValueList?.map((item: any, index: number) => {
                            return (
                              <Option key={index} value={item.name} opt={item}>
                                {item.label}
                              </Option>
                            );
                          })}
                        </Select>
                      </FormItem>
                    </Space>

                    <div style={{ width: '30px', flexShrink: 0 }}>
                      <Condition r-if={_index > -1}>
                        <Button
                          icon={<MinusCircleOutlined />}
                          type="link"
                          danger
                          onClick={() => {
                            _remove(_index);
                          }}
                        />
                      </Condition>
                    </div>
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
