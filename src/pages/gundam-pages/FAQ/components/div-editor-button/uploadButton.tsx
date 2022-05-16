import { IButtonMenu, IDomEditor } from '@wangeditor/core';
import { Boot } from '@wangeditor/editor';

class MyButtonMenu implements IButtonMenu {
  // 菜单配置，代码可参考“插入链接”菜单源码
  readonly title = '上传文件';
  readonly iconSvg =
    '<svg viewBox="64 64 896 896" focusable="false" data-icon="file-ppt" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M424 476c-4.4 0-8 3.6-8 8v276c0 4.4 3.6 8 8 8h32.5c4.4 0 8-3.6 8-8v-95.5h63.3c59.4 0 96.2-38.9 96.2-94.1 0-54.5-36.3-94.3-96-94.3H424zm150.6 94.3c0 43.4-26.5 54.3-71.2 54.3h-38.9V516.2h56.2c33.8 0 53.9 19.7 53.9 54.1zm280-281.7L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494z"></path></svg>';
  readonly tag = 'button';
  menuKey: string = '';

  constructor(type: any) {
    this.menuKey = type;
  }

  getValue(editor: IDomEditor): string | boolean {
    // 插入菜单，不需要 value
    return '';
  }

  isActive(editor: IDomEditor): boolean {
    // 任何时候，都不用激活 menu
    return false;
  }

  isDisabled(editor: IDomEditor): boolean {
    return false;
  }

  exec(editor: IDomEditor, value: string | boolean) {
    console.log('触发上传');
    console.log(this.menuKey);
    const obj: any = editor.getMenuConfig(this.menuKey);
    console.log(obj);
    obj?.onClick?.();
  }
}

export default MyButtonMenu;
