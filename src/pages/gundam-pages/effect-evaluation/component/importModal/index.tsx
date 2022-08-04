import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, Upload } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';

const { Item: FormItem } = Form;
const { Option } = Select;

const ImportModal: React.FC<any> = (props: any) => {
  const { cref, refresh } = props;

  // const { addSample, editSample } = useSampleModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const submit = async () => {
    const values = await form.validateFields();
    console.log(values);
    let reqData = {
      robotId: info.id,
      ...values,
    };
  };

  const close = () => {
    form.resetFields();
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: () => {
      setVisible(true);
    },
    close,
    submit,
  }));

  const option: any = {
    onRemove: (file: any) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file: any) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <Modal
      width={650}
      title={`导入样本`}
      visible={visible}
      onCancel={() => {
        form.resetFields();
        setVisible(false);
      }}
      okText={'提交'}
      onOk={submit}
    >
      <Upload {...option} maxCount={1} accept={'.xlsx'}>
        <Button icon={<UploadOutlined />}>选择上传文件</Button>
      </Upload>
    </Modal>
  );
};

export default ImportModal;
