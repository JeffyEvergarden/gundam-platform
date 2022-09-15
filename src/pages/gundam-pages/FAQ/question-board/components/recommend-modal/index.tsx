import Condition from '@/components/Condition';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, message, Space, Switch } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { history, useModel } from 'umi';
import { useQuestionModel } from '../../model';
import Selector from '../selector';
import SelectorModal from '../selector-modal';
import style from './style.less';

const { List: FormList } = Form;
const Recommend: React.FC<any> = (props: any) => {
  const { form, faqTypeId } = props;
  const query: any = history.location.query;

  // 推荐启用按钮
  const [showAdvise, setShowAdvise] = useState<boolean>(true);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { maxRecommendLength, addNewQuestion, updateQuestion, getQuestionInfo, getFaqConfig } =
    useQuestionModel();

  const changeAdvise = (e: any) => {
    form.setFieldsValue(form.getFieldsValue());
    console.log(form.getFieldsValue());
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
    console.log(_list);

    const disabledQuestionKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType == '1' && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);
    const disabledFlowKeys = _list
      .filter((item: any, i: number) => {
        return item.recommendBizType == '2' && item.recommendId && i !== index;
      })
      .map((item: any) => item.recommendId);

    console.log(disabledQuestionKeys, disabledFlowKeys);
    if (faqTypeId) {
      disabledQuestionKeys.push(faqTypeId);
    }
    let openInfo: any = {
      showFlow: true,
      info: _list[index],
      disabledQuestionKeys,
      disabledFlowKeys,
      selectedQuestionKeys: [],
      selectedFlowKeys: [],
    };
    if (_list[index]?.questionType == '2') {
      openInfo.selectedFlowKeys = [_list[index].recommendId];
    } else if (_list[index]?.questionType == '1') {
      openInfo.selectedQuestionKeys = [_list[index].recommendId];
    }
    (selectModalRef.current as any).open(openInfo);
    opRecordRef.current.callback = (obj: any) => {
      const _list = getRecommendItem();
      const repeatFlag = _list.findIndex((item: any, i: number) => {
        return (
          i !== index &&
          item.recommendId === obj.recommendId &&
          item.recommendBizType === obj.recommendBizType
        );
      });
      console.log(repeatFlag, index, obj, _list[repeatFlag]);
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

  const intelRecommend = (flag: any, index: number) => {
    console.log(flag);

    let formData: any = form.getFieldsValue();
    formData.recommendList[index].recommendBizType = undefined;
    formData.recommendList[index].recommendId = undefined;
    formData.recommendList[index].recommend = undefined;
    formData.recommendList[index].recommendType = flag ? 1 : 0;

    form.setFieldsValue({ ...formData });
  };

  useEffect(() => {
    getFaqConfig(info.id);
    console.log(query?.recommend);

    form.setFieldsValue({ questionRecommend: query?.recommend == 1 ? true : false });
    setShowAdvise(query?.recommend == 1 ? true : false);
  }, []);

  return (
    <div>
      <div className={style['diy-row']}>
        {/* questionRecommend  1 0 */}
        <Form.Item
          name={'questionRecommend'}
          fieldKey={'questionRecommend'}
          label="推荐设置"
          valuePropName="checked"
          // style={{ width: '180px' }}
          // initialValue={true}
        >
          <Checkbox onChange={changeAdvise}>启用</Checkbox>
        </Form.Item>
      </div>
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
                  console.log(formData);

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
                              required:
                                showAdvise && info.robotTypeLabel === 'text' ? !intelFlag : true,
                              message: '请选择',
                            },
                          ]}
                          shouldUpdate={true}
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
                  {query.recycle == 0 && (
                    <Button
                      type="link"
                      icon={<PlusCircleOutlined />}
                      onClick={addNew}
                      style={{ paddingLeft: 0 }}
                    >
                      新增推荐问题
                    </Button>
                  )}
                </div>
              </div>
            );
          }}
        </FormList>
      </Condition>

      <SelectorModal cref={selectModalRef} confirm={confirm} />
    </div>
  );
};

export default Recommend;
