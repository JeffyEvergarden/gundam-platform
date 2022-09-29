import Condition from '@/components/Condition';
import SoundListModal from '@/pages/gundam-pages/sound-record/component/sound-list-modal';
import { ArrowDownOutlined, ArrowUpOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import style from './style.less';

const SoundSelectModal: React.FC<any> = (props: any) => {
  const { cref, setform, type = 'checkbox' } = props;
  const soundRef = useRef<any>();
  const [visible, setVisible] = useState<any>(false);
  const [selectList, setSelectList] = useState<any>([]);
  const [listIndex, setListIndex] = useState<any>();

  useImperativeHandle(cref, () => ({
    open: (list: any, index: any) => {
      setListIndex(index);
      setVisible(true);
      setSelectList(list || []);
    },
  }));

  const getSelect = (list: any) => {
    console.log(list);
    list = list.map((item: any) => ({ id: item.id, name: item.name, text: item.text }));
    setSelectList(list);
  };

  const move = (type: any, index: any) => {
    let arr: any = [...selectList];
    if (type == 'up') {
      let temp = arr[index - 1]; //上移：当前item与上一个交换位置
      arr[index - 1] = arr[index];
      arr[index] = temp;
    }
    if (type == 'down') {
      let temp = arr[index + 1]; // 下移：当前item与下一个交换位置
      arr[index + 1] = arr[index];
      arr[index] = temp;
    }
    if (type == 'delete') {
      arr.splice(index, 1);
    }
    setSelectList(arr);
  };

  return (
    <Modal
      width={650}
      title={'录音选择'}
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      onOk={() => {
        setform(selectList, listIndex);
        setVisible(false);
      }}
    >
      <div style={{ display: 'flex' }}>
        <span style={{ flexWrap: 'nowrap' }}>录音方式：</span>
        <div style={{ flex: 1 }}>
          <Button
            onClick={() => {
              soundRef?.current?.open(selectList);
            }}
            size={'small'}
          >
            点击选择录音
          </Button>
          {selectList?.map((item: any, index: any) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap' }}>
              <div className={style['soundRecord']}>
                <Tooltip title={item.name}>
                  {index + '. '}
                  {item.name}
                </Tooltip>
              </div>
              <div style={{ display: 'flex' }}>
                <Condition r-if={index != 0}>
                  <Button
                    style={{ marginRight: '8px' }}
                    type={'link'}
                    onClick={() => {
                      move('up', index);
                    }}
                    icon={<ArrowUpOutlined />}
                  ></Button>
                </Condition>
                <Condition r-if={index != selectList?.length - 1}>
                  <Button
                    style={{ marginRight: '8px' }}
                    type={'link'}
                    onClick={() => {
                      move('down', index);
                    }}
                    icon={<ArrowDownOutlined />}
                  ></Button>
                </Condition>
                <Button
                  style={{ marginRight: '8px' }}
                  type={'link'}
                  onClick={() => {
                    move('delete', index);
                  }}
                  danger
                  icon={<CloseOutlined />}
                ></Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SoundListModal cref={soundRef} confirm={getSelect} type={type}></SoundListModal>
    </Modal>
  );
};

export default SoundSelectModal;
