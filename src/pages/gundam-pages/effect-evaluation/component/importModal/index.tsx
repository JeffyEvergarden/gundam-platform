import { UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, message, Modal, Select, Upload } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';
import { successCode } from '../../model';
import { importSample } from '../../model/api';
import style from './style.less';

const { Item: FormItem } = Form;
const { Option } = Select;

const ImportModal: React.FC<any> = (props: any) => {
  const { cref, refresh } = props;

  // const { addSample, editSample } = useSampleModel();

  const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
    setInfo: model.setInfo,
  }));

  // const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [checkbox, setCheckbox] = useState<boolean>(false);
  const [row, setRow] = useState<any>();

  const submit = async () => {
    if (!fileList.length) {
      message.warning('请选择一个文件');
      return;
    }
    const formData = new FormData();

    formData.append('file', fileList[0]);
    formData.append('robotId', info.id);
    formData.append('cover', checkbox ? '1' : '0');
    formData.append('id', row?.sampleSetId);

    await importSample(formData).then((res) => {
      if (res.resultCode == successCode) {
        message.success(res.resultDesc);
        refresh();
        setVisible(false);
      } else {
        message.error(res.resultDesc);
      }
    });
  };

  const close = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      setRow(row);
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
      console.log(fileList, file);
      if (fileList.length) {
        message.warning('最多上传一个文件');
        return;
      }
      if (file?.name?.slice(-5) != '.xlsx') {
        message.warning('只能上传xlsx格式文件');
        return;
      }
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
        setVisible(false);
      }}
      okText={'提交'}
      onOk={submit}
    >
      <div style={{ paddingLeft: '24px' }}>
        <Upload
          {...option}
          // action="localhost:8000"
          accept={'.xlsx'}
        >
          <Button icon={<UploadOutlined />}>选择上传文件</Button>
        </Upload>
        <div className={style['form']}>
          <div>
            <span style={{ color: 'red' }}>*</span> 限.xlsx文件
          </div>
          <div>
            <span style={{ color: 'red' }}>*</span> 单个样本集不超过10000条样本
          </div>
          <div className={style['checkbox']}>
            <a>样板下载</a>
          </div>
          <div className={style['checkbox']}>
            <Checkbox
              checked={checkbox}
              onChange={(e) => {
                setCheckbox(e.target.checked);
              }}
            ></Checkbox>
            <span className={style['cover']}>覆盖导入（导入新样本并清空样本集中原有样本）</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImportModal;
