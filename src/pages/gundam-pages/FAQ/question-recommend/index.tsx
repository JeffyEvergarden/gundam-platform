import React, { useState, useEffect } from 'react';
import { Button, Input, Select, Collapse } from 'antd';
import { ArrowLeftOutlined, SettingOutlined } from '@ant-design/icons';
import style from './style.less';
import { useFaqModal } from '../FAQ-manage/model';
import { history } from 'umi';

const { Panel } = Collapse;
const { Option } = Select;

const RecommendPage: React.FC<any> = (props: any) => {
  return (
    <div className={style['FAQ-page']}>
      <div className={style['page_top']}>
        <div className={style['page_top__left']}>
          <ArrowLeftOutlined
            className={style['blue']}
            style={{ marginRight: '6px' }}
            onClick={() => {
              history.goBack();
            }}
          />
          推荐问设置
        </div>
      </div>
    </div>
  );
};

export default RecommendPage;
