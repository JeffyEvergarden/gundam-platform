import { Form, Input, Select, Button, Checkbox, Space, Radio } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import LabelSelect from '../components/label-select';
import GlobalVarButton from '../components/global-var-button';
import RuleSelect from '../components/rule-var-button';
import Condition from '@/components/Condition';
import styles from '../style.less';
import { ACTION_LIST } from '../const';

const { Item: FormItem, List: FormList } = Form;
const { Option } = Select;

const ConversationConfig = (props: any) => {
  const { wishList, wordSlotList, showRule = true } = props;

  return (
    <div>
      <FormList name="conversationList">
        {(fields, { add, remove }) => {
          const addNew = () => {
            let length = fields.length;
            // console.log(length);
            add(
              {
                actionType: '文本',
                nodeText: [],
                hungUp: false,
                transfer: undefined,
                msgFlag: false,
                msg: '',
                nodeTransferText: '',
                textLabels: [],
              },
              length,
            );
          };

          return (
            <div>
              <div className={styles['title']}>
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
                        {(fields, { add, remove }) => {
                          // console.log(fields);
                          const addNew = () => {
                            let length = fields.length;
                            add({ actionText: '', textLabels: [] }, length);
                          };

                          return (
                            <div style={{ paddingBottom: '20px' }}>
                              <div className={styles['zy-row']}>
                                <div
                                  className={styles['title_sec']}
                                  style={{ marginRight: '20px' }}
                                >
                                  答复内容:
                                </div>
                                <Button
                                  type="link"
                                  icon={<PlusCircleOutlined />}
                                  onClick={addNew}
                                ></Button>
                              </div>

                              {fields.map((field: any, index: number) => (
                                <div
                                  key={field.key}
                                  className={styles['inner-list-box']}
                                  style={{ paddingLeft: '30px' }}
                                >
                                  <div className={styles['num']}>{index + 1}.</div>
                                  <div>
                                    <Form.Item
                                      name={[field.name, 'actionText']}
                                      fieldKey={[field.fieldKey, 'actionText']}
                                      label="答复内容"
                                      rules={[{ required: true, message: '请输入答复内容' }]}
                                    >
                                      <GlobalVarButton
                                        placeholder="请输入响应话术"
                                        style={{ width: '400px' }}
                                        autoComplete="off"
                                      />
                                    </Form.Item>

                                    <Form.Item
                                      name={[field.name, 'textLabels']}
                                      fieldKey={[field.fieldKey, 'textLabels']}
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

                      {/* 结束挂机 */}
                      <Space>
                        <FormItem
                          name={[field.name, 'hungUp']}
                          label="是否结束挂机"
                          valuePropName="checked"
                          style={{ width: '220px' }}
                        >
                          <Checkbox>结束挂机</Checkbox>
                        </FormItem>

                        <FormItem
                          name={[field.name, 'transfer']}
                          label="动作"
                          style={{ width: '250px' }}
                        >
                          <Select placeholder="请选择动作" size="small">
                            {ACTION_LIST.map((item: any, index: number) => {
                              return (
                                <Option key={index} value={item.name} opt={item}>
                                  {item.label}
                                </Option>
                              );
                            })}
                          </Select>
                        </FormItem>
                      </Space>

                      <Condition r-if={showRule}>
                        <FormItem name={[field.name, 'rules']} label="规则配置">
                          <RuleSelect wishList={wishList} wordSlotList={wordSlotList}></RuleSelect>
                        </FormItem>
                      </Condition>
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
