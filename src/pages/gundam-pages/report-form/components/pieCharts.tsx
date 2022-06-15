import { useState, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import * as echarts from 'echarts';
import styles from './index.less';

const PieCharts: React.FC<any> = (props: any) => {
  let {
    base = 1,
    id,
    data = [],
    loading = false,
    className,
    title,
    color,
    legendData,
    columns,
  } = props;

  let first = false;

  const lineChart = useRef<any>(null);

  useEffect(() => {
    const chartDom = document.getElementById(`linebox-${id}`);
    lineChart.current = echarts.init(chartDom as any);
    initChart();
    first = true;
  }, []);

  useEffect(() => {
    if (!first) {
      initChart();
      lineChart.current?.resize?.();
    }
  }, [base, data]);

  const initChart = () => {
    const options: any = initOptions(data);
    lineChart.current.setOption(options);
  };

  const initOptions = (data: any) => {
    return Object.assign(
      {},
      {
        color: color,
        textStyle: {
          fontFamily: 'PingFang SC, sans-serif, Microsoft YaHei, SimHei',
        },
        title: {
          show: true,
          top: 0,
          left: 48 * base,
          text: title,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.85)',
            fontSize: 16 * base,
            lineHeight: 16,
            fontWeight: '400',
          },
        },
        legend: {
          bottom: -5 * base,
          left: 58 * base,
          data: legendData,
          icon: 'circle',
          textStyle: {
            fontSize: 12 * base,
            lineHeight: 16 * base,
          },
        },
        grid: {
          top: '5%',
          left: '5%',
          bottom: '5%',
          right: '5%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'item',
          formatter: formateTooltip,
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['55%', '70%'],
            avoidLabelOverlap: false,
            center: ['50%', '50%'],
            label: {
              show: true,
              position: 'center',
              fontSize: '24',
              formatter: ['回答总数', `${999}`].join('\n'),
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      },
    );
  };
  const formateTooltip = (params: any) => {
    return `
    <div class='${styles['tooltips-box_pie']}'>
      <div class="${styles.icon}" style="background: ${params.color}"></div>
      <div class="${styles.val}">${params.name}</div>
      <div class="${styles.val}">${params.value}</div>
      <div class="${styles.val}">${params.percent + '%'}</div>
    </div>

    `;
  };

  return (
    <div className={styles.linebox}>
      <Spin spinning={loading}>
        <div
          id={`linebox-${id}`}
          style={{ height: `${378 * base}px`, width: '100%' }}
          className={styles['line-box']}
        />
      </Spin>
    </div>
  );
};

export default PieCharts;
