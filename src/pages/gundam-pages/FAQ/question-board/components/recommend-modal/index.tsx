import { Button, Checkbox, Form } from 'antd';
import style from './style.less';
import Condition from '@/components/Condition';
import React, { useState, useEffect, useRef } from 'react';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Selector from '../selector';
import SelectorModal from '../selector-modal';

const { List: FormList } = Form;
const Recommend: React.FC<any> = (props: any) => {
  const { form } = props;

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
    (selectModalRef.current as any).open({
      showFlow: true,
      info: _list[index],
    });
    opRecordRef.current.callback = (obj: any) => {
      const _list = getRecommendItem();
      _list[index] = { ...obj };
      form.setFieldsValue({
        recommendList: [..._list],
      });
    };
  };

  return (
    <div>
      <div className={style['diy-row']}>
        <Form.Item
          name={'adveriseFlag'}
          fieldKey={'adveriseFlag'}
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

      <SelectorModal cref={selectModalRef} confirm={confirm} />
    </div>
  );
};

export default Recommend;
