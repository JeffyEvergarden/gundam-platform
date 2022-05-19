import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  Space,
  DatePicker,
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
import { useAnswerModel } from './model';
import { processAnswerRequest, processAnswerBody } from './model/utils';

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
  const answerId = query.answerId || '';
  const pageType = questionId && answerId ? 'edit' : 'create';

  const [form] = Form.useForm();

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { getFlowList, getTreeData, treeData } = useModel('drawer' as any, (model: any) => ({
    getFlowList: model.getFlowList,
    getTreeData: model.getTreeData,
    treeData: model.treeData,
  }));

  // 推荐启用按钮
  const [showTime, setShowTime] = useState<boolean>(false);

  const updateFn = (val: any) => {
    setShowTime(val);
  };

  const { addNewAnswer, updateAnswer, getAnswerInfo } = useAnswerModel();

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
    let res: any = await getAnswerInfo({
      robotId: id, // 机器人id
      faqId: questionId, // 问题id
    });
    if (res) {
      res = processAnswerBody(res);
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
    }
  }, []);

  const save = async () => {
    console.log('触发保存');
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });
    if (!res) {
      return;
    }
    res = processAnswerRequest(res);
    if (pageType === 'create') {
      let data: any = {
        ...res,
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
      };
      let response = await updateAnswer(data);
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
                disabled={pageType === 'edit'}
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
                disabled={pageType === 'edit'}
              ></TreeSelect>
            </Form.Item>
          </div>

          <div>
            <div className={style['answer-box']}>
              <div className={style['diy-row']}>
                <div className={style['zy-row']} style={{ paddingBottom: '6px' }}>
                  <span className={'ant-form-item-label'}>
                    <label className={'ant-form-item-required'}>答案内容</label>
                  </span>
                </div>

                {/* <div>富文本编辑待定</div> */}
                <Form.Item name={'answer'}>
                  <EditBoard />
                </Form.Item>

                <Form.Item
                  name={'channelList'}
                  fieldKey={'channelList'}
                  label="生效渠道"
                  rules={[{ message: '请选择生效渠道', required: true }]}
                >
                  <SpCheckbox list={CHANNAL_LIST} />
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
                    <Form.Item
                      name={'enableTime'}
                      fieldKey={'enableTime'}
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
            </div>
          </div>
        </Form>
      </div>

      <div className={style['board-btn']}>
        <Button type="primary" onClick={save}>
          确定
        </Button>
      </div>
    </div>
  );
};

export default Board;
