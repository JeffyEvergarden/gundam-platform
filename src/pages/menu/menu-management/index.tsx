import React, { useState, useEffect, useRef } from 'react';
import style from './style.less';
import { Button, Table, ConfigProvider, message } from 'antd';
import { useMenuModel, useTableModel, successCode } from './model';
import { FormOutlined } from '@ant-design/icons';
import MyTree from './components/tree';
import zhCN from 'antd/lib/locale/zh_CN';
import Condition from './components/Condition';
import LinkModal from './components/link-modal';
import FormModal from './components/form-modal';
// 统一门户-菜单管理

const MenuManagement: React.FC<any> = (props: any) => {
  // 菜单列表
  const { menuList, getMenuList } = useMenuModel();
  // 表格数据源
  const {
    tableList, // 表格数据源
    setTableList,
    tableLoading,
    getTableList,
    opLoading, // 操作的loading
    setOpLoading,
    addModuleLink, // 增加链接
    deleteModuleLink, // 删除链接
    updateModuleLink,
    addMenuModule,
    deleteMenuModule,
    updateMenuModule,
    changeParent,
  } = useTableModel();

  // 标题
  const [title, setTitle] = useState<string>('');

  const [parentId, setParentId] = useState<string>('');

  // 弹窗相关
  const linkModalRef = useRef<any>({});
  const moduleModalRef = useRef<any>({});
  const moduleUpdateModalRef = useRef<any>({});

  // 分页相关 ---
  const [current, setCurrent] = useState<number>(1);

  const onChange = (val: number) => {
    setCurrent(val);
  };

  // 添加链接
  const addLink = async (obj: any) => {
    console.log(obj);
    if (!parentId) {
      message.warning('获取不懂parentId');
      return;
    }
    let params: any = {
      parentId: parentId,
      id: obj?._originInfo?.key || obj?._originInfo?.id || undefined,
      ...obj.form,
    };
    console.log(obj);
    if (obj?._openType === 'new') {
      // 新增模式
      let res: any = await addModuleLink(params);
      if (res) {
        // res.index = tableList.length;
        // setTableList([...tableList, res]);
        (linkModalRef.current as any)?.close();
        //
        getTableList({ parentId });
      }
    } else if (obj?._openType === 'edit') {
      // 编辑模式
      let res: any = await updateModuleLink(params);
      if (res) {
        getTableList({ parentId });
        (linkModalRef.current as any)?.close();
      }
    }
  };

  // 删除链接
  const deleteLink = async (row: any, index: number) => {
    let i: number = (current - 1) * 10 + index;
    console.log('删除序列', i);
    let res: any = await deleteModuleLink({ id: row.id });
    if (res) {
      tableList.splice(i, 1);
      setTableList([...tableList]);
    }
  };

  // 打开编辑弹窗
  const openEditModal = (row: any, index: number) => {
    setOpLoading(false);
    (linkModalRef.current as any)?.open(row);
  };

  // 表格列名
  const columns = [
    {
      title: '链接名称',
      dataIndex: 'title',
      width: 200,
    },
    {
      title: '缩略图',
      dataIndex: 'icon',
      width: 120,
      render: (val: any, row: any) => {
        if (!row.icon) {
          return null;
        } else {
          return <img src={row.icon} className={style['icon']} alt="无法识别" />;
        }
      },
    },
    {
      title: '链接名称',
      dataIndex: 'url',
    },
    {
      title: '使用状态',
      dataIndex: 'showType',
      width: 150,
      render: (val: any) => {
        if (val == 'leader') {
          return '领导';
        } else if (val == 'all') {
          return '领导和普通用户';
        } else {
          // employee
          return '普通用户';
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'op',
      width: 130,
      render: (val: any, row: any, index: number) => {
        return (
          <div style={{ display: 'flex' }}>
            <Button
              type="link"
              onClick={() => {
                openEditModal(row, index);
              }}
              style={{ marginRight: '6px' }}
            >
              编辑
            </Button>
            <Button
              type="link"
              danger
              onClick={() => {
                deleteLink(row, index);
              }}
            >
              删除
            </Button>
          </div>
        );
      },
    },
  ];

  // 树形选择结果
  const onSelect = (...args: any[]) => {
    // 输出树形选择结果
    console.log('输出树形选择结果');
    let node: any = args[1]?.node || {};
    console.log(node);
    let params = {
      parentId: node?.key || node?.id || undefined,
    };
    setParentId(node?.key || node?.id || undefined);
    setTitle(node?.title || '');
    if (!params.parentId) {
      message.warning('获取不到该节点ID');
      return;
    }
    setCurrent(1);
    getTableList(params);
  };

  // 触发更换节点的父节点
  const touchChangeParent = async (node: any, parentKey: string) => {
    console.log('触发更换节点的父节点');
    console.log(node);
    console.log(parentKey);
    let params: any = {
      id: node.id || node.key,
      parentId: parentKey,
    };
    // 调接口
    await changeParent(params);
  };

  // 链接相关
  const openAddModal = () => {
    setOpLoading(false);
    (linkModalRef.current as any)?.open();
  };

  // 模块相关
  // 删除模块
  const deleteMoudle = async (row: any) => {
    let res: any = await deleteMenuModule({ id: row.key });
    if (res.code === successCode) {
      return true;
    } else {
      return false;
    }
  };

  // 新增一级模块
  const openModuleFirstAddModal = () => {
    setOpLoading(false);
    (moduleModalRef.current as any)?.open({ parent: { key: '100' } });
  };
  // 新增二级模块
  const openModuleAddModal = (row: any) => {
    setOpLoading(false);
    (moduleModalRef.current as any)?.open({ parent: row });
  };
  // 接口添加模块
  const addModule = async (obj: any, callback: (...args: any[]) => void) => {
    // 只修改模块
    let params: any = {
      parentId: obj._originInfo?.parent?.key,
      id: obj._originInfo?.key || obj._originInfo?.id || undefined,
      ...obj.form,
    };
    if (obj?._openType === 'new') {
      // 新增
      let res: any = await addMenuModule(params);
      if (res) {
        getMenuList(); // 刷新
        (moduleModalRef.current as any)?.close();
      }
    }
  };

  // 编辑模块
  // ---------------
  const openModuleEditModal = (row: any, callback: (...args: any[]) => void) => {
    setOpLoading(false);
    (moduleUpdateModalRef.current as any)?.open({ ...row, callback });
  };

  // 确认编辑模块
  const confirmEditModule = async (obj: any) => {
    // openType 取决于传入的对象带不带id 或者key
    const { callback } = obj._originInfo;
    console.log(obj);
    // 修改模块
    let params: any = {
      parentId: obj._originInfo?.parent?.key || obj._originInfo?.parentId, // 取父节点id
      id: obj._originInfo?.key || obj._originInfo?.id || undefined,
      ...obj.form,
    };
    console.log('编辑参数');
    console.log(params);
    console.log('原始参数');
    console.log(obj);
    if (obj?._openType === 'edit') {
      // 编辑
      let res: any = await updateMenuModule(params);
      // 回参数结果
      if (res) {
        callback?.({ ...obj.form }); // 回调改数据
        (moduleUpdateModalRef.current as any)?.close();
      }
    }
  };

  // 初始化 mounted
  useEffect(() => {
    getMenuList();
    // openAddModal();
  }, []);

  //  通用表单配置
  const formModalRef = useRef<any>({});
  // 打开弹窗
  const openFormModal = () => {
    (formModalRef.current as any).open();
  };

  return (
    <ConfigProvider locale={zhCN}>
      <div className={style['menu-home_bg']}>
        <div className={style['button-bg']}>
          <Button type="primary" icon={<FormOutlined />} onClick={openFormModal}>
            通用配置
          </Button>
        </div>
        <div className={style['menu-box']}>
          <div className={style['menu-left']}>
            <div className={style['button_add']} onClick={openModuleFirstAddModal}>
              新增模块
            </div>
            <MyTree
              data={menuList}
              onChange={onSelect}
              touchChangeParent={touchChangeParent}
              deleteApi={deleteMoudle}
              openEditModal={openModuleEditModal}
              openAddModal={openModuleAddModal}
            />
          </div>

          <div className={style['menu-right']}>
            {/* 有选中值 */}
            <Condition r-if={title}>
              {/* 标题 */}
              <div className={style['content-title']}>{title}</div>
              {/* 按钮组 */}
              <div className={style['content-operator']}>
                <Button onClick={openAddModal}>新增链接</Button>
                <div className={style['right']}>
                  {/* <Button style={{ marginRight: '16px' }}>取消</Button>
                  <Button type="primary">保存</Button> */}
                </div>
              </div>

              {/* 表格 */}
              <div className={style['table-box']}>
                <Table
                  pagination={{ current, onChange }}
                  dataSource={tableList}
                  columns={columns}
                  rowKey="index"
                  loading={tableLoading}
                />
              </div>
            </Condition>
          </div>
          {/* 新增模块  因为调不同的接口三个不同的处理逻辑*/}
          <LinkModal type={1} cref={moduleModalRef} loading={opLoading} confirm={addModule} />

          {/* 编辑模块 */}
          <LinkModal
            type={1}
            cref={moduleUpdateModalRef}
            loading={opLoading}
            confirm={confirmEditModule}
          />

          {/* 新增编辑链接 */}
          <LinkModal type={2} cref={linkModalRef} loading={opLoading} confirm={addLink} />

          <FormModal cref={formModalRef} />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default MenuManagement;
