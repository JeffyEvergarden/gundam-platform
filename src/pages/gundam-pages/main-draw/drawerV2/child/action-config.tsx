import { useState, useMemo } from 'react';
import { Form, Input, Select, Button, Space, DatePicker, InputNumber, Cascader } from 'antd';
import { MinusCircleOutlined, AppstoreAddOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Condition from '@/components/Condition';
import CvsInput from '../components/cvs-input';
import LabelSelect from '../../drawer/components/label-select';
import { useModel } from 'umi';
import styles from './style.less';
import { ACTION_LIST } from '../const';
import { useCallback } from 'react';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const ActionConfig = (props: any) => {
  const { name, title, formName: _formName, form, titleType = 1 } = props;

  const [num, setNum] = useState<number>(1);

  const update = useCallback(() => {
    setNum(num + 1);
  }, [num]);

  const getFormName = (text: any) => {
    if (name !== undefined) {
      if (name instanceof Array) {
        return [...name, text];
      } else {
        return [name, text];
      }
    } else {
      return text;
    }
  };

  const { flowList, globalVarList } = useModel('gundam' as any, (model: any) => ({
    flowList: model.flowList,
    globalVarList: model.globalVarList,
  }));

  const { messageList, wordSlotList } = useModel('drawer' as any, (model: any) => ({
    messageList: model._messageList,
    wordSlotList: model._wordSlotList,
  }));

  const cascaderList: any = useMemo(() => {
    const options: any[] = [
      {
        value: 1,
        label: '变量',
        children: globalVarList.map((item: any) => {
          return {
            value: item.name,
            label: item.label,
          };
        }),
      },
      {
        value: 2,
        label: '词槽',
        children: wordSlotList.map((item: any) => {
          return {
            value: item.name,
            label: item.label,
          };
        }),
      },
    ];
    return options;
  }, [wordSlotList, globalVarList]);

  const isArray = Array.isArray(_formName);
  const key = isArray ? _formName[0] : _formName;

  const getItem = () => {
    let item: any = null;
    if (isArray) {
      _formName.forEach((key: any, index: number) => {
        if (index === 0) {
          item = form.getFieldValue(key);
        } else {
          item = item?.[key] || {};
        }
      });
    } else {
      item = form.getFieldValue(_formName);
    }
    return item;
  };

  const currentItem = getItem();
  const _actionType = currentItem?.actionType;
  // console.log('--------', currentItem, _actionType);

  const change = (val: any) => {
    const item = getItem();
    item.toFlowId = undefined;
    const list = form.getFieldValue(key);
    if (isArray && list instanceof Array) {
      form.setFieldsValue({
        [key]: [...list],
      });
    } else {
      // console.log(form.getFieldValue());
      // console.log('change:', key, item);
      form.setFieldsValue({
        [key]: {
          ...item,
        },
      });
      update();
    }
  };

  const changeItem = (opt: any, index: number) => {
    const item = getItem();
    const currenItem = item?.messageList?.[index];
    let obj = opt?.opt;
    currenItem.placeholder = obj.placeholder;
    currenItem.content = obj.content;
    update();
  };

  const innerHtml = (
    <div className={styles['action-config']}>
      <div className={styles['zy-row']} style={{ marginBottom: '10px' }}>
        {titleType === 1 && <div className={styles['title_sp']}>{title || '执行动作'}</div>}
        {titleType === 2 && <div className={styles['title_third']}>{title || '执行动作'}</div>}
      </div>

      <div>
        <Space>
          <FormItem name={getFormName('actionType')} label="跳转动作">
            <Select
              placeholder="请选择跳转动作"
              optionFilterProp="children"
              showSearch
              onChange={change}
              style={{ width: '220px' }}
            >
              {ACTION_LIST.map((item: any, index: number) => {
                return (
                  <Option key={index} value={item.name} opt={item}>
                    {item.label}
                  </Option>
                );
              })}
            </Select>
          </FormItem>
          <Condition r-if={_actionType === 2}>
            <FormItem name={getFormName('toFlowId')}>
              <Select
                placeholder="请选择跳转业务流程"
                optionFilterProp="children"
                showSearch
                style={{ width: '220px' }}
              >
                {flowList.map((item: any, index: number) => {
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
        <FormItem name={getFormName('actionText')} label="话术">
          <CvsInput
            placeholder="请输入话术内容"
            type="textarea"
            style={{ width: '100%' }}
            autoComplete="off"
            rows={3}
          />
        </FormItem>

        <FormItem name={getFormName('textLabels')} label="选择标签">
          <LabelSelect color="magenta"></LabelSelect>
        </FormItem>

        <div className={'ant-form-item-label'}>
          <label>短信发送</label>
        </div>

        <div className={styles['action-box']}>
          <FormList name={getFormName('messageList')}>
            {(outFields, { add: _add, remove: _remove }) => {
              const addOutNew = () => {
                // console.log(fields);
                let length = outFields.length;
                _add(
                  {
                    messageNode: undefined,
                    telPhone: undefined,
                    content: '',
                    placeholder: [],
                  },
                  length,
                );
              };

              return (
                <div className={styles['cvs-box']}>
                  {outFields.map((field: any, index: number) => {
                    const _item = getItem();
                    const currentItem = _item?.messageList?.[index];

                    const content: any = currentItem.content;

                    return (
                      <div key={field.key} className={styles['message-box']}>
                        <div style={{ lineHeight: '32px' }}>
                          <span
                            className={styles['del-bt']}
                            onClick={() => {
                              _remove(index);
                            }}
                          >
                            <MinusCircleOutlined />
                          </span>
                          <span className={styles['cvs-num']}>{index + 1}.</span>
                        </div>
                        <div style={{ flex: '1 1 auto' }}>
                          <div>
                            <Space>
                              {/* 类型 */}
                              <Form.Item
                                label={'短信模版'}
                                name={[field.name, 'messageNode']}
                                fieldKey={[field.fieldKey, 'messageNode']}
                                rules={[{ required: true, message: '请选择短信模版' }]}
                              >
                                <Select
                                  placeholder="请选择短信模版"
                                  optionFilterProp="children"
                                  showSearch
                                  style={{ width: '200px' }}
                                  onChange={(val: any, opt: any) => {
                                    changeItem(opt, index);
                                  }}
                                >
                                  {messageList.map((item: any, index: number) => {
                                    return (
                                      <Option key={index} value={item.name} opt={item}>
                                        {item.label}
                                      </Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>

                              <Form.Item
                                name={[field.name, 'telPhone']}
                                fieldKey={[field.fieldKey, 'telPhone']}
                                label="接受号码"
                                rules={[{ required: true, message: '请选择接受号码' }]}
                              >
                                <Cascader
                                  options={cascaderList}
                                  expandTrigger="hover"
                                  displayRender={(label: any[]) => {
                                    return label[label.length - 1];
                                  }}
                                  style={{ width: '200px' }}
                                />
                              </Form.Item>
                            </Space>
                            <Condition r-if={content}>
                              <div className={styles['cvs-row']}>
                                <div className={styles['cvs-label']}>模版内容</div>
                                <div className={styles['cvs-content']}>{content}</div>
                              </div>
                            </Condition>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div>
                    <Button
                      type="link"
                      icon={<AppstoreAddOutlined />}
                      style={{ marginLeft: '10px' }}
                      onClick={addOutNew}
                    >
                      新增短信发送
                    </Button>
                  </div>
                </div>
              );
            }}
          </FormList>
        </div>
      </div>
    </div>
  );

  return innerHtml;
};

export default ActionConfig;
