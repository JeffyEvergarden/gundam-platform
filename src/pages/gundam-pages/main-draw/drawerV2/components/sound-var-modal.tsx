import AudioPlay from '@/components/AudioPlay';
import config from '@/config';
import { ObjToSearch } from '@/utils';
import { Button, Form, Input, Modal } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
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
        actionText: replaceVar(row?.actionText, values) || '',
      };
      await getTotalSynthesis(params).then((res) => {
        console.log(`${config.basePath}/robot/tts/ttsByConfig?${ObjToSearch(params)}`);

        if (!res.resultCode) {
          setUrl(`${config.basePath}/robot/tts/ttsByConfig?${ObjToSearch(params)}`);
        }
      });
    }
    if (row.soundType == 2) {
      let params: any = {
        robotId: info.id,
        soundRecordList: row?.soundRecordList?.map((item: any) => item?.id) || [],
        actionText: row?.actionText || '',
        varMapStr: JSON?.stringify?.(values) || '',
      };
      await getSemisynthesis(params).then((res) => {
        console.log(`${config.basePath}/robot/tts/ttsMerge?${ObjToSearch(params)}`);

        if (!res.resultCode) {
          setUrl(`${config.basePath}/robot/tts/ttsMerge?${ObjToSearch(params)}`);
        }
      });
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
        <Form form={form} style={{ marginTop: '36px', alignSelf: 'flex-start', width: '100%' }}>
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
        <div style={{ marginTop: '16px' }}>{url && <AudioPlay musicSrc={url} />}</div>
      </div>
    </Modal>
  );
};

export default SoundVarModal;
