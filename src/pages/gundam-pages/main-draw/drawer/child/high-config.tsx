import { useState } from 'react';
import { Form, Select, Button, Checkbox, Space, InputNumber } from 'antd';
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  SettingOutlined,
  CaretUpOutlined,
} from '@ant-design/icons';
import LabelSelect from '../components/label-select';
import GlobalVarButton from '../components/global-var-button';
import Condition from '@/components/Condition';
import styles from '../style.less';
import { ACTION_LIST } from '../const';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const HighConfig = (props: any) => {
  const { form, wishList, bussinessList } = props;

  const [flag, setFlag] = useState<boolean>(false);

  // 修改允许的业务节点
  const onChangeRelationSelect = (val: any) => {
    let _select: any = form.getFieldValue('nonFlows') || [];
    _select = _select.filter((item: any) => !val.includes(item));
    form?.setFieldsValue({
      nonFlows: _select,
    });
  };

  // 修改禁止的业务节点
  const onChangeRelationBanSelect = (val: any) => {
    let _select: any = form.getFieldValue('allowFlows') || [];
    _select = _select.filter((item: any) => !val.includes(item));
    form?.setFieldsValue({
      allowFlows: _select,
    });
  };
  return (
    <>
      <div className={styles['antd-form']}>
        <div
          className={styles['title']}
          onClick={() => {
            setFlag(!flag);
          }}
        >
          高级配置
          <span style={{ color: '#1890ff', marginLeft: '8px' }}>
            {!flag && <SettingOutlined />}
            {flag && <CaretUpOutlined />}
          </span>
        </div>
      </div>

      <Condition r-show={flag}>
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

        {/* 静默处理 */}

        <FormList name="silenceText">
          {(fields, { add, remove }) => {
            const addNew = () => {
              let length = fields.length;
              add({ actionText: '', textLabels: [] }, length);
            };

            return (
              <div style={{ paddingLeft: '20px' }}>
                <div className={styles['zy-row']}>
                  <div className={styles['title_sec']} style={{ marginRight: '20px' }}>
                    静默处理:
                  </div>
                  <Button type="link" icon={<PlusCircleOutlined />} onClick={addNew}></Button>
                </div>

                {fields.map((field: any, index: number) => (
                  <div
                    key={field.key}
                    className={styles['list-box']}
                    style={{ marginLeft: '30px' }}
                  >
                    <div className={styles['num']}>{index + 1}.</div>
                    <div>
                      <Form.Item
                        name={[field.name, 'actionText']}
                        fieldKey={[field.fieldKey, 'actionText']}
                        label="响应话术"
                        rules={[{ required: true, message: '请输入响应话术' }]}
                      >
                        <GlobalVarButton
                          placeholder="请输入响应话术"
                          style={{ width: '400px' }}
                          autoComplete="off"
                        />
                      </Form.Item>

                      <Form.Item
                        name={[field.name, 'textLabels']}
                        fieldKey={[field.fieldKey, 'textLabels']}
                        label="选择标签"
                      >
                        <LabelSelect color="orange"></LabelSelect>
                      </Form.Item>
                    </div>

                    <Button
                      icon={<MinusCircleOutlined />}
                      type="link"
                      onClick={() => {
                        remove(index);
                      }}
                    />
                  </div>
                ))}
              </div>
            );
          }}
        </FormList>

        <Space style={{ paddingLeft: '50px', paddingTop: '10px' }}>
          <FormItem
            name="silenceHungup"
            label="是否结束挂机"
            valuePropName="checked"
            style={{ width: '200px' }}
          >
            <Checkbox>结束挂机</Checkbox>
          </FormItem>

          <FormItem name="silenceTransfer" label="动作" style={{ width: '200px' }}>
            <Select placeholder="请选择动作" size="small">
              {ACTION_LIST.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.name} opt={item}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Space>

        {/* 拒绝处理 */}

        <FormList name="discernText">
          {(fields, { add, remove }) => {
            const addNew = () => {
              let length = fields.length;
              add({ actionText: '', textLabels: [] }, length);
            };

            return (
              <div style={{ paddingLeft: '20px' }}>
                <div className={styles['zy-row']}>
                  <div className={styles['title_sec']} style={{ marginRight: '20px' }}>
                    拒绝处理:
                  </div>
                  <Button type="link" icon={<PlusCircleOutlined />} onClick={addNew}></Button>
                </div>

                {fields.map((field: any, index: number) => (
                  <div
                    key={field.key}
                    className={styles['list-box']}
                    style={{ marginLeft: '30px' }}
                  >
                    <div className={styles['num']}>{index + 1}.</div>
                    <div>
                      <Space>
                        <FormItem
                          name={[field.name, 'actionText']}
                          fieldKey={[field.fieldKey, 'actionText']}
                          label="响应话术"
                          rules={[{ required: true, message: '请输入响应话术' }]}
                        >
                          <GlobalVarButton
                            placeholder="请输入响应话术"
                            style={{ width: '400px' }}
                            autoComplete="off"
                          />
                        </FormItem>
                      </Space>

                      <FormItem
                        name={[field.name, 'textLabels']}
                        fieldKey={[field.fieldKey, 'textLabels']}
                        label="选择标签"
                      >
                        <LabelSelect color="orange"></LabelSelect>
                      </FormItem>
                    </div>

                    <Button
                      icon={<MinusCircleOutlined />}
                      type="link"
                      onClick={() => {
                        remove(index);
                      }}
                    />
                  </div>
                ))}
              </div>
            );
          }}
        </FormList>

        <Space style={{ paddingLeft: '50px', paddingTop: '10px' }}>
          <FormItem
            name="discernHungup"
            label="是否结束挂机"
            valuePropName="checked"
            style={{ width: '200px' }}
          >
            <Checkbox>结束挂机</Checkbox>
          </FormItem>

          <FormItem name="discernTransfer" label="动作" style={{ width: '200px' }}>
            <Select placeholder="请选择动作" size="small">
              {ACTION_LIST.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.name} opt={item}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
        </Space>

        <div style={{ paddingLeft: '20px' }}>
          <div className={styles['title_sec']} style={{ marginRight: '20px' }}>
            客户未听清处理:
          </div>
          <div style={{ marginLeft: '30px' }}>
            <FormItem name="repeatIntent" label="未听清意图名称" style={{ width: '400px' }}>
              <Select placeholder="请选择未听清意图名称">
                {wishList.map((item: any, index: number) => {
                  return (
                    <Option key={index} value={item.name} opt={item}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </FormItem>

            <FormItem name="repeatSize" label="重复次数" style={{ width: '400px' }}>
              <InputNumber min={1} />
            </FormItem>

            <Space>
              <FormItem
                name="repeatHungup"
                label="是否结束挂机"
                valuePropName="checked"
                style={{ width: '220px' }}
              >
                <Checkbox>结束挂机</Checkbox>
              </FormItem>

              <FormItem name="repeatTransfer" label="动作" style={{ width: '200px' }}>
                <Select placeholder="请选择动作" size="small">
                  {ACTION_LIST.map((item: any, index: number) => {
                    return (
                      <Option key={index} value={item.name} opt={item}>
                        {item.label}
                      </Option>
                    );
                  })}
                </Select>
              </FormItem>
            </Space>

            <FormItem name="repeatTransferText" label="过渡话术">
              <GlobalVarButton
                placeholder="请输入过渡话术"
                style={{ width: '400px' }}
                autoComplete="off"
              />
            </FormItem>

            <FormItem name="textLabels" label="选择标签">
              <LabelSelect color="orange"></LabelSelect>
            </FormItem>
          </div>
        </div>
      </Condition>
    </>
  );
};

export default HighConfig;
