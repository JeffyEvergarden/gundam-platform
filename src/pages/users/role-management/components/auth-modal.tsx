import { useState, useImperativeHandle, useRef, useEffect } from 'react';
import { Drawer, Form, Input, Select, Button, message, Checkbox } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { useModel } from 'umi';
import { useRoleInfoModel, useRoleModel } from '../model';
import Condition from '@/components/Condition';
import config from '@/config/index';
import { UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const { Item: FormItem, List: FormList } = Form;

const useUpdateModel = () => {
  const [num, setNum] = useState<any>(0);

  const updatePage = () => {
    setNum(num + 1);
  };

  return {
    updatePage,
  };
};

const flatten: (arr: any[]) => any = (arr: any[]) => {
  return arr.reduce((result: any[], item: any) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

const DrawerForm = (props: any) => {
  const { cref, confirm } = props;

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const { AUTH_TREE, autoExpendKeys } = useRoleInfoModel();

  const [currentInfo, setInfo] = useState<any>({});

  // const [selectKey, setSelectKey] = useState<any[]>([]);

  const { updatePage } = useUpdateModel();

  const onChange = () => {
    updatePage();
  };

  const initValue = (selectKey: any[]) => {
    let arr = new Array(AUTH_TREE.length).fill([]);
    AUTH_TREE.forEach((item: any, index: number) => {
      const hasChildren = Array.isArray(item.children) && item.children.length > 0;
      const children: any[] = hasChildren ? item.children : [];
      const needKey: any[] =
        children.length > 0 ? children.map((secItem: any) => secItem.key) : [item.key];
      arr[index] = needKey.filter((key) => selectKey.includes(key));
    });
    console.log(arr);
    return arr;
  };

  const recordInfo = useRef<any>({});

  const onClose = () => {
    setVisible(false);
  };

  useImperativeHandle(cref, () => ({
    open: (info: any, callback: any) => {
      // console.log(info);
      setInfo(info);
      recordInfo.current.info = info;
      recordInfo.current.callback = callback;
      form.resetFields();
      form.setFieldsValue({
        authList: initValue(info.selectKey || []),
      });
      setVisible(true);
    },
    close: onClose,
  }));

  const save = async () => {
    // console.log(form.getFieldsValue());
    console.log('-------');
    let res: any = await form.validateFields().catch(() => {
      message.warning('存在未填写完全的配置');
      return false;
    });
    console.log(res);
    const authList = res.authList || [];
    const _authList: any[] = flatten(authList) || [];
    if (res === false) {
      return;
    } else {
      confirm?.({
        ...recordInfo.current.info,
        value: _authList,
      });
      // onClose();
    }
  };

  useEffect(() => {}, []);

  // 尾部 footer 代码
  const footer = (
    <div className={styles['zy-row_end']}>
      <Button type="primary" shape="round" onClick={save}>
        保存
      </Button>
    </div>
  );

  return (
    <Drawer
      title="权限配置"
      width={850}
      onClose={onClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
      footer={footer}
      destroyOnClose
    >
      <div className={styles['title']}>
        <div className={styles['icon']}>
          <UserOutlined style={{ color: '#1890ff', fontSize: '22px' }} />
        </div>
        <span className={styles['label']}>{currentInfo.name}</span>
      </div>

      <Form form={form} className={styles['auth-page']}>
        <FormList name="authList">
          {(outFields, { add: _add, remove: _remove }) => {
            return (
              <div>
                {outFields.map((outField: any, index: number) => {
                  const _item = AUTH_TREE[index];
                  if (!_item) {
                    return null;
                  }

                  const _authlist = form.getFieldValue('authList');
                  const _list = _authlist?.[index] || [];

                  // 有没有孩子
                  const hasChildren = Array.isArray(_item.children) && _item.children.length > 0;
                  const children: any[] = hasChildren ? _item.children : [];
                  // 可以存在的孩子个数
                  const length = children.length;
                  // 需要的key值
                  const needKey: any[] =
                    children.length > 0 ? children.map((secItem: any) => secItem.key) : [_item.key];

                  // 判断有非勾选的值 （通过找出是否有个键值不在selectKey数组里）
                  const val: boolean = needKey.find((key: any) => {
                    return !_list.includes(key);
                  });
                  // 是否有勾选值
                  const haskey = !!needKey.find((key: any) => {
                    return _list.includes(key);
                  });

                  const flag = val && haskey;

                  const onChangeKey = (flag: any, arr: any[]) => {
                    console.log(flag, arr);
                    if (flag) {
                      _authlist[index] = [...needKey];
                    } else {
                      _authlist[index] = [];
                    }
                    updatePage();
                  };

                  return (
                    <div className={styles['auth-box']} key={index}>
                      <Condition r-if={hasChildren}>
                        <div className={styles['auth-title']}>
                          {_item.title}
                          <Checkbox
                            checked={!val && haskey}
                            indeterminate={flag}
                            onChange={(e: any) => {
                              console.log(needKey.length, length);
                              onChangeKey(e.target.checked, needKey);
                            }}
                            style={{ marginLeft: '16px' }}
                          ></Checkbox>
                        </div>

                        <FormItem name={[outField.name]}>
                          <CheckboxGroup onChange={onChange}>
                            <div className={styles['auth-content']}>
                              {children.map((secItem: any, i: any) => {
                                return (
                                  <div key={`sub_${index}_${i}`}>
                                    <Checkbox value={secItem.key}>
                                      <div className={styles['desc_block']}>{secItem?.title}</div>
                                    </Checkbox>
                                  </div>
                                );
                              })}
                            </div>
                          </CheckboxGroup>
                        </FormItem>
                      </Condition>

                      <Condition r-if={!hasChildren}>
                        <FormItem name={[outField.name]}>
                          <CheckboxGroup>
                            <div className={styles['auth-title']}>
                              {_item.title}
                              <Checkbox value={_item.key} style={{ marginLeft: '16px' }}></Checkbox>
                            </div>
                          </CheckboxGroup>
                        </FormItem>
                      </Condition>
                    </div>
                  );
                })}
              </div>
            );
          }}
        </FormList>
      </Form>
    </Drawer>
  );
};

export default DrawerForm;
