import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import config from '@/config';
import { ArrowLeftOutlined } from '@ant-design/icons';
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
  TreeSelect,
} from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import SoundSelectModal from '../../main-draw/drawerV2/components/sound-select-modal';
import SoundVarModal from '../../main-draw/drawerV2/components/sound-var-modal';
import RemarkModal from './components/remark-modal';
import SpCheckbox from './components/sp-checkbox';
import EditBoard from './index';
import { useAnswerModel, useQuestionModel } from './model';
import { processAnswerBody, processAnswerRequest, processBody } from './model/utils';
import style from './style.less';

const { Option } = Select;

const { List: FormList } = Form;

const { TextArea } = Input;

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
  const answerId = query.answerId || '';
  const pageType = questionId && answerId ? 'edit' : 'create';
  const pageFrom = query.pageFrom || '';
  const pendingId = query.id || '';
  const batchNumber = query.batchNumber || '';

  const [form] = Form.useForm();
  const soundRef = useRef<any>({});
  const auditionRef = useRef<any>({});
  const sType: any = Form.useWatch('soundType', form);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { channelList, getChannelList } = useModel('drawer' as any, (model: any) => ({
    channelList: model.channelList,
    getChannelList: model.getChannelList,
  }));

  const [originInfo, setOriginInfo] = useState<any>({});

  const { getFlowList, getTreeData, treeData } = useModel('drawer' as any, (model: any) => ({
    getFlowList: model.getFlowList,
    getTreeData: model.getTreeDataOther,
    treeData: model.treeDataOther,
  }));

  const robotTypeMap = config.robotTypeMap;
  const robotType: any = robotTypeMap[info.robotType] || '语音';

  // 推荐启用按钮
  const [showTime, setShowTime] = useState<boolean>(false);

  const updateFn = (e: any) => {
    setShowTime(e.target.checked);
  };

  const { getQuestionInfo } = useQuestionModel();

  const { addNewAnswer, updateAnswer, getAnswerInfo, _getApprovalInfo, updateApproval } =
    useAnswerModel();

  const _getQuestionInfo = async (id: any) => {
    let res: any = await getQuestionInfo({
      robotId: id, // 机器人id
      faqId: questionId, // 问题id
    });
    if (res) {
      res = processBody(res);
      form.setFieldsValue(res);
    }
  };

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
    let res: any;
    if (pageFrom == 'pendingList') {
      res = await _getApprovalInfo({
        id: pendingId,
      });
    } else {
      res = await getAnswerInfo({
        robotId: id, // 机器人id
        faqId: questionId, // 问题id
        answerId: answerId,
      });
    }

    if (res) {
      res = processAnswerBody(res, robotType);
      if (res.enable) {
        setShowTime(true);
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
    } else {
      _getQuestionInfo(info.id);
    }
    getChannelList(info.id);
  }, []);

  const remarkModalRef = useRef<any>({});

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

    res = processAnswerRequest(res);

    if (pageType === 'create') {
      let data: any = {
        robotId: info.id,
        faqId: questionId,
        ...res,
        ...otherObj,
      };
      let response = await addNewAnswer(data);
      if (response === true) {
        // 回到主页

        history.push('/gundamPages/faq/main');
      }
    } else {
      let data: any = {
        ...res,
        faqId: questionId,
        robotId: info.id,
        answerId: answerId,
        ...otherObj,
      };
      let response: any;
      if (pageFrom == 'pendingList') {
        response = await updateApproval({ ...data, id: pendingId, batchNumber: batchNumber });
      } else {
        response = await updateAnswer(data);
      }
      if (response === true) {
        // 回到主页

        history.push('/gundamPages/faq/main');
      }
    }
  };

  const openRemarkModal = async () => {
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
  const confirmRemarkModal = async (tmpObj: any) => {
    // 以防万一暂存
    setOriginInfo({
      ...originInfo,
      ...tmpObj,
    });
    await save(tmpObj);
  };

  return (
    <div className={style['board-page']}>
      <div style={{ width: '100%' }}>
        <div className={style['board-title']}>
          <Button
            icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />}
            style={{ padding: 0 }}
            type="link"
            onClick={() => {
              history.push('/gundamPages/faq/main');
            }}
          ></Button>
          {pageType === 'edit' ? '编辑答案' : '添加答案'}
        </div>

        <div className={style['board-form']}>
          <Form form={form}>
            <div className={'ant-form-vertical'}>
              <Form.Item
                name="question"
                label="问题名称"
                rules={[{ message: '请输入问题名称', required: true }]}
                style={{ width: '600px' }}
              >
                <Input
                  placeholder={'请输入问题名称'}
                  autoComplete="off"
                  maxLength={200}
                  disabled={true}
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
                  disabled={true}
                ></TreeSelect>
              </Form.Item>
            </div>

            <div>
              <div className={style['answer-box']}>
                <div className={style['diy-row']}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className={style['zy-row']} style={{ paddingBottom: '6px' }}>
                      <span className={'ant-form-item-label'}>
                        <label className={'ant-form-item-required'}>答案内容</label>
                      </span>
                    </div>
                    <Condition r-if={robotType === '语音'}>
                      <div id={style['soundType']}>
                        <Form.Item name={'soundType'} fieldKey={'soundType'} initialValue={1}>
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
                        <Condition r-if={sType == 2}>
                          <Form.Item
                            name={'soundRecordList'}
                            fieldKey={'soundRecordList'}
                            rules={[{ required: true, message: '请选择' }]}
                          >
                            <Button
                              type="link"
                              onClick={() => {
                                console.log(form.getFieldsValue());
                                console.log(sType);

                                if (sType == 2) {
                                  soundRef?.current?.open(
                                    form.getFieldsValue()?.soundRecordList || [],
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
                          onClick={() => {
                            console.log(form.getFieldsValue());
                            auditionRef?.current?.open(form.getFieldsValue());
                          }}
                        >
                          试听
                          <Tip
                            title={'根据“全局配置-TTS配置”，或者选择的录音，合成语音进行试听。'}
                          />
                        </Button>
                        <SoundVarModal cref={auditionRef}></SoundVarModal>
                        <SoundSelectModal
                          cref={soundRef}
                          setform={(list: any, index: any) => {
                            let formData = form.getFieldsValue();
                            formData.soundRecordList = list;
                            formData.answer = list?.[0]?.text;
                            form.setFieldsValue(formData);
                            console.log(formData);
                          }}
                          type={'radio'}
                        ></SoundSelectModal>
                      </div>
                    </Condition>
                  </div>
                  {/* <div>富文本编辑待定</div> */}
                  {/* <Form.Item name={'answer'}>
                  <EditBoard />
                  </Form.Item> */}

                  {/* <div>富文本编辑待定</div> */}
                  <Condition r-if={robotType === '文本'}>
                    <Form.Item
                      name={'answer'}
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
                      name={'answer'}
                      rules={[
                        {
                          message: '请输入答案',
                          required: true,
                          validateTrigger: 'onBlur',
                        },
                      ]}
                    >
                      <TextArea maxLength={200} rows={5} placeholder={'请输入答案'} showCount />
                    </Form.Item>
                    <Space align="baseline">
                      <Form.Item
                        name={'allowInterrupt'}
                        fieldKey={'allowInterrupt'}
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
                      <Form.Item
                        name={'repeatHear'}
                        key={'repeatHear'}
                        initialValue={1}
                        style={{ marginLeft: '16px' }}
                        label={'按9重听'}
                      >
                        <Radio.Group>
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Tip title={''} />
                    </Space>
                  </Condition>

                  <Form.Item
                    name={'channelList'}
                    fieldKey={'channelList'}
                    label="生效渠道"
                    rules={[{ message: '请选择生效渠道', required: true }]}
                  >
                    <SpCheckbox list={channelList} />
                  </Form.Item>

                  <Space>
                    <Form.Item
                      name={'enable'}
                      fieldKey={'enable'}
                      label="生效时间"
                      valuePropName="checked"
                      style={{ width: '180px' }}
                    >
                      <Checkbox onChange={updateFn}>启用</Checkbox>
                    </Form.Item>

                    <Condition r-if={showTime}>
                      <Space>
                        <Form.Item name={'enableStartTime'} fieldKey={'enableStartTime'}>
                          <DatePicker size="small" showTime placeholder={'请选择开始时间'} />
                        </Form.Item>
                        <Form.Item name={'enableEndTime'} fieldKey={'enableEndTime'}>
                          <DatePicker size="small" showTime placeholder={'请选择结束时间'} />
                        </Form.Item>
                      </Space>
                    </Condition>
                  </Space>
                </div>
              </div>
            </div>
          </Form>
        </div>

        <div className={style['board-btn']}>
          <Button type="primary" onClick={openRemarkModal}>
            提交
          </Button>
        </div>
      </div>

      <RemarkModal cref={remarkModalRef} confirm={confirmRemarkModal} />
    </div>
  );
};

export default Board;
