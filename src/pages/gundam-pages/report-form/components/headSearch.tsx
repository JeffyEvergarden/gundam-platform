import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Radio, DatePicker, Space, Select, Button } from 'antd';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default (props: any) => {
  const { choseTime, exportReportForm, pageType } = props;

  const [valRadio, setValue] = useState<string>('sevenDays');
  const [startTime, setStart] = useState<string>('');
  const [endTime, setEnd] = useState<string>('');
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
      let sevenDays = moment().subtract(7, 'days');
      begin = sevenDays.format('YYYY-MM-DD');
    }
    if (val === 'month') {
      let month = moment().subtract(30, 'days');
      begin = month.format('YYYY-MM-DD');
    }
    setStart(begin);
    setEnd(end);
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
          {pageType === 'visitorSession' && <Radio.Button value="today">今天</Radio.Button>}
          <Radio.Button value="sevenDays">最近七天</Radio.Button>
          <Radio.Button value="month">最近一个月</Radio.Button>
        </Radio.Group>
        <RangePicker onChange={rangeChange} format={'YYYY-MM-DD'} disabledDate={disabledDate} />
        <Select style={{ width: '120px' }} defaultValue="" onChange={changeWay}>
          <Option key={''} value="">
            全部渠道
          </Option>
          <Option key={'media_wx'} value="media_wx">
            微信
          </Option>
          <Option key={'media_zyqb'} value="media_zyqb">
            中邮钱包
          </Option>
          <Option key={'media_zfb'} value="media_zfb">
            支付宝
          </Option>
          <Option key={'media_jtyw'} value="media_jtyw">
            集团邮务
          </Option>
          <Option key={'media_gw'} value="media_gw">
            中邮官网
          </Option>
          <Option key={'media_ycsjyh'} value="media_ycsjyh">
            邮储手机银行
          </Option>
        </Select>
      </Space>
      <Button type="primary" onClick={exportForm}>
        导出报表
      </Button>
    </div>
  );
};
