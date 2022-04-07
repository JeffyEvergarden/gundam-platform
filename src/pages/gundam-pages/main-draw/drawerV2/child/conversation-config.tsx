import { Form, Input, Select, Button, Checkbox, Space, Radio } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import LabelSelect from '../../drawer/components/label-select';
import GlobalVarButton from '../components/global-var-button';
import Condition from '@/components/Condition';
import styles from './style.less';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const ConversationConfig = (props: any) => {
  const { name } = props;
  return (
    <div className={styles['conversation-list']}>
      <FormList name={name}>
        {(fields, { add, remove }) => {
          const addNew = () => {
            let length = fields.length;
            // console.log(length);
            add(
              {
                actionType: '文本',
                nodeText: [],
              },
              length,
            );
          };

          return (
            <div>
              <div className={styles['title_thrid']} style={{ paddingLeft: '20px' }}>
                对话回应
                <Button
                  type="link"
                  icon={<AppstoreAddOutlined />}
                  style={{ marginLeft: '10px' }}
                  onClick={addNew}
                >
                  新增答复
                </Button>
              </div>

              <div>
                {fields.map((field: any, index: number) => (
                  <div key={field.key} className={styles['list-box']}>
                    <div style={{ width: '30px', flexShrink: 0 }}>
                      <Button
                        icon={<MinusCircleOutlined />}
                        type="link"
                        danger
                        onClick={() => {
                          remove(index);
                        }}
                      />
                    </div>
                    <div className={styles['num']}>{index + 1}.</div>
                    <div>
                      {/* 类型 */}
                      <FormItem
                        name={[field.name, 'actionType']}
                        fieldKey={[field.fieldKey, 'actionType']}
                        label="答复类型"
                      >
                        <Radio.Group>
                          <Radio value={'文本'}>文本</Radio>
                        </Radio.Group>
                      </FormItem>

                      {/* 答复内容 */}
                      <FormList name={[field.name, 'nodeText']}>
                        {(innerfields, { add, remove }) => {
                          // console.log(fields);
                          const addNew = () => {
                            let length = innerfields.length;
                            add({ actionText: '', textLabels: [] }, length);
                          };

                          return (
                            <div style={{ paddingBottom: '20px' }}>
                              <div className={styles['zy-row']}>
                                <div
                                  className={styles['title_thrid']}
                                  style={{ marginRight: '20px' }}
                                >
                                  答复内容:
                                </div>
                                <Button
                                  type="link"
                                  icon={<PlusCircleOutlined />}
                                  onClick={addNew}
                                  style={{ marginLeft: '2px' }}
                                ></Button>
                              </div>

                              {innerfields.map((innerfield: any, index: number) => (
                                <div
                                  key={innerfield.key}
                                  className={styles['inner-list-box']}
                                  style={{ paddingLeft: '30px' }}
                                >
                                  <div className={styles['num']}>{index + 1}.</div>
                                  <div>
                                    <Form.Item
                                      name={[innerfield.name, 'actionText']}
                                      fieldKey={[innerfield.fieldKey, 'actionText']}
                                      label="答复内容"
                                      rules={[{ required: true, message: '请输入答复内容' }]}
                                    >
                                      <GlobalVarButton
                                        placeholder="请输入响应话术"
                                        type="textarea"
                                        style={{ width: '400px' }}
                                        autoComplete="off"
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      name={[innerfield.name, 'textLabels']}
                                      fieldKey={[innerfield.fieldKey, 'textLabels']}
                                      label="选择标签"
                                    >
                                      <LabelSelect color="orange"></LabelSelect>
                                    </Form.Item>
                                  </div>

                                  <Button
                                    icon={<MinusCircleOutlined />}
                                    type="link"
                                    danger
                                    onClick={() => {
                                      remove(index);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          );
                        }}
                      </FormList>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      </FormList>
    </div>
  );
};

export default ConversationConfig;
