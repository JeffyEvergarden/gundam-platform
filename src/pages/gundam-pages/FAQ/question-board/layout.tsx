import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Select, Space, DatePicker, Switch, Checkbox } from 'antd';
import Condition from '@/components/Condition';
import { PlusOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import SpCheckbox from './components/sp-checkbox';
import Selector from './components/selector';
import SelectorModal from './components/selector-modal';
import EditBoard from './index';
import { useModel } from 'umi';
import style from './style.less';
import { CHANNAL_LIST } from './test';

const { Option } = Select;

const { List: FormList } = Form;

const Board: React.FC<any> = (props: any) => {
  const { title = ' 添加问题' } = props;

  const [form] = Form.useForm();

  const typeList: any[] = [
    {
      value: 'fake1',
      label: 'fake1',
    },
    {
      value: 'fake2',
      label: 'fake2',
    },
  ];

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { getFlowList, getTreeData } = useModel('drawer' as any, (model: any) => ({
    getFlowList: model.getFlowList,
    getTreeData: model.getTreeData,
  }));

  useEffect(() => {
    getFlowList(info.id);
    getTreeData(info.id);
  }, []);

  const getItem = () => {
    const _item = form.getFieldsValue();
    return _item?.['answerList'];
  };

  const updateFn = () => {
    const _item = form.getFieldsValue()?.['answerList'] || [];
    form.setFieldsValue({
      answerList: [..._item],
    });
  };

  const changeCheckbox = (index: number, val: any) => {
    const _list = form.getFieldsValue()?.['answerList'] || [];

    _list.forEach((item: any, i: number) => {
      if (index === i) {
        return;
      }
      if (val.includes(0)) {
        item.channel = [];
      } else {
        item.channel = item.channel.filter((subitem: any) => {
          return !val.includes(subitem);
        });
      }
    });
    form.setFieldsValue({
      answerList: [..._list],
    });
  };

  // 推荐启用按钮
  const [showAdvise, setShowAdvise] = useState<boolean>(true);

  const changeAdvise = (e: any) => {
    setShowAdvise(e.target.checked);
  };

  const selectModalRef = useRef<any>();
  const opRecordRef = useRef<any>({});

  const getRecommendItem = () => {
    const _item = form.getFieldsValue();
    return _item?.['recommendList'] || [];
  };

  // 打开弹窗
  const openModal = (index: number) => {
    const _list = getRecommendItem();
    (selectModalRef.current as any).open(_list[index]);
    opRecordRef.current.callback = (obj: any) => {
      const _list = getRecommendItem();
      _list[index] = { ...obj };
      form.setFieldsValue({
        recommendList: [..._list],
      });
    };
  };

  const confirm = (obj: any) => {
    console.log(obj);
    opRecordRef.current?.callback?.(obj);
  };

  return (
    <div className={style['board-page']}>
      <div className={style['board-title']}>{title}</div>

      <div className={style['board-form']}>
        <Form form={form}>
          <div className={'ant-form-vertical'}>
            <Form.Item
              name="questionName"
              label="问题名称"
              rules={[{ required: true }]}
              style={{ width: '600px' }}
            >
              <Input placeholder={'请输入问题名称'} />
            </Form.Item>

            <Form.Item
              name="questionType"
              label="问题分类"
              rules={[{ required: true }]}
              style={{ width: '300px' }}
            >
              <Select placeholder={'请选择问题分类'}>
                {typeList.map((item: any, index: number) => {
                  return (
                    <Option key={index} value={item.value} opt={item}>
                      {item.label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
          <FormList name="answerList">
            {(fields, { add, remove }) => {
              const addNew = () => {
                let length = fields.length;
                // console.log(length);
                add(
                  {
                    answer: '',
                    channel: [],
                    timeFlag: false,
                    time: null,
                  },
                  length,
                );
              };

              return (
                <div>
                  <div className={style['answer-box']}>
                    {fields.map((field: any, index: number) => {
                      const currentItem = getItem();

                      const _showTime = currentItem?.[index]?.timeFlag;

                      return (
                        <div key={field.key} className={style['diy-row']}>
                          <div className={style['zy-row']} style={{ paddingBottom: '6px' }}>
                            <span
                              className={style['del-bt']}
                              onClick={() => {
                                remove(index);
                              }}
                            >
                              <MinusCircleOutlined />
                            </span>
                            <span className={'ant-form-item-label'}>
                              <span>{index + 1}</span>
                              <label className={'ant-form-item-required'}>答案内容</label>
                            </span>
                          </div>

                          {/* <div>富文本编辑待定</div> */}
                          <Form.Item
                            name={[field.name, 'content']}
                            fieldKey={[field.fieldKey, 'content']}
                          >
                            <EditBoard />
                          </Form.Item>

                          <Form.Item
                            name={[field.name, 'channel']}
                            fieldKey={[field.fieldKey, 'channel']}
                            label="生效渠道"
                          >
                            <SpCheckbox
                              list={CHANNAL_LIST}
                              onChange={(val: any[]) => {
                                changeCheckbox(index, val);
                              }}
                            />
                          </Form.Item>

                          <Space>
                            <Form.Item
                              name={[field.name, 'timeFlag']}
                              fieldKey={[field.fieldKey, 'timeFlag']}
                              label="生效时间"
                              valuePropName="checked"
                              style={{ width: '180px' }}
                            >
                              <Checkbox onChange={updateFn}>启用</Checkbox>
                            </Form.Item>

                            <Condition r-if={_showTime}>
                              <Form.Item
                                name="time"
                                rules={[{ required: true }]}
                                style={{ width: '600px' }}
                              >
                                <DatePicker.RangePicker
                                  size="small"
                                  showTime
                                  placeholder={['请选择开始时间', '请选择结束时间']}
                                />
                              </Form.Item>
                            </Condition>
                          </Space>
                        </div>
                      );
                    })}

                    <div>
                      <Button type="link" icon={<PlusOutlined />} onClick={addNew}>
                        新增答案
                      </Button>
                    </div>
                  </div>
                </div>
              );
            }}
          </FormList>
          <div className={style['diy-row']}>
            <Form.Item
              name={'adveriseFlag'}
              fieldKey={'adveriseFlag'}
              label="推荐设置"
              valuePropName="checked"
              style={{ width: '180px' }}
            >
              <Checkbox onChange={changeAdvise}>启用</Checkbox>
            </Form.Item>
          </div>
          <Condition r-if={showAdvise}>
            <FormList name="recommendList">
              {(fields, { add, remove }) => {
                const addNew = () => {
                  let length = fields.length;
                  // console.log(length);
                  add(
                    {
                      qustionType: null,
                      questionId: null,
                      question: null,
                      intelligenceFlag: false,
                    },
                    length,
                  );
                };

                return (
                  <div className={style['recommend-box']}>
                    {fields.map((field: any, index: number) => {
                      // const currentItem = getItem();

                      // const _showTime = currentItem?.[index]?.timeFlag;

                      return (
                        <div key={field.key} className={style['diy-row']}>
                          <div className={style['zy-row_sp']} style={{ paddingBottom: '6px' }}>
                            <span
                              className={style['del-bt']}
                              onClick={() => {
                                remove(index);
                              }}
                            >
                              <MinusCircleOutlined />
                            </span>

                            <Form.Item
                              name={[field.name, 'question']}
                              fieldKey={[field.fieldKey, 'question']}
                            >
                              <Selector
                                openModal={() => {
                                  openModal(index);
                                }}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      );
                    })}

                    <div>
                      <Button
                        type="link"
                        icon={<PlusCircleOutlined />}
                        onClick={addNew}
                        style={{ paddingLeft: 0 }}
                      >
                        新增推荐问题
                      </Button>
                    </div>
                  </div>
                );
              }}
            </FormList>
          </Condition>
        </Form>
      </div>

      <SelectorModal cref={selectModalRef} confirm={confirm} />
    </div>
  );
};

export default Board;
