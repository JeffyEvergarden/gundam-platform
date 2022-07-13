import { PageContainer, ProBreadcrumb } from '@ant-design/pro-layout';
import React, { useState, useEffect, useRef } from 'react';
import { useModel, history } from 'umi';
import { Button, Tree } from 'antd';
import { useRoleInfoModel } from '../model';
import { ArrowLeftOutlined } from '@ant-design/icons';

import style from '../style.less';

const AuthPage = (props: any) => {
  const { AUTH_TREE, autoExpendKeys } = useRoleInfoModel();

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const onCheck = (checked: any) => {
    console.log('onCheck', checked);
    setCheckedKeys(checked);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  const submit = () => {
    console.log('submit');
    console.log(checkedKeys);
    console.log(selectedKeys);
  };

  return (
    <PageContainer
      className={style['diy-container']}
      title={<div />}
      content={
        <>
          <div className={style['zy-row']}>
            <div className={style['left']}>
              <Button
                icon={<ArrowLeftOutlined style={{ fontSize: '20px' }} />}
                style={{ padding: 0 }}
                type="link"
                onClick={() => {
                  history.push('/gundamPages/faq/main');
                }}
              ></Button>

              <span className={'ant-page-header-heading-title'} style={{ fontSize: '22px' }}>
                角色权限设置
              </span>
            </div>
            <div className={style['right']}>
              <Button type="primary" onClick={submit}>
                保存
              </Button>
            </div>
          </div>

          <div className={style['info-box']}></div>
        </>
      }
    >
      <div className={style['auth-page']}>
        <div className={style['left']}>
          <Tree
            checkable
            defaultExpandedKeys={autoExpendKeys}
            // autoExpandParent={true}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            treeData={AUTH_TREE}
          />
        </div>

        <div className={style['right']}></div>
      </div>
    </PageContainer>
  );
};

export default AuthPage;
