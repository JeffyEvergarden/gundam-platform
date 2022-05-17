import React, { useState, useEffect } from 'react';
import { Modal, Upload, message, Button } from 'antd';

export default (props: any) => {
  const { uploadUrl, visible, onSubmit, onCancel } = props;
  const uploads = {
    name: 'file',
    action: uploadUrl,
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const success = () => {
    onSubmit();
  };

  const cancel = () => {
    onCancel();
  };

  return (
    <Modal title={'导入'} visible={visible} onCancel={cancel}>
      <Upload {...uploads}>
        <Button type="primary" onClick={success}>
          上传文件
        </Button>
      </Upload>
    </Modal>
  );
};
