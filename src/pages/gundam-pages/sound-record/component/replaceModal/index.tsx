import config from '@/config';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Modal, Tooltip, Upload } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';
import { uploadSound } from '../../model/api';
import style from './style.less';

const successCode = config.successCode;

const ReplaceModal: React.FC<any> = (props: any) => {
  const { cref, refresh, activeKey } = props;
  const [visible, setVisible] = useState<any>(false);
  const [soundInfo, setSoundInfo] = useState<any>({});
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageType, setPageType] = useState<any>('add');
  // const [form] = Form.useForm();
  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  useImperativeHandle(cref, () => ({
    open: (r: any, type: any) => {
      setVisible(true);
      setSoundInfo(r);
      setPageType(type || 'edit');
    },
  }));

  const option: any = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      console.log(fileList, file);
      if (fileList.length) {
        message.warning('最多上传一个文件');
        return false;
      }
      if (file?.name?.slice(-4) != '.wav') {
        message.warning('只能上传wav格式文件');
        return false;
      }
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const submit: any = async () => {
    if (!fileList.length) {
      message.warning('请选择一个文件');
      return;
    }
    const formData = new FormData();
    if (pageType == 'edit') {
      formData.append('file', fileList[0]);
      formData.append('robotId', info.id);
      formData.append('type', activeKey);
      formData.append('id', soundInfo?.id);
    } else {
      formData.append('file', fileList[0]);
      formData.append('robotId', info.id);
      formData.append('type', activeKey);
    }

    setLoading(true);
    await uploadSound(formData).then((res) => {
      setLoading(false);
      if (res.resultCode == successCode) {
        message.success(res.resultDesc);
        setFileList([]);
        setVisible(false);
        // form.resetFields();
        refresh();
      } else {
        message.error(res.resultDesc);
      }
    });
  };

  return (
    <Modal
      width={650}
      title={
        <>
          {pageType == 'edit' ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              替换录音{' '}
              <Tooltip title={soundInfo?.name || ''}>
                <span className={style['modalTitle']}>{soundInfo?.name || ''}</span>
              </Tooltip>
            </div>
          ) : (
            '上传录音'
          )}
        </>
      }
      visible={visible}
      onCancel={() => {
        setFileList([]);
        setVisible(false);
        // form.resetFields();
      }}
      okText={loading ? (pageType == 'edit' ? '替换中' : '上传中') : '提交'}
      onOk={submit}
      confirmLoading={loading}
    >
      <div style={{ paddingLeft: '24px' }}>
        <Upload
          {...option}
          // action="localhost:8000"
        >
          <Button icon={<UploadOutlined />}>点击选择录音</Button>
        </Upload>
        {/* <Condition r-if={pageType == 'add'}>
          <Form form={form} style={{ marginTop: '16px' }}>
            <Form.Item name="type" label="录音类型" initialValue={1}>
              <Radio.Group>
                <Radio value={1}>流程语音节点</Radio>
                <Radio value={2}>FAQ录音</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Condition> */}
      </div>
    </Modal>
  );
};

export default ReplaceModal;
