import Condition from '@/components/Condition';
import { AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { useMemo } from 'react';
import { useModel } from 'umi';
import { VALUE_TYPE_LIST } from '../const';
import styles from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const InnerForm: React.FC<any> = (props: any) => {
  const { name, form, title, wordSlotList } = props;

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
    console.log(val);

    let formData = form.getFieldsValue()[name][index];
    if (type == 'typeOne') {
      formData.oneValue = undefined;
    }
    if (type == 'typeTwo') {
      formData.twoValue = undefined;
    }
    formData[type] = val;
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
        placeholder={'请选择类型'}
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
                typeOne: '',
                oneValue: '',
                operator: '',
                typeTwo: '',
                twoValue: '',
                acceptType: '',
                acceptValue: '',
              },
              length,
            );
          };
          return (
            <div>
              <div>
                <Row
                  align="middle"
                  style={{ marginBottom: '8px', textAlign: 'center' }}
                  gutter={[8, 4]}
                >
                  <Col span={3}>类型1</Col>
                  <Col span={4}>运算值1</Col>
                  <Col span={3}>运算符</Col>
                  <Col span={3}>类型2</Col>
                  <Col span={4}>运算值2</Col>
                  <Col span={2}>接受类型</Col>
                  <Col span={4}>接受值</Col>
                  <Col span={1}></Col>
                </Row>
              </div>
              {fields.map((field, index) => {
                let formData = form.getFieldsValue()[name][index];
                return (
                  <Row key={index} align="middle" style={{ marginBottom: '8px' }} gutter={[8, 4]}>
                    <Col span={3}>
                      <FormItem
                        name={[field.name, 'typeOne']}
                        noStyle
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        {formatType('typeOne', index)}
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem
                        name={[field.name, 'oneValue']}
                        noStyle
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        {formatOption(formData?.typeOne)}
                      </FormItem>
                    </Col>
                    <Col span={3}>
                      <FormItem
                        name={[field.name, 'operator']}
                        noStyle
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <Input></Input>
                      </FormItem>
                    </Col>
                    <Col span={3}>
                      <FormItem
                        name={[field.name, 'typeTwo']}
                        noStyle
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        {formatType('typeTwo', index)}
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem
                        name={[field.name, 'twoValue']}
                        noStyle
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        {formatOption(formData?.typeTwo)}
                      </FormItem>
                    </Col>
                    <Col span={2}>
                      <FormItem
                        name={[field.name, 'acceptType']}
                        noStyle
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <Input></Input>
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <FormItem
                        name={[field.name, 'acceptValue']}
                        noStyle
                        rules={[{ required: true, message: '请选择' }]}
                      >
                        <Input></Input>
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
    </div>
  );
};

export default InnerForm;
