import React, { useEffect, useMemo, useRef, useState } from 'react';

import Condition from '../Condition';
import pauseBt from './img/pause.svg';
import playBt from './img/play.svg';
import VoiceBt from './img/voice.svg';
import style from './style.less';

interface dataProp {
  children?: any;
  musicSrc?: string;
  'r-show'?: any;
}

function formate(time: any) {
  if (!time) {
    return '00:00';
  }
  time = parseInt(time as any as string);
  let second: any = time % 60;
  let min: any = parseInt((time / 60) as any as string);
  second = second < 10 ? '0' + second : second;
  min = min < 10 ? '0' + min : min;
  return min + ':' + second;
}

const AudioPlay: React.FC<dataProp> = (props) => {
  const { musicSrc } = props;
  // 状态类型   init / play / pause
  const [type, setType] = useState<string>('init');

  // 记录dom
  const audioRef = useRef<any>(null);
  const barRef = useRef<any>(null);

  // 全局记录
  const infoRef = useRef<any>({});
  // 记录位置
  const barPosRef = useRef<any>({});

  // 拖动标识 （以此判断是否处于拖动状态）
  const [dragFlag, setDragFlag] = useState<boolean>(false);

  // 播放时长
  const [curTime, setCurTime] = useState<number>(0);
  // 音频总时长
  const [totalTime, setTotalTime] = useState<number>(0);
  // 加载总时长
  const [loadTime, setLoadTime] = useState<number>(0);

  const [computedWidth, setComputedWidth] = useState<number>(0);

  // 播放百分比
  const curWidth = useMemo(() => {
    return ((curTime / totalTime) * 100).toFixed(6) + '%';
  }, [curTime, totalTime]);

  // 加载百分比
  const loadWidth = useMemo(() => {
    return ((loadTime / totalTime) * 100).toFixed(6) + '%';
  }, [loadTime, totalTime]);

  // 播放球进度百分比  （拖动时用）
  const ballWidth = useMemo(() => {
    return (computedWidth * 100).toFixed(6) + '%';
  }, [computedWidth]);

  // 播放 or 暂停
  const changeType = () => {
    const audio = audioRef.current;
    //
    if (type === 'init' || type === 'play') {
      setType('pause');
      audio.play();
    } else {
      setType('play');
      audio.pause();
    }
  };

  // 调整滚动条
  const touchTime = (e: any) => {
    // console.log(e.offsetX)
    // console.log(e.target.clientWidth)
    const info = infoRef.current;
    if (dragFlag) {
      return;
    }
    // console.log('touch')
    const audio = audioRef.current;
    const bar = barRef.current;

    const barPos = bar.getBoundingClientRect();
    let x = e.pageX - barPos.x;
    let w = bar?.clientWidth;
    // console.log(x, w, this.dragFlag)
    audio.currentTime = (x / w) * audio?.duration || 0;
  };

  // 进度条拖动相关 ----------------------------------------------------
  // 拖动进度滚动条
  const mousemove = (e: any) => {
    e.stopPropagation();
    const info = infoRef.current;
    if (!info.dragFlag) {
      return;
    }
    const barPos = barPosRef.current;
    let w = barPos.w;
    // 正常范围
    let left = e.pageX;
    let cw = 0;
    // 移动
    if (left <= barPos.maxW && left >= barPos.minW) {
      cw = (left - barPos.minW) / w;
    } else if (left < barPos.minW) {
      cw = 0;
    } else if (left > barPos.maxW) {
      cw = 1;
    }
    setComputedWidth(cw);
  };
  // 拖动进度滚动条抬起
  const mouseup = (e: any) => {
    e.stopPropagation();
    console.log('up');
    const info = infoRef.current;
    setTimeout(() => {
      setDragFlag(false);
      info.dragFlag = false;
    }, 200);
    const audio = audioRef.current;
    audio.currentTime = computedWidth * audio?.duration || 0;

    window.removeEventListener('mousemove', info.mousemove);
    window.removeEventListener('mouseup', info.mouseup);
  };

  const mousedown = (e: any) => {
    console.log('down', e.clientX);
    // 阻止点击时间
    // console.log(e.pageX)
    const bar = barRef.current;
    const barPos = bar.getBoundingClientRect(); // 457px
    barPos.w = bar.clientWidth;
    barPosRef.current = {
      ...barPos,
      maxW: barPos.x + bar.clientWidth,
      minW: barPos.x,
    };
    // console.log(this.barPos)
    setDragFlag(true); // 立刻变动这里下面事件接受不到
    const info = infoRef.current;
    info.dragFlag = true;
    info.mousemove = mousemove;
    info.mouseup = mouseup;
    // window.addEventListener('mousemove', info.mousemove, false);
    // window.addEventListener('mouseup', info.mouseup, false);
  };

  useEffect(() => {
    const info: any = infoRef.current;
    if (dragFlag) {
      info.mousemove = mousemove;
      info.mouseup = mouseup;
      window.addEventListener('mousemove', mousemove, false);
      window.addEventListener('mouseup', mouseup, false);
    }
    return () => {
      // console.log('卸载事件');
      window.removeEventListener('mousemove', info.mousemove);
      window.removeEventListener('mouseup', info.mouseup);
    };
  }, [dragFlag, computedWidth]);

  // 初始化 --------------------------------------------
  // 播放中更新显示时间
  const updateProgress = () => {
    const audio = audioRef.current;
    const bufferedObj = audio?.buffered;
    if (bufferedObj.length != 0) {
      const buffered = bufferedObj?.end?.(bufferedObj?.length - 1) || 0;

      setLoadTime(buffered);
      setCurTime(audio?.currentTime || 0);
      setTotalTime(audio?.duration || 0);
    }
  };
  // 播放停止
  const playEnd = () => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    setType('init');
  };

  useEffect(() => {
    const audio = audioRef.current;
    setTimeout(() => {
      setTotalTime(audio.duration);
    }, 200);
    // 进度条变动
    audio.addEventListener('timeupdate', updateProgress, false);
    // 播放结束
    audio.addEventListener('ended', playEnd, false);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', playEnd);
    };
  }, []);

  // 声音控制相关 ----------------------------------------
  const progressRef = useRef<any>(null);
  const progressPosRef = useRef<any>({});
  // 声音大小
  const [voice, setVoice] = useState<number>(1);
  // 调整音量的小窗口显示开关
  const [voiceBtFlag, setVoiceBtFlag] = useState<boolean>(false);
  // 音量拖动标识
  const [voiceDragFlag, setVoiceDragFlag] = useState<boolean>(false);
  // 音量拖动时的高度
  const [computedVoiceHeight, setComputedVoiceHeight] = useState<number>(1);

  // 球高度百分比 (写样式用)
  const voiceBallWidth = useMemo(() => {
    return (voice * 100).toFixed(6) + '%';
  }, [voice]);
  // 拖动时的高度百分比 (写样式用)
  const voiceComputedHeight = useMemo(() => {
    return (computedVoiceHeight * 100).toFixed(6) + '%';
  }, [computedVoiceHeight]);

  // 声音控制
  const changeVoiceFlag = (e: any) => {
    e.stopPropagation();
    // ------------------
    setVoiceBtFlag(!voiceBtFlag);
  };

  const touchVoiceBar = (e: any) => {
    const info = infoRef.current;
    // 拖动是不可以触发的
    if (voiceDragFlag) {
      return;
    }
    // console.log('touch')
    const audio = audioRef.current;
    const bar = progressRef.current;

    const barPos = bar.getBoundingClientRect();
    let x = e.pageY - barPos.top;
    let h = bar.clientHeight;
    // console.log(x, w, this.dragFlag)
    let cvh = 1;
    // 移动
    if (x > h) {
      return;
    } else {
      cvh = (h - x) / h;
      audio.volume = cvh;
    }
    setVoice(cvh);
    setComputedVoiceHeight(cvh);
  };

  // 监听  voiceDragFlag
  useEffect(() => {
    const click = (e: any) => {
      const p = progressRef.current;
      // 处于拖动状态
      if (e.path.includes(p) || voiceDragFlag) {
        //点击事件包含该元素
        return;
      } else {
        // 其他元素点击关闭
        setVoiceBtFlag(false);
      }
    };
    // 如果打开状态
    if (voiceBtFlag) {
      // 未打开调控开关
      window.addEventListener('click', click, false);
    }
    return () => {
      window.removeEventListener('click', click);
    };
  }, [voiceDragFlag, voiceBtFlag]);

  const voiceMousedown = (e: any) => {
    const progress = progressRef.current;
    // 阻止点击时间
    // console.log(e.pageX);
    const progressPos = progress.getBoundingClientRect(); // 457px
    progressPos.h = progress.clientHeight;
    progressPosRef.current = {
      ...progressPos,
      maxH: progressPos.top + progressPos.h,
      minH: progressPos.top,
    };
    // console.log(this.barPos)
    setVoiceDragFlag(true);
  };

  // 拖动声音进度滚动条
  const voiceMousemove = (e: any) => {
    const progressPos = progressPosRef.current;
    e.stopPropagation();
    if (!voiceDragFlag) {
      return;
    }
    let h = progressPos.h;
    // 正常范围
    let top = e.pageY;
    let cvh = 1;
    // 移动
    if (top <= progressPos.maxH && top >= progressPos.minH) {
      cvh = (h - (top - progressPos.minH)) / h;
    } else if (top < progressPos.minH) {
      cvh = 1;
    } else if (top > progressPos.maxH) {
      cvh = 0;
    }
    // console.log(cvh);
    setComputedVoiceHeight(cvh);
  };
  // 拖动进度滚动条抬起
  const voiceMouseup = (e: any) => {
    e.stopPropagation();
    console.log('up');
    setTimeout(() => {
      setVoiceDragFlag(false);
    }, 200);
    const audio = audioRef.current;
    audio.volume = computedVoiceHeight;
    setVoice(computedVoiceHeight);
    console.log('computedVoiceHeight:', computedVoiceHeight);
    const info: any = infoRef.current;
    window.removeEventListener('mousemove', info.voiceMousemove);
    window.removeEventListener('mouseup', info.voiceMouseup);
  };

  useEffect(() => {
    const info: any = infoRef.current;
    if (voiceDragFlag) {
      console.log('------------');
      info.voiceMousemove = voiceMousemove;
      info.voiceMouseup = voiceMouseup;
      window.addEventListener('mousemove', voiceMousemove, false);
      window.addEventListener('mouseup', voiceMouseup, false);
    }
    return () => {
      // console.log('卸载事件');
      window.removeEventListener('mousemove', info.voiceMousemove);
      window.removeEventListener('mouseup', info.voiceMouseup);
    };
  }, [voiceDragFlag, computedVoiceHeight]);

  return (
    <>
      <div className={style['music-box']}>
        <div className={style['button-box']} onClick={changeType}>
          <Condition r-if={type === 'play' || type === 'init'}>
            <img className={style['normal-bt']} src={playBt} alt="播放" />
          </Condition>
          <Condition r-if={type === 'pause'}>
            <img className={style['normal-bt']} src={pauseBt} alt="播放" />
          </Condition>
        </div>

        <div className={style['barbg']} ref={barRef} onClick={touchTime}>
          <div className={style['loadbar']} style={{ width: loadWidth }}></div>
          <div className={style['curbar']} style={{ width: dragFlag ? ballWidth : curWidth }}></div>

          <div
            className={style['curball']}
            style={{ left: dragFlag ? ballWidth : curWidth }}
            onMouseDown={mousedown}
          ></div>
        </div>

        <span className={style['time-span']}>
          {formate(curTime)} / {formate(totalTime)}
        </span>

        {/* 音量控制 */}
        <div className={style['voice-control']}>
          <img
            src={VoiceBt}
            alt="音量控制"
            className={style['normal-bt']}
            onClick={changeVoiceFlag}
          />
          <Condition r-if={voiceBtFlag}>
            <div className={style['voice-progress_bg']}>
              <div className={style['voice-progress']} ref={progressRef} onClick={touchVoiceBar}>
                <div
                  className={style['voicebar']}
                  style={{ height: voiceDragFlag ? voiceComputedHeight : voiceBallWidth }}
                ></div>

                <div
                  className={style['voiceball']}
                  style={{ bottom: voiceDragFlag ? voiceComputedHeight : voiceBallWidth }}
                  onMouseDown={voiceMousedown}
                ></div>
              </div>
            </div>
          </Condition>
        </div>

        <a className={style['downbt']} download href={musicSrc}></a>
      </div>
      <audio id="audio" src={musicSrc} controls ref={audioRef} className={style['hiden-audio']} />
    </>
  );
};

export default AudioPlay;
