# Guider 操作指引

通过设置一系列步骤，引导用户点击特定区域，让用户了解某一功能特性。

## 安装

通过包管理工具(npm/yarn)安装：

```shell
npm install -S guider.js
```

## 使用

### 初始化

```javascript
import Guider from 'guider';

const guider = new Guider({
  // 高亮框的内边距
  padding: 5,
  // 限制鼠标事件在特定的区域触发，默认仅触发高亮区域的鼠标事件
  restrictInScope: (target, event) => {},
  // 进入下一步之前的回调，返回 false 可以阻止进入下一步
  beforeNext: (currentStepIndex, nextStepIndex) => {},
  // 返回上一步之前的回调，返回 false 可以阻止返回上一步
  beforePrev: (currentStepIndex, nextStepIndex) => {},
  // 跳转步骤之前的回调，返回 false 可以阻止跳转
  beforeJump: (currentStepIndex, nextStepIndex) => {},
  // 跳转步骤之后的回调
  afterJump: (currentStepIndex, nextStepIndex) => {},
});
```

### 设置步骤

```javascript
guider.setSteps([
  {
    // 高亮目标的选择器，只能选中唯一目标
    element: '#demo',
    // 是否显示阴影遮罩
    mask: true,
    // 是否可以通过点击操作触发进入下一步
    trigger: true,
    // 是否显示气泡提示
    tooltip: true,
  },
  {
    element: '#demo',
    mask: true,
    // 可以传入一个字符串来指定触发进入下一步的鼠标事件，默认为 'click'
    trigger: 'mouseover',
    // 可以传入一个对象来指定提示气泡的标题和描述
    tooltip: {
      title: 'Second Step',
      description: 'This is the description of the second step.',
    },
  },
  // 可以传入一个数组来同时高亮多个区域
  [
    {
      element: '#demo',
      mask: true,
      trigger: false,
      // 仅传入字符串作为 tooltip 选项时将默认用作为描述
      tooltip: 'You can highlight multiple area.',
    },
    {
      element: '#demo',
      mask: false,
      trigger: true,
      tooltip: false,
    }
  ]
]);
```

### 启动

```typescript
// 启动指引，默认从头开始，可以传入步骤序号以指定从特定步骤开始
guider.start(startIndex?: number): void;
```

### 控制

```typescript
// 进入下一步
guider.goNextStep(): Promise<void>;
// 返回上一步
guider.goPrevStep(): Promise<void>;
// 跳转到步骤
guider.jumpStep(stepIndex: number): Promise<void>;
// 重置实例，将清除所有设置和状态
guider.reset(): void;
```

### 销毁

```typescript
// 销毁实例
guider.destroy(): void;
```

## 注意事项

使用完毕之后请务必 **销毁实例** 以移除所有的事件监听器，释放变量引用，避免可能的内存泄漏问题。

## 兼容性

使用了如下 API 可能需要 polyfill 支持：

- MutationObserver

## i18n & translation

If you want i18n supporting or the translation of readme, please file an issue.

For whom is willing to do the translation, I will appreciate it if you could give me the pr.

## Reference

- [driver.js](https://github.com/kamranahmedse/driver.js)

## LICENSE

MIT
