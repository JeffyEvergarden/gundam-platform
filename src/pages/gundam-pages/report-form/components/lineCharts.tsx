import { useState, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import * as echarts from 'echarts';
import styles from './index.less';

const LineChartPage: React.FC<any> = (props: any) => {
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

  base = isNaN(base) ? 1 : base;

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

  // 生成图表数据
  const initChart = () => {
    let temp: any = [];
    data?.map((item: any) => {
      if (item.isRate) {
        temp.push({
          name: item.name,
          data: item.val,
          type: 'line',
          yAxisIndex: 1,
          z: 5,
          showSymbol: false,
          lineStyle: {
            width: 2 * base,
          },
          emphasis: {
            focus: 'series',
          },
          label: {
            fontSize: 12 * base,
          },
          labelLayout: {
            moveOverlap: 'shiftY',
          },
        });
      } else {
        temp.push({
          name: item.name,
          data: item.val,
          type: 'line',
          yAxisIndex: 0,
          z: 5,
          showSymbol: false,
          lineStyle: {
            width: 2 * base,
          },
          emphasis: {
            focus: 'series',
          },
          label: {
            fontSize: 12 * base,
          },
          labelLayout: {
            moveOverlap: 'shiftY',
          },
        });
      }
    });
    const options: any = initOptions(columns, temp);
    lineChart?.current?.setOption(options);
  };

  const initOptions = (columns: any[], data: any[]) => {
    return Object.assign(
      {},
      {
        color: color,
        textStyle: {
          fontFamily: 'PingFang SC, sans-serif, Microsoft YaHei, SimHei',
        },
        title: {
          show: title ? true : false,
          top: 0,
          left: 0,
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
          left: 300 * base,
          data: legendData,
          textStyle: {
            fontSize: 12 * base,
            lineHeight: 16 * base,
          },
        },
        grid: [
          {
            top: 50 * base,
            left: 45 * base,
            right: 50 * base,
            bottom: 60 * base,
          },
          {
            height: 20 * base,
            bottom: 0 * base,
          },
        ],
        tooltip: {
          trigger: 'axis',
          formatter: formateTooltip,
          position: getTooltipsPosition,
        },
        xAxis: {
          type: 'category',
          data: columns,
          // boundaryGap: false,
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: '#e9e9e9',
            },
          },
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.65)',
            // showMaxLabel: true,
          },
        },
        yAxis: [
          {
            name: ``,
            type: 'value',
            // max: max2,
            splitNumber: 6,
            nameTextStyle: {
              fontSize: 12 * base,
              padding: [0, 12 * base, 0, 0],
            },
            splitLine: {
              show: true,
            },
            axisLabel: {
              formatter: (val: any) => {
                return val;
              },
            },
          },
          {
            name: ``,
            type: 'value',
            max: 1,
            splitNumber: 6,
            nameTextStyle: {
              fontSize: 12 * base,
              padding: [0, 0, 0, 8 * base],
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: 'rgba(0,0,0,0.07)',
              },
            },
            axisLabel: {
              formatter: (val: any) => {
                if (id === 'visitorNumber') {
                  return null;
                } else {
                  return val * 100 + '%';
                }
              },
            },
          },
        ],
        series: data,
      },
    );
  };

  const formateTooltip = (params: any) => {
    const arr = params || [];
    // console.log(arr[0])
    const titleStr = arr?.[0]?.name || '';
    let arrStr = '';
    arr.forEach((item: any, index: number) => {
      let label = item.seriesName;
      let value;
      let percentName = ['明确回答率', '匹配率', '澄清确认率', '推荐确认率'];
      if (percentName.includes(item.seriesName)) {
        debugger;
        if (item.value == 0) {
          value = '0.00%';
        } else {
          value = item.value * 100 + '%';
        }
      } else {
        value = item.value;
      }
      arrStr += `
      <div class='${styles['tooltips-item']}'>
        <div class="${styles.icon}" style="background: ${item.color}"></div>
        <div class="${styles.label}">${label}</div>
        <div class="${styles.value}">${value}</div>
      </div>`;
    });
    return `
      <div class='${styles['tooltips-box']}'>
        <div class='${styles['tooltips-item']}'>
          ${titleStr}
        </div>
        ${arrStr}
      </div>
    `;
  };

  const getTooltipsPosition = (pos: any, params: any, dom: any, rect: any, size: any) => {
    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
    const [x, y] = pos;
    const [cx, cy] = size.contentSize;
    let xz = x < size.viewSize[0] / 2 ? 10 : -10 - cx;
    let yz = y < size.viewSize[1] / 2 ? 10 : -10 - cy;
    return {
      top: y + yz,
      left: x + xz,
    };
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

export default LineChartPage;
