import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  DatePicker,
  Switch,
  Checkbox,
  TreeSelect,
  message,
} from 'antd';
import Condition from '@/components/Condition';
import {
  PlusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import SpCheckbox from './components/sp-checkbox';
import Selector from './components/selector';
import SelectorModal from './components/selector-modal';
import EditBoard from './index';
import { history, useModel } from 'umi';
import style from './style.less';
import { CHANNAL_LIST } from './test';
import { useQuestionModel } from './model';
import { processRequest, processBody } from './model/utils';

const { Option } = Select;

const { List: FormList } = Form;

// 树形结构加工
const processTreeData = (data: any[], parent?: any) => {
  if (!Array.isArray(data)) {
    return [];
  }

  let _data = data.map((item: any) => {
    let obj: any = {
      title: item?.title,
      value: item?.key,
      // parent: parent,
    };
    let children: any = processTreeData(item?.children, obj);
    obj.children = children;
    if (obj.children && obj.children.length > 0) {
      obj.selectable = false;
    }
    return obj;
  });
  return _data;
};

const Board: React.FC<any> = (props: any) => {
  const query: any = history.location.query;

  const questionId = query.faqId || '';
  const pageType = questionId ? 'edit' : 'create';

  const [form] = Form.useForm();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { getFlowList, getTreeData, treeData } = useModel('drawer' as any, (model: any) => ({
    getFlowList: model.getFlowList,
    getTreeData: model.getTreeData,
    treeData: model.treeData,
  }));

  const { addNewQuestion, updateQuestion, getQuestionInfo } = useQuestionModel();

  // 分类列表
  const typeList = useMemo(() => {
    let _data = processTreeData(treeData);
    return _data;
  }, [treeData]);

  // 树形默认展开key数组
  const defaultExpend = useMemo(() => {
    let _data = treeData[0] ? [treeData[0]?.key] : [];
    return _data;
  }, [treeData]);

  const getInfo = async (id: any) => {
    let res: any = await getQuestionInfo({
      robotId: id, // 机器人id
      faqId: questionId, // 问题id
    });
    if (res) {
      res = processBody(res);
      if (res.questionRecommend) {
        setShowAdvise(true);
      }
      form.setFieldsValue(res);
    }
  };

  // 初始化调用
  useEffect(() => {
    getFlowList(info.id);
    getTreeData(info.id);
    if (pageType === 'edit') {
      getInfo(info.id);
    }
  }, []);

  // 获取回答列表
  const getItem = () => {
    const _item = form.getFieldsValue();
    return _item?.['answerList'];
  };
  // 更新函数
  const updateFn = () => {
    const _item = form.getFieldsValue()?.['answerList'] || [];
    form.setFieldsValue({
      answerList: [..._item],
    });
  };
  // 渠道筛选联动
  const changeCheckbox = (index: number, val: any) => {
    const _list = form.getFieldsValue()?.['answerList'] || [];
    let newSet = new Set();
    let selectAllObj: any[] = [];
    _list.forEach((item: any, i: number) => {
      if (index === i) {
        val.forEach((subitem: any) => {
          if (subitem !== 'all') {
            newSet.add(subitem);
          }
        });
        // '匹配到了自己'
        return;
      }
      if (val.includes('all')) {
        // 选择包含全部，清空别人
        item.channelList = [];
      } else {
        // 如果自己选了值，别人选了全部 ，清空选了全部的项
        if (val.length > 0 && item.channelList && item.channelList.includes('all')) {
          selectAllObj.push(item);
          item.channelList = [];
        } else {
          // 过滤掉选了重复值
          item.channelList = item.channelList.filter((subitem: any) => {
            return !val.includes(subitem);
          });
          item.channelList.forEach((subitem: any) => {
            newSet.add(subitem);
          });
        }
      }
    });
    if (selectAllObj.length === 1) {
      let arr: any[] = [...newSet];
      selectAllObj[0].channelList = CHANNAL_LIST.filter((subitem: any) => {
        return !arr.includes(subitem.value);
      }).map((subitem: any) => {
        return subitem.value;
      });
    }
    form.setFieldsValue({
      answerList: [..._list],
    });
  };

  // 推荐启用按钮
  const [showAdvise, setShowAdvise] = useState<boolean>(false);

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
    const disabledQuestionKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType === '1' && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);
    const disabledFlowKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType === '2' && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);
    let openInfo: any = {
      showFlow: true,
      info: _list[index],
      disabledQuestionKeys,
      disabledFlowKeys,
      selectedQuestionKeys: [],
      selectedFlowKeys: [],
    };
    if (_list[index]?.questionType === '2') {
      openInfo.selectedFlowKeys = [_list[index].recommendId];
    } else if (_list[index]?.questionType === '1') {
      openInfo.selectedQuestionKeys = [_list[index].recommendId];
    }
    (selectModalRef.current as any).open(openInfo);
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

  const save = async () => {
    console.log('触发保存');
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });
    if (!res) {
      return;
    }
    res = processRequest(res);
    if (pageType === 'create') {
      let data: any = {
        ...res,
      };
      let response = await addNewQuestion(data);
      if (response === true) {
        // 回到主页
        history.push('/gundamPages/faq/main');
      }
    } else {
      let data: any = {
        ...res,
        faqId: questionId,
      };
      let response = await updateQuestion(data);
      if (response === true) {
        // 回到主页
        history.push('/gundamPages/faq/main');
      }
    }
  };

  return (
    <div className={style['board-page']}>
      <div className={style['board-title']}>
        <Button
          icon={<LoginOutlined style={{ fontSize: '20px' }} />}
          type="link"
          onClick={() => {
            history.push('/gundamPages/faq/main');
          }}
        ></Button>
        {pageType === 'edit' ? '编辑问题' : '添加问题'}
      </div>

      <div className={style['board-form']}>
        <Form form={form}>
          <div className={'ant-form-vertical'}>
            <Form.Item
              name="questionName"
              label="问题名称"
              rules={[{ message: '请输入问题名称', required: true }]}
              style={{ width: '600px' }}
            >
              <Input placeholder={'请输入问题名称'} autoComplete="off" />
            </Form.Item>

            <Form.Item
              name="faqTypeId"
              label="问题分类"
              rules={[{ message: '请输入问题分类', required: true }]}
              style={{ width: '300px' }}
            >
              <TreeSelect
                placeholder={'请选择问题分类'}
                showSearch
                allowClear
                treeData={typeList}
                treeDefaultExpandedKeys={defaultExpend}
              ></TreeSelect>
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
                    channelList: [],
                    enable: false,
                    enableTime: null,
                  },
                  length,
                );
              };

              return (
                <div>
                  <div className={style['answer-box']}>
                    {fields.map((field: any, index: number) => {
                      const currentItem = getItem();

                      const _showTime = currentItem?.[index]?.enable;

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
                            <div className={style['circle-num']}>{index + 1}</div>
                            <span className={'ant-form-item-label'}>
                              <label className={'ant-form-item-required'}>答案内容</label>
                            </span>
                          </div>

                          {/* <div>富文本编辑待定</div> */}
                          <Form.Item
                            name={[field.name, 'answer']}
                            fieldKey={[field.fieldKey, 'answer']}
                          >
                            <EditBoard />
                          </Form.Item>

                          <Form.Item
                            name={[field.name, 'channelList']}
                            fieldKey={[field.fieldKey, 'channelList']}
                            label="生效渠道"
                            rules={[{ message: '请选择生效渠道', required: true }]}
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
                              name={[field.name, 'enable']}
                              fieldKey={[field.fieldKey, 'enable']}
                              label="生效时间"
                              valuePropName="checked"
                              style={{ width: '180px' }}
                            >
                              <Checkbox onChange={updateFn}>启用</Checkbox>
                            </Form.Item>

                            <Condition r-if={_showTime}>
                              <Form.Item
                                name={[field.name, 'enableTime']}
                                fieldKey={[field.fieldKey, 'enableTime']}
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
            {/* questionRecommend  1 0 */}
            <Form.Item
              name={'questionRecommend'}
              fieldKey={'questionRecommend'}
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
                      recommendBizType: null,
                      recommendId: null,
                      recommend: null,
                      recommendType: 1,
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
                              name={[field.name, 'recommend']}
                              fieldKey={[field.fieldKey, 'recommend']}
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

      <div className={style['board-btn']}>
        <Button type="primary" onClick={save}>
          确定
        </Button>
      </div>
      {/* <Testmodel /> */}
      <SelectorModal cref={selectModalRef} confirm={confirm} />
    </div>
  );
};

export default Board;
