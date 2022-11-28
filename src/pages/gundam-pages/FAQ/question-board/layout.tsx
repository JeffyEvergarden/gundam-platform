import Condition from '@/components/Condition';
import config from '@/config';
import {
  ArrowLeftOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Select,
  Space,
  Switch,
  TreeSelect,
} from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import RemarkModal from './components/remark-modal';
import Selector from './components/selector';
import SelectorModal from './components/selector-modal';
import SpCheckbox from './components/sp-checkbox';
import EditBoard from './index';
import { useQuestionModel } from './model';
import { processBody, processRequest } from './model/utils';
import style from './style.less';
// 相似度组件
import Tip from '@/components/Tip';
import SameModal from '@/pages/gundam-pages/sample/components/sameModal';
import SimilarCom from '@/pages/gundam-pages/sample/components/similarCom';
import { useSimilarModel } from '@/pages/gundam-pages/sample/model';
import SoundSelectModal from '../../main-draw/drawerV2/components/sound-select-modal';
import SoundVarModal from '../../main-draw/drawerV2/components/sound-var-modal';

const { Option } = Select;

const { TextArea } = Input;

const { List: FormList } = Form;

const robotTypeMap = config.robotTypeMap;

const regEnd = /^(\<p\>\<br\>\<\/p\>)+$/;

// 树形结构加工
const processTreeData = (data: any[], parent?: any) => {
  if (!Array.isArray(data)) {
    return [];
  }

  let _data = data.map((item: any) => {
    let obj: any = {
      title: item?.title,
      value: item?.key,
      type: item?.type,
      // parent: parent,
    };

    let children: any = processTreeData(item?.children, obj);
    obj.children = children;
    if (obj.children && obj.children.length > 0) {
      obj.selectable = false;
    }
    if (obj.value === '0') {
      // 第一级也不能选
      obj.selectable = false;
    }
    return obj;
  });
  return _data;
};

// 步骤
// 填写表单 ---> 点击确定  ---> 触发检测 ---> 有相似问，展示相似度提示弹窗   --->  相似度提示弹窗确定 ---> 出备注弹窗
//                                   ---> 没有相似问，出备注弹窗

const Board: React.FC<any> = (props: any) => {
  const query: any = history.location.query;

  const questionId = query.faqId || '';
  const pageType = questionId ? 'edit' : 'create';

  const [form] = Form.useForm();
  const soundRef = useRef<any>({});
  const auditionRef = useRef<any>({});
  const sType: any = Form.useWatch('answerList', form);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { channelList, getChannelList } = useModel('drawer' as any, (model: any) => ({
    channelList: model.channelList,
    getChannelList: model.getChannelList,
  }));

  const [originInfo, setOriginInfo] = useState<any>({});

  const robotType: any = robotTypeMap[info.robotType] || '语音';

  const { getShowBadgeTotal, getFlowList, getTreeData, treeData } = useModel(
    'drawer' as any,
    (model: any) => ({
      getShowBadgeTotal: model.getShowBadgeTotal,
      getFlowList: model.getFlowList,
      getTreeData: model.getTreeDataOther,
      treeData: model.treeDataOther,
    }),
  );

  // 相似问检测
  const [similarFlag, setSimilarFlag] = useState<any>(false); //（开关）
  const [similarVisible, setSimilarVisible] = useState<any>(false);
  const [searchText, setSearchText] = useState<string>(''); // 查询相似问的内容
  const [lastText, setLastText] = useState<string>(''); // 查询相似问的内容
  const [similarData, setSimilarData] = useState<any>({});
  const [pageUrl, setPageUrl] = useState<string>('');
  const [payloadData, setpayload] = useState<any>({});

  const [editSuggest, setEditSuggest] = useState<any>(false);
  // 打开备注

  useEffect(() => {
    // console.log(info);
    getChannelList(info.id);
  }, [info]);

  useEffect(() => {
    let historyData = history?.location || {};
    let pageUrl = (history?.location?.state as any)?.pageUrl || '';
    let payload = (history?.location?.state as any)?.payload || {};
    if (pageUrl === 'unknownQuestion' || pageUrl === 'standardQuestionLearn') {
      form.setFieldsValue({
        question: payload?.question,
      });
      setPageUrl(pageUrl);
      setpayload(payload);
    }
  }, []);

  const { maxRecommendLength, addNewQuestion, updateQuestion, getQuestionInfo, getFaqConfig } =
    useQuestionModel();

  // 分类列表
  const typeList = useMemo(() => {
    let _data: any = processTreeData(treeData);
    // console.log('typeList: --------------');
    // console.log(_data);
    const firstChildren: any = _data?.[0]?.children;
    if (firstChildren?.length === 0) {
      return [];
    }
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
      res = processBody(res, robotType);
      if (res.questionRecommend) {
        setShowAdvise(true);
      }
      setOriginInfo(res);
      form.setFieldsValue(res);
    }
  };

  // 初始化调用
  useEffect(() => {
    getFlowList(info.id);
    getTreeData(info.id);
    getFaqConfig(info.id);
    if (pageType === 'edit') {
      getInfo(info.id);
    } else {
      form.setFieldsValue({
        answerList: [
          {
            answer: '',
            channelList: ['all'],
            enable: false,
            enableStartTime: null,
            enableEndTime: null,
          },
        ],
      });
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
      selectAllObj[0].channelList = channelList
        .filter((subitem: any) => {
          return !arr.includes(subitem.value);
        })
        .map((subitem: any) => {
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

  // 弹窗组件记录
  const selectModalRef = useRef<any>();
  const opRecordRef = useRef<any>({});
  const remarkModalRef = useRef<any>({});

  const getRecommendItem = () => {
    const _item = form.getFieldsValue();
    return _item?.['recommendList'] || [];
  };

  // 打开弹窗
  const openModal = (index: number) => {
    const _list = getRecommendItem();
    // 找出被选过的问题  （不能再选，设置为禁用项）
    const disabledQuestionKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType === '1' && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);
    // 找出被选过的流程  （不能再选，设置为禁用项）
    const disabledFlowKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType === '2' && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);
    const disabledSelfKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType == '3' && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);

    // console.log(disabledQuestionKeys, disabledFlowKeys);
    // 编辑模式、要排除自己也不能被选
    if (questionId) {
      disabledQuestionKeys.push(questionId);
    }
    let openInfo: any = {
      showFlow: true,
      info: _list[index],
      disabledQuestionKeys,
      disabledFlowKeys,
      disabledSelfKeys,
      selectedQuestionKeys: [],
      selectedFlowKeys: [],
      selectedSelfKeys: [],
    };
    // 找到已选的
    if (_list[index]?.recommendBizType === '2') {
      openInfo.selectedFlowKeys = [_list[index].recommendId];
    } else if (_list[index]?.recommendBizType === '1') {
      openInfo.selectedQuestionKeys = [_list[index].recommendId];
    } else if (_list[index]?.recommendBizType == '3') {
      openInfo.selectedSelfKeys = [_list[index].recommendId];
    }
    (selectModalRef.current as any).open(openInfo);
    // 回调函数，不能重复添加、以及更改后刷新
    opRecordRef.current.callback = (obj: any) => {
      const _list = getRecommendItem();
      const repeatFlag = _list.findIndex((item: any, i: number) => {
        return (
          i !== index &&
          item.recommendId === obj.recommendId &&
          item.recommendBizType === obj.recommendBizType
        );
      });
      // console.log(repeatFlag, index, obj, _list[repeatFlag]);
      if (repeatFlag > -1) {
        message.warning('已添加过重复');
        return;
      }

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

  const save = async (otherObj: any) => {
    console.log('触发保存');
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });
    if (!res) {
      return;
    }
    console.log(res);

    res = processRequest(res);
    if (pageType === 'create') {
      let data: any = {
        robotId: info.id,
        ...res,
        ...otherObj,
        unknownId: (history?.location?.state as any)?.payload?.id,
      };
      data.recommendList = data?.questionRecommend ? data?.recommendList : undefined;
      let response = await addNewQuestion(data);
      if (response === true) {
        // 回到主页
        if (pageUrl == 'unknownQuestion') {
          history.push('/gundamPages/knowledgeLearn/unknowQuestion');
        } else if (pageUrl == 'standardQuestionLearn') {
          history.push({
            pathname: '/gundamPages/knowledgeLearn/standardQuestionLearn',
            state: {
              rowInfo: payloadData,
            },
          });
        } else {
          history.push('/gundamPages/faq/main');
        }
      }
    } else {
      let data: any = {
        ...res,
        faqId: questionId,
        robotId: info.id,
        ...otherObj,
      };
      data.recommendList = data?.questionRecommend ? data?.recommendList : undefined;
      let response = await updateQuestion(data);
      if (response === true) {
        // 回到主页
        history.push('/gundamPages/faq/main');
      }
    }
  };

  // 打开备注弹窗
  const openRemarkModal = async () => {
    setSimilarVisible(false);

    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });
    if (!res) {
      return;
    }
    remarkModalRef.current?.open?.({
      type: pageType,
      info: originInfo,
    });
  };

  // 确认备注弹窗
  const confirmRemarkModal = async (tmpObj: any) => {
    // 以防万一暂存
    setOriginInfo({
      ...originInfo,
      ...tmpObj,
    });
    await save(tmpObj);
    getShowBadgeTotal(info.id);
  };

  const { checkSimilar } = useSimilarModel();

  //
  const checkSimilarQuestion = async () => {
    // if (!searchText) {
    //   message.warning('请填写问题名称');
    //   return;
    // }
    let _res: any = await form.validateFields(['question']).catch(() => {
      message.warning('请填写问题');
      return false;
    });

    if (!_res) {
      return;
    }

    if (searchText === lastText && lastText) {
      // 和上次一样
      openRemarkModal();
      return;
    }
    let params = {
      robotId: info.id,
      similarText: searchText || '',
      // faqId: tableInfo?.id,
    };
    let res = await checkSimilar(params);

    setLastText(searchText);
    if (res.resultCode === config.successCode) {
      setSimilarFlag(false);
      //检测通过新增
      openRemarkModal();
    } else if (res.resultCode === '0001') {
      //不通过有相似
      setSimilarFlag(true);
      setSimilarVisible(true);
      setSimilarData(res?.data);
    } else {
      message.error(res.resultDesc);
    }
  };

  const saveSame = async () => {
    //检测通过新增
    openRemarkModal();
  };

  const intelRecommend = (flag: any, index: number) => {
    let formData: any = form.getFieldsValue();
    formData.recommendList[index].recommendBizType = undefined;
    formData.recommendList[index].recommendId = undefined;
    formData.recommendList[index].recommend = undefined;
    formData.recommendList[index].recommendType = flag ? 1 : 0;

    form.setFieldsValue({ ...formData });
  };

  return (
    <div className={style['board-page']}>
      <div className={style['board_left']} style={{ width: '100%' }}>
        <div className={style['board-title']}>
          <Button
            icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />}
            style={{ padding: 0 }}
            type="link"
            onClick={() => {
              if (pageUrl == 'unknownQuestion') {
                history.push('/gundamPages/knowledgeLearn/unknowQuestion');
              } else if (pageUrl == 'standardQuestionLearn') {
                history.push({
                  pathname: '/gundamPages/knowledgeLearn/standardQuestionLearn',
                  state: {
                    rowInfo: payloadData,
                  },
                });
              } else {
                history.push('/gundamPages/faq/main');
              }
            }}
          />
          {pageType === 'edit' ? '编辑问题' : '添加问题'}
        </div>

        <div className={style['board-form']}>
          <Form form={form}>
            <div className={'ant-form-vertical'}>
              <Form.Item
                name="question"
                label={
                  <>
                    {'标准问名称'}
                    <Tip
                      title={
                        '问题名称是关于某一个问题多种说法的和回复答案的集合，例如“邮你贷简介”、“邮你贷介绍”、“介绍一下你们公司产品”都是同一个问题，此时就可以用“邮你贷简介”作为问题名称。'
                      }
                    />
                  </>
                }
                rules={[{ message: '请输入标准问名称', required: true }]}
                style={{ width: '600px' }}
              >
                <Input
                  placeholder={'请输入标准问名称'}
                  autoComplete="off"
                  maxLength={200}
                  onChange={(e: any) => {
                    setSearchText(e.target.value);
                  }}
                />
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
                  getPopupContainer={(trigger) => trigger.parentElement}
                  onSelect={(v: any, r: any) => {
                    if (r?.type == 2) {
                      form.setFieldsValue({ suggest: 0 });
                      setEditSuggest(true);
                    } else {
                      setEditSuggest(false);
                    }
                  }}
                />
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
                      channelList: length === 0 ? ['all'] : [],
                      enable: false,
                      enableStartTime: null,
                      enableEndTime: null,
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
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                  <label className={'ant-form-item-required'}>
                                    答案内容{' '}
                                    <Tip
                                      title={
                                        '当客户文本命中当前FAQ或者相似问，机器人会回复渠道相对应的答案，答案需要在此处提前编辑。'
                                      }
                                    />
                                  </label>
                                </span>
                              </div>
                              <Condition r-if={robotType === '语音'}>
                                <div id={style['soundType']}>
                                  <Form.Item
                                    name={[field.name, 'soundType']}
                                    fieldKey={[field.fieldKey, 'soundType']}
                                    initialValue={1}
                                  >
                                    <Radio.Group>
                                      <Radio value={1}>
                                        全合成
                                        <Tip
                                          title={
                                            '使用“全局配置-TTS配置”对澄清话术进行录音合成，合成后可以在“录音管理”中查看，或者点击“试听”'
                                          }
                                        />
                                      </Radio>
                                      <Radio value={2}>
                                        录音半合成
                                        <Tip
                                          title={
                                            '选择录音进行播报。根据分号拆分文本后，不含变量、词槽的文本段数量要与选择的录音数量一致。例如：“你好；今天是${system_date}”，需要上传一段与“你好”适配的录音，后面一段自动使用TTS合成。'
                                          }
                                        />
                                      </Radio>
                                    </Radio.Group>
                                  </Form.Item>
                                  <Condition r-if={sType?.[index]?.soundType == 2}>
                                    <Form.Item
                                      name={[field.name, 'soundRecordList']}
                                      fieldKey={[field.fieldKey, 'soundRecordList']}
                                      rules={[{ required: true, message: '请选择' }]}
                                    >
                                      <Button
                                        type="link"
                                        onClick={() => {
                                          console.log(form.getFieldsValue());
                                          console.log(sType);

                                          if (sType?.[index]?.soundType == 2) {
                                            soundRef?.current?.open(
                                              form.getFieldsValue()?.['answerList'][index]
                                                ?.soundRecordList || [],
                                              index,
                                            );
                                          }
                                        }}
                                      >
                                        选择
                                      </Button>
                                    </Form.Item>
                                  </Condition>
                                  <Button
                                    type="link"
                                    onClick={async () => {
                                      console.log(form.getFieldsValue());
                                      auditionRef?.current?.open(
                                        form.getFieldsValue()?.['answerList']?.[index],
                                      );
                                    }}
                                  >
                                    试听
                                    <Tip
                                      title={
                                        '根据“全局配置-TTS配置”，或者选择的录音，合成语音进行试听。'
                                      }
                                    />
                                  </Button>
                                  <SoundVarModal cref={auditionRef}></SoundVarModal>
                                  <SoundSelectModal
                                    cref={soundRef}
                                    setform={(list: any, index: any) => {
                                      let formData = form.getFieldsValue();
                                      formData['answerList'][index].soundRecordId = list?.[0]?.id;
                                      formData['answerList'][index].soundRecordList = list;
                                      formData['answerList'][index].answer = list?.[0]?.text;
                                      form.setFieldsValue(formData);
                                    }}
                                    type={'radio'}
                                  ></SoundSelectModal>
                                </div>
                              </Condition>
                            </div>

                            {/* <div>富文本编辑待定</div> */}
                            <Condition r-if={robotType === '文本'}>
                              <Form.Item
                                name={[field.name, 'answer']}
                                fieldKey={[field.fieldKey, 'answer']}
                                validateTrigger="onBlur"
                                rules={[
                                  {
                                    message: '请输入答案',
                                    required: true,
                                    validateTrigger: 'onBlur',
                                  },
                                  () => ({
                                    async validator(_, value) {
                                      if (value === undefined) {
                                        return;
                                      }
                                      if (regEnd.test(value)) {
                                        return Promise.reject(new Error('请填写答案'));
                                      }
                                      return Promise.resolve();
                                    },
                                  }),
                                ]}
                              >
                                <EditBoard />
                              </Form.Item>
                            </Condition>

                            <Condition r-if={robotType === '语音'}>
                              <Form.Item
                                name={[field.name, 'answer']}
                                fieldKey={[field.fieldKey, 'answer']}
                                rules={[{ message: '请输入答案', required: true }]}
                              >
                                <TextArea
                                  maxLength={200}
                                  rows={5}
                                  placeholder={'请输入答案'}
                                  showCount
                                />
                              </Form.Item>
                              <Space align="baseline">
                                <Form.Item
                                  name={[field.name, 'allowInterrupt']}
                                  fieldKey={[field.fieldKey, 'allowInterrupt']}
                                  initialValue={1}
                                  label={'允许打断'}
                                >
                                  <Radio.Group>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                  </Radio.Group>
                                </Form.Item>
                                <Tip
                                  title={
                                    '用于控制语音平台在放音过程中是否允许打断，若是，播音过程检测到客户说话，则停止播报进行收音。'
                                  }
                                />
                              </Space>
                            </Condition>

                            <Form.Item
                              name={[field.name, 'channelList']}
                              fieldKey={[field.fieldKey, 'channelList']}
                              label="生效渠道"
                              rules={[
                                {
                                  message: '请选择生效渠道',
                                  required: true,
                                },
                              ]}
                            >
                              <SpCheckbox
                                list={channelList}
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
                                <Space>
                                  <Form.Item
                                    name={[field.name, 'enableStartTime']}
                                    fieldKey={[field.fieldKey, 'enableStartTime']}
                                  >
                                    <DatePicker
                                      size="small"
                                      showTime
                                      placeholder={'请选择开始时间'}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name={[field.name, 'enableEndTime']}
                                    fieldKey={[field.fieldKey, 'enableEndTime']}
                                  >
                                    <DatePicker
                                      size="small"
                                      showTime
                                      placeholder={'请选择结束时间'}
                                    />
                                  </Form.Item>
                                </Space>
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
            <Condition r-if={robotType === '文本'}>
              <Form.Item style={{ width: '600px' }} label={'是否联想'}>
                <Space align="baseline">
                  <Form.Item name="suggest" noStyle initialValue={1}>
                    <Radio.Group disabled={editSuggest}>
                      <Radio value={1}>是</Radio>
                      <Radio value={0}>否</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Tip
                    title={
                      '文本机器人，当客户在页面输入文本，会触发搜索联想，辅助搜索，例如输入“邮你贷”，可以弹出“邮你贷”、“邮你贷热线”、“邮你贷余额”等联想文本。当此处配置不联想时，该FAQ不会出现在联想的候选集内。'
                    }
                  />
                </Space>
              </Form.Item>
            </Condition>
            <Condition r-if={robotTypeMap[info.robotType] == '文本'}>
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
            </Condition>
            <Condition r-show={showAdvise}>
              <FormList name="recommendList">
                {(fields, { add, remove }) => {
                  const addNew = () => {
                    let length = fields.length;
                    console.log(length);
                    if (length >= maxRecommendLength) {
                      message.warning('推荐设置不能超过faq全局配置限制数量');
                      return;
                    }
                    add(
                      {
                        recommendBizType: null,
                        recommendId: null,
                        recommend: null,
                        recommendType: 0,
                      },
                      length,
                    );
                  };

                  return (
                    <div className={style['recommend-box']}>
                      {fields.map((field: any, index: number) => {
                        // const currentItem = getItem();

                        // const _showTime = currentItem?.[index]?.timeFlag;
                        const formData: any = form.getFieldsValue();
                        const intelFlag = formData?.recommendList?.[index]?.recommendType;

                        return (
                          <Form.Item key={field.key} className={style['diy-row']}>
                            {/* <div className={style['zy-row_sp']} style={{ paddingBottom: '6px' }}> */}
                            <Space align="baseline">
                              {query.recycle == 0 && (
                                <span
                                  className={style['del-bt']}
                                  onClick={() => {
                                    remove(index);
                                  }}
                                >
                                  <MinusCircleOutlined />
                                </span>
                              )}

                              <Form.Item
                                name={[field.name, 'recommend']}
                                fieldKey={[field.fieldKey, 'recommend']}
                                rules={[
                                  {
                                    required: showAdvise
                                      ? info.robotTypeLabel === 'text'
                                        ? !intelFlag
                                        : true
                                      : false,
                                    message: '请选择',
                                  },
                                ]}
                              >
                                <Selector
                                  disabled={info.robotTypeLabel === 'text' ? intelFlag : false}
                                  openModal={() => {
                                    openModal(index);
                                  }}
                                />
                              </Form.Item>
                              {/* <Condition r-if={true}> */}
                              <Condition r-if={info.robotTypeLabel === 'text'}>
                                <span style={{ marginLeft: '16px' }}>智能推荐</span>
                              </Condition>

                              <Condition r-if={info.robotTypeLabel === 'text'}>
                                <Form.Item
                                  name={[field.name, 'recommendType']}
                                  fieldKey={[field.fieldKey, 'recommendType']}
                                  key={field.fieldKey + 'recommendType'}
                                  valuePropName="checked"
                                  style={{ marginBottom: 0 }}
                                >
                                  <Switch
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    checkedChildren="开启"
                                    unCheckedChildren="关闭"
                                    onChange={(checked: any) => {
                                      intelRecommend(checked, index);
                                    }}
                                  ></Switch>
                                </Form.Item>
                              </Condition>
                            </Space>
                            {/* </div> */}
                          </Form.Item>
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
          <Button type="primary" onClick={checkSimilarQuestion}>
            提交
          </Button>
        </div>
      </div>
      <Condition r-if={similarFlag}>
        <SimilarCom
          similarTableData={similarData}
          pageType="FAQ"
          inputValue={searchText}
          showTop={false}
          refresh={(r: any, type: any) => {
            history.push({
              pathname: '/gundamPages/faq/similar',
              state: {
                info: r,
                pageType: type,
                searchText: form.getFieldValue('question'),
              },
            });
          }}
        />
      </Condition>

      <SameModal
        visible={similarVisible}
        cancel={() => {
          setSimilarVisible(false);
        }}
        saveSame={saveSame}
        pageType={'FAQ'}
      />
      <RemarkModal cref={remarkModalRef} confirm={confirmRemarkModal} pageUrl={pageUrl} />
      <SelectorModal cref={selectModalRef} confirm={confirm} />
    </div>
  );
};

export default Board;
