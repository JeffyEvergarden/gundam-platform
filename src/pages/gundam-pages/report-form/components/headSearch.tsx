import { Button, DatePicker, Radio, Select, Space } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import styles from './index.less';
import { CHANNAL_LIST } from '../../FAQ/const';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default (props: any) => {
  const { choseTime, exportReportForm, exportSessionList, pageType } = props;

  const [valRadio, setValue] = useState<string>('sevenDays');
  const [startTime, setStart] = useState<string>('');
  const [endTime, setEnd] = useState<string>('');
  const [keyValue, setKeyValue] = useState<any>(''); //给rangePicker控件添加key属性，点击重置时，修改key的值，如new Date()，相当于重新渲染控件，达到让控件重置的功能
  const [code, setCode] = useState('');

  const changeTime = (e: any) => {
    let val = e.target.value;
    setValue(val);
    let begin = '';
    let end = '';
    let yestody = moment().subtract(1, 'days');
    end = yestody.format('YYYY-MM-DD');
    if (val === 'yestoday') {
      let yestody = moment().subtract(1, 'days');
      begin = yestody.format('YYYY-MM-DD');
    }
    if (val === 'today') {
      let today = moment().subtract(0, 'days');
      begin = today.format('YYYY-MM-DD');
      end = today.format('YYYY-MM-DD');
    }
    if (val === 'sevenDays') {
      let sevenDays = moment().subtract(6, 'days');
      begin = sevenDays.format('YYYY-MM-DD');
      let today = moment().subtract(0, 'days');
      end = today.format('YYYY-MM-DD');
    }
    if (val === 'month') {
      let month = moment().subtract(29, 'days');
      begin = month.format('YYYY-MM-DD');
      let today = moment().subtract(0, 'days');
      end = today.format('YYYY-MM-DD');
    }
    setStart(begin);
    setEnd(end);
    setKeyValue(new Date());
    choseTime(begin, end, code);
  };

  const rangeChange = (val: any) => {
    if (val && val.length) {
      let start = val[0].format('YYYY-MM-DD');
      let end = val[1].format('YYYY-MM-DD');
      setStart(start);
      setEnd(end);
      choseTime(start, end, code);
      setValue('');
    } else {
      setValue('sevenDays');
      choseTime('', '', code);
    }
  };

  const changeWay = (val: any) => {
    setCode(val);
    choseTime(startTime, endTime, val);
  };

  const exportForm = () => {
    exportReportForm(startTime, endTime, code);
  };

  const disabledDate = (current: any) => {
    return current && current > moment().subtract(0, 'days').endOf('day');
  };

  return (
    <div className={styles.headSearch}>
      <Space>
        <Radio.Group value={valRadio} onChange={changeTime}>
          <Radio.Button value="yestoday">昨天</Radio.Button>
          <Radio.Button value="today">今天</Radio.Button>
          <Radio.Button value="sevenDays">最近七天</Radio.Button>
          <Radio.Button value="month">最近一个月</Radio.Button>
        </Radio.Group>
        <RangePicker
          onChange={rangeChange}
          format={'YYYY-MM-DD'}
          disabledDate={disabledDate}
          key={keyValue}
        />
        <Select style={{ width: '120px' }} defaultValue="" onChange={changeWay}>
          <Option key={''} value="">
            全部渠道
          </Option>
          {CHANNAL_LIST.map((item: any) => {
            return (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            );
          })}
        </Select>
      </Space>
      <Space>
        <Button type="primary" onClick={exportForm}>
          导出报表
        </Button>
        {pageType === 'visitorSession' && (
          <Button type="primary" onClick={exportSessionList}>
            导出会话明细
          </Button>
        )}
      </Space>
    </div>
  );
};
