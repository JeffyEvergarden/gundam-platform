import { PageContainer, ProBreadcrumb } from '@ant-design/pro-layout';
import React, { useState, useEffect, useRef } from 'react';
import { useModel, history, useLocation } from 'umi';
import { Button, Tree, message, Checkbox } from 'antd';
import { useRoleInfoModel, useRoleModel } from '../model';
import { ArrowLeftOutlined } from '@ant-design/icons';

import style from '../style.less';

const AuthPage = (props: any) => {
  const { AUTH_TREE, autoExpendKeys } = useRoleInfoModel();

  const { roleInfo, getRole, updateAuth } = useRoleModel();

  const location: any = useLocation();

  const roleId: any = location?.query?.roleCode || '';

  const roleName: any = location?.query?.name || '';

  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const [check, setCheck] = useState<boolean>(false);

  const onCheck = (checked: any) => {
    // console.log('onCheck', checked);
    setCheckedKeys(checked);
  };

  const onChange = (e: any) => {
    // console.log(e.target);
    const val = e.target.checked;
    setCheck(val);
    if (val) {
      setCheckedKeys([...autoExpendKeys]);
    } else {
      setCheckedKeys([]);
    }
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };

  const submit = async () => {
    // console.log('submit');
    // console.log(checkedKeys);
    let submitObj = {
      roleCode: roleId,
      operationCodes: checkedKeys,
    };
    let res = await updateAuth(submitObj);
    if (res) {
      message.success('保存成功');
      // 操作成功返回列表
      history.push('/users/roleManagement/list');
    }
  };

  const getInfo = async () => {
    let res = await getRole({ roleCode: roleId });
    if (!res) {
      history.replace('/users/roleManagement/list');
    }
  };

  useEffect(() => {
    if (roleId) {
      getInfo();
    } else {
      history.replace('/users/roleManagement/list');
      message.warning('获取不到角色ID');
    }
  }, []);

  useEffect(() => {
    if (roleInfo) {
      let selectKey: any[] = Array.isArray(roleInfo) ? roleInfo : [];
      selectKey = selectKey?.map((item: any) => {
        return item.operationCode;
      });
      setCheckedKeys(selectKey);
    }
  }, [roleInfo]);

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
                  history.push('/users/roleManagement/list');
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

          <div className={style['info-box']}>
            <span className={style['info-title']}>{roleName}</span>

            <Checkbox checked={check} onChange={onChange} style={{ marginLeft: '32px' }}>
              全选
            </Checkbox>
          </div>
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
