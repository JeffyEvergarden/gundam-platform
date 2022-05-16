import React, { useState, useEffect } from 'react';
import { message, Button, Upload } from 'antd';
import config from '../../const';
import globalConfig from '@/config';

const Options = {
  name: 'file',
  action: config.UPLOAD_FILE,
  headers: {},
  withCredentials: true,
  maxCount: 1,
  maxSize: 10,
  showUploadList: false,
};

const UploadFile = (props: any) => {
  const { children, submit } = props;

  // 上传图片
  const beforeUpload = (file: any) => {
    // file.type
    const isLt10M = file.size / 1024 / 1024 < Options.maxSize;
    if (!isLt10M) {
      message.warning(`上传的文件限制${Options.maxSize}MB以内!`);
    }
    return true;
  };

  // 上传
  const handleChange = (info: any) => {
    if (info.file.status === 'done') {
      const fileName = info.file.name;
      let res: any = info.file.response;
      if (res.resultCode === globalConfig.successCode) {
        let urlId = res?.data;
        if (!urlId || typeof urlId !== 'string') {
          message.warning('文件上传失败');
          return;
        }
        let path = config.GET_FILE_URL + urlId + '&type=video';
        submit?.({
          fileName,
          path,
        });
      }
    }
  };

  return (
    <Upload {...Options} beforeUpload={beforeUpload} onChange={handleChange}>
      {children}
    </Upload>
  );
};

export default UploadFile;
