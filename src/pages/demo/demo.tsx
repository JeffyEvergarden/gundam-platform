import { useState, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { getFileInfo } from 'prettier';
import { add } from 'lodash';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const DrawerForm = (props: any) => {
  const [form] = Form.useForm();

  const saveNode = () => {
    console.log(form.getFieldsValue());
  };

  const bussinessList: any[] = [
    {
      name: '00',
      label: '全部',
    },
    {
      name: '01',
      label: '火影忍者',
    },
    {
      name: '02',
      label: '死神',
    },
    {
      name: '03',
      label: '海贼王',
    },
    {
      name: '04',
      label: '死亡笔记',
    },
    {
      name: '05',
      label: '地狱骑士',
    },
  ];

  // 尾部 footer 代码
  const footer = (
    <div className={styles['zy-row_end']}>
      <Button type="primary" shape="round" onClick={saveNode}>
        保存
      </Button>
    </div>
  );

  // 修改允许的业务节点
  const onChangeRelationSelect = (val: any) => {
    let _select: any = form.getFieldValue('allowFlows') || [];
    let _banselect: any = form.getFieldValue('nonFlows') || [];
    let lastKey = _select[_select.length - 1];
    if (lastKey === '00') {
      _select = ['00'];
      _banselect = [];
    } else {
      _select = _select.filter((item: any) => item !== '00');
      _banselect = _banselect.filter((item: any) => !val.includes(item));
    }
    form?.setFieldsValue({
      allowFlows: _select,
      nonFlows: _banselect,
    });
  };

  // 修改禁止的业务节点
  const onChangeRelationBanSelect = (val: any) => {
    let _select: any = form.getFieldValue('allowFlows') || [];
    let _banselect: any = form.getFieldValue('nonFlows') || [];
    let lastKey = _select[_banselect.length - 1];
    if (lastKey === '00') {
      _banselect = ['00'];
      _select = [];
    } else {
      _banselect = _banselect.filter((item: any) => item !== '00');
      _select = _select.filter((item: any) => !val.includes(item));
    }
    form?.setFieldsValue({
      allowFlows: _select,
      nonFlows: _banselect,
    });
  };

  return (
    <Form form={form}>
      <div className={styles['antd-form']}>
        <FormItem name="allowFlows" label="允许跳转至业务流程" style={{ width: '400px' }}>
          <Select
            placeholder="请选择允许跳转至业务流程"
            mode="multiple"
            onChange={onChangeRelationSelect}
          >
            {bussinessList.map((item: any, index: number) => {
              return (
                <Option key={index} value={item.name} opt={item}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </FormItem>

        <FormItem name="nonFlows" label="禁止跳转至业务流程" style={{ width: '400px' }}>
          <Select
            placeholder="请选择禁止跳转至业务流程"
            mode="multiple"
            onChange={onChangeRelationBanSelect}
          >
            {bussinessList.map((item: any, index: number) => {
              return (
                <Option key={index} value={item.name} opt={item}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        </FormItem>
      </div>

      {footer}
    </Form>
  );
};

export default DrawerForm;
