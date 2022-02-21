class EventBus {
  _eventMap: {
    [key: string]: any[];
  };
  constructor() {
    this._eventMap = {};
  }
  $on(str: string, cb: (...args: any[]) => void, ctx?: any) {
    if (!str) {
      return;
    }
    if (this._eventMap[str]) {
      this._eventMap[str].push(cb);
    } else {
      this._eventMap[str] = [cb];
    }
  }
  $emit(str: string, ...args: any[]) {
    if (this._eventMap[str]) {
      this._eventMap[str].forEach((cb) => {
        cb(...args);
      });
    } else {
      // console.log(`当前事件名：${str}暂无事件存储`);
    }
  }
  $off(str: string, cb: (...args: any[]) => void) {
    let events = this._eventMap[str];
    if (Array.isArray(events)) {
      for (let i = 0, l = events.length; i < l; i++) {
        if (events[i] === cb) {
          events.splice(i, 1);
          this._eventMap[str] = events;
          break;
        }
      }
    }
  }
}

export default new EventBus();
