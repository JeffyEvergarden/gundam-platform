import AudioPlay from '@/components/AudioPlay';
import config from '@/config';
import { ObjToSearch } from '@/utils';
import { Button, Form, Input, message, Modal } from 'antd';
import React, { useImperativeHandle, useRef, useState } from 'react';
import { useModel } from 'umi';
import { getSemisynthesis, getTotalSynthesis } from '../../model/api';

interface baseProps {
  cref?: any;
  confirm?: any;
}

const SoundVarModal: React.FC<baseProps> = (props: baseProps) => {
  const { cref, confirm } = props;

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<any>(false);
  const [varList, setVarList] = useState<any>([]);
  const [row, setRow] = useState<any>([]);
  const [url, setUrl] = useState<any>('');
  const audioRef = useRef<any>();

  const getVarLength = (text: any) => {
    let list = text.match(/(\$|#)\{[^({|}|\$|#)]+\}/g);
    return list;
  };

  const replaceVar = (text: any, obj: any) => {
    let str = text;

    Object?.keys(obj)?.forEach((item: any) => {
      let reg = new RegExp(item, 'g');
      str = str.replace(reg, obj[item]);
    });
    return str;
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      console.log(row);
      if (row?.soundType == 2 && !row?.soundRecordList?.length) {
        message.warning('请选择录音');
        return;
      }
      setUrl('');
      let list = getVarLength(row?.actionText || '');
      setVisible(true);
      setRow(row);
      setVarList(list);
    },
  }));

  const getUrl = async () => {
    let values = await form.validateFields();

    if (row.soundType == 1) {
      let params: any = {
        robotId: info.id,
        actionText: replaceVar(row?.actionText, values) || row?.answer || '',
      };
      try {
        await getTotalSynthesis(params).then((res) => {
          console.log(`${config.basePath}/robot/tts/ttsByConfig?${ObjToSearch(params)}`);

          if (!res?.resultCode) {
            setUrl(`${config.basePath}/robot/tts/ttsByConfig?${ObjToSearch(params)}`);
            audioRef?.current?.play();
          } else {
            setUrl('');
            message.error(res.resultDesc);
          }
        });
      } catch (e) {
        console.log('获取录音失败');
      }
    }
    if (row.soundType == 2) {
      let params: any = {
        robotId: info.id,
        soundRecordIdList: row?.soundRecordList?.map((item: any) => item?.id) || [],
        actionText: row?.actionText || row?.answer || '',
        varMapStr: values || '',
      };
      let paramsUrl: any = {
        robotId: info.id,
        soundRecordIdList: row?.soundRecordList?.map((item: any) => item?.id) || [],
        actionText: encodeURIComponent(JSON.stringify(row?.actionText || row?.answer || '')),
        varMapStr: encodeURIComponent(JSON.stringify(values)) || '',
      };
      try {
        await getSemisynthesis(params).then((res) => {
          console.log(`${config.basePath}/robot/tts/ttsMerge?${ObjToSearch(paramsUrl)}`);

          if (!res?.resultCode) {
            setUrl(`${config.basePath}/robot/tts/ttsMerge?${ObjToSearch(paramsUrl)}`);
            audioRef?.current?.play();
          } else {
            setUrl('');
            message.error(res.resultDesc);
          }
        });
      } catch (e) {
        console.log('获取录音失败');
      }
    }
  };

  return (
    <Modal
      width={650}
      title={'录音试听'}
      visible={visible}
      onCancel={() => {
        form.resetFields();
        setVisible(false);
      }}
      footer={false}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Form form={form} style={{ alignSelf: 'flex-start', width: '100%' }}>
          {varList?.map((item: any, index: any) => (
            <Form.Item
              name={item}
              key={index}
              label={`第${index + 1}参数配置`}
              rules={[{ required: true, message: '请输入' }]}
            >
              <Input></Input>
            </Form.Item>
          ))}
        </Form>
        <Button type="primary" onClick={getUrl} style={{ alignSelf: 'flex-end' }}>
          立即播放
        </Button>
        <div style={{ marginTop: '16px', width: '100%' }}>
          {url && <AudioPlay cref={audioRef} musicSrc={url} />}
        </div>
      </div>
    </Modal>
  );
};

export default SoundVarModal;
