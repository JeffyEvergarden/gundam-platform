import React, { useState, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Space } from 'antd';
export default (props: any) => {
  const {} = props;
  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <div>
        <span>词典值</span>
        <Space>
          <DeleteOutlined />
          清空词典值
        </Space>
      </div>
    </React.Fragment>
  );
};
