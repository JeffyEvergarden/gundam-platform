import { Button, Checkbox, Form, message } from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';
import React, { useState, useEffect, useRef } from 'react';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Selector from '../selector';
import SelectorModal from '../selector-modal';
import { useQuestionModel } from '../../model';
import { useModel } from 'umi';

const { List: FormList } = Form;
const Recommend: React.FC<any> = (props: any) => {
  const { form, faqTypeId, recycle } = props;

  // 推荐启用按钮
  const [showAdvise, setShowAdvise] = useState<boolean>(true);

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const { maxRecommendLength, addNewQuestion, updateQuestion, getQuestionInfo, getFaqConfig } =
    useQuestionModel();

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

  useEffect(() => {
    getFaqConfig({ robotId: info.id });
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
          initialValue={true}
        >
          <Checkbox onChange={changeAdvise}>启用</Checkbox>
        </Form.Item>
      </div>
      <Condition r-if={showAdvise}>
        <FormList name="recommendList">
          {(fields, { add, remove }) => {
            const addNew = () => {
              let length = fields.length;
              console.log(length);
              // if (length >= maxRecommendLength) {
              //   message.warning('推荐设置不能超过faq全局配置限制数量');
              //   return;
              // }
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
                          rules={[{ required: true, message: '请选择' }]}
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
                    disabled={recycle ? true : false}
                  >
                    新增推荐问题
                  </Button>
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
