import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Popconfirm, Input, Modal, Tooltip } from 'antd';
import Condition from '@/components/Condition';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import SelectFaqModal from '../../components/select-faq-modal';
import { QuestionCircleOutlined, MonitorOutlined } from '@ant-design/icons';
import style from '../style.less';

const FaqSelect = (props: any) => {
  const { value, onChange } = props;

  const hasValue = Array.isArray(value) && value.length > 0;

  const selectFaqModalRef = useRef<any>({});

  // 打开选择FAQ/意图模态框
  const openSelectFaqModal = (row: any) => {
    // selectlist  (recommendType、recommendId、recommend)
    // disabledWishKeys    禁止选择的意图
    // disabledQuestionKeys  禁止选择的问题
    // selectedQuestionKeys  已选择的问题
    // selectedWishKeys 已选择的意图
    let questionTypeList: any[] = hasValue ? value : [];
    questionTypeList = Array.isArray(questionTypeList) ? [...questionTypeList] : [];
    let selectedQuestionKeys: any[] = questionTypeList
      .filter((item: any) => {
        return item.recommendType == '1';
      })
      .map((item: any) => {
        return item.recommendId;
      });
    let selectedWishKeys: any[] = questionTypeList
      .filter((item: any) => {
        return item.recommendType == '2';
      })
      .map((item: any) => {
        return item.recommendId;
      });
    (selectFaqModalRef.current as any)?.open({
      selectList: questionTypeList, //被选中列表
      selectedQuestionKeys, // 已选问题
      selectedWishKeys, // 已选意图
    });
  };
  // 确认FAQ/意图模态框 的选择
  const confirmUpdateSelect = (list: any[]) => {
    // 输出列表
    // console.log(list);
    onChange(list);
  };

  return (
    <>
      <div className={style['faq-select']} style={{ lineHeight: '32px' }}>
        <Condition r-if={hasValue}>
          <div className={style['question-box']}>
            {value?.map?.((item: any, i: number) => {
              return (
                <Tooltip title={item.recommend} placement={'topLeft'} key={i}>
                  <div className={style['qustion-label']} style={{ width: '200px' }}>
                    {item.recommendType == '1' ? (
                      <QuestionCircleOutlined className={style['icon']} />
                    ) : (
                      <MonitorOutlined className={style['icon']} />
                    )}
                    {item.recommend}
                  </div>
                </Tooltip>
              );
            })}
          </div>
        </Condition>

        <Condition r-if={!hasValue}>
          <div className={style['question-box']}>
            <div
              className={style['qustion-label']}
              style={{ width: '200px' }}
              onClick={openSelectFaqModal}
            >
              -------
            </div>
          </div>
        </Condition>

        <EditOutlined
          style={{ color: '#1890ff', lineHeight: '32px', fontSize: '16px', marginLeft: '4px' }}
          onClick={openSelectFaqModal}
        />
      </div>

      <SelectFaqModal cref={selectFaqModalRef} confirm={confirmUpdateSelect} />
    </>
  );
};

export default FaqSelect;
