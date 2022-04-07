import { useState, useImperativeHandle } from 'react';
import { Drawer, Form, Input, Select, Button } from 'antd';
import { PlusCircleOutlined, AppstoreAddOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { getFileInfo } from 'prettier';
import { add } from 'lodash';

const { Item: FormItem, List: FormList } = Form;
const { TextArea } = Input;
const { Option } = Select;

const DrawerForm = (props: any) => {
  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <div className={styles['antd-form']}>
        <FormList name="list">
          {(outFields, { add: _add, remove: _remove }) => {
            const addOutNew = () => {
              // console.log(fields);
              let length = outFields.length;
              _add(
                {
                  ruleList: [
                    {
                      ruleType: undefined,
                      ruleKey: undefined,
                      condition: undefined,
                      value: undefined,
                    },
                  ],
                },
                length,
              );
            };

            return (
              <div>
                <div className={styles['zy-row']}>
                  <div className={styles['title_sec']}>对话回应</div>
                  <Button
                    type="link"
                    icon={<AppstoreAddOutlined />}
                    style={{ marginLeft: '10px' }}
                    onClick={addOutNew}
                  >
                    新增回应策略
                  </Button>
                </div>
                <div>
                  {outFields.map((outFields: any, i: number) => {
                    return (
                      <div key={outFields.key} className={styles['rule-box']}>
                        <div style={{ paddingLeft: '24px' }}>
                          <div className={styles['zy-row']} style={{ paddingBottom: '6px' }}>
                            <Button
                              type="text"
                              icon={<MinusCircleOutlined />}
                              onClick={() => {
                                _remove(i);
                              }}
                            ></Button>
                            <span>回应策略 {i + 1}</span>
                          </div>

                          <div>fuck</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
        </FormList>
      </div>
    </Form>
  );
};

export default DrawerForm;
