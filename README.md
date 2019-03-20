## Action

Action 是把数据从应用传到 store 的有效载荷。它是 store 数据的唯一来源。一般来说你会通过 store.dispatch() 将 action 传到 store。本质上是普通对象。

- action内必须使用一个字符串类型的`type`字段来表示将要执行的动作。
- `index`用来表示用户完成任务的动作序列号，由于数据存放在数组中，所以通过`index`来引用特定的任务。
- **要尽量减少在action中传递的数据**

### Action创建函数

Action创建函数就是生成action的方法，只是简单返回一个action。
```javascript
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```
Redux只需把action创建函数的结果传给`dispath()`方法即可发起一次dispatch过程。


## Reducer

Reducer指定了应用状态的变化如何响应actions并发送到store，action只描述了有事发生，并没有描述应用如何更新state。

reducer就是一个纯函数，接收旧的state和action，返回新的state。
```javascript
(previousState, action) => newState
```
**永远不要在reducer中做这些操作**：
- 修改传入参数
- 执行有副作用的操作，如API请求和路由跳转
- 调用非纯函数，如Date.now() 或 Math.random()

**只要传入参数相同，返回计算得到的下一个 state 就一定相同。没有特殊情况、没有副作用，没有 API 请求、没有变量修改，单纯执行计算。**

### reducer编写

```javascript
function todoApp(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}
```

1. **不要修改state**。 使用`Object.assign`新建了一个副本。必须把assign的第一个参数设置为空对象，这样才不会改变state的值。
2. **在default情况下返回旧的action**。在遇到未知的action时，一定要返回旧的`state`。

### reducer拆分
将没有相互依赖的字段更新的业务逻辑拆分成多个单独的子reducer，然后用主reducer调用子reducer来分别处理state从的一部分数据，再把这些数据合成一个大的单一对象。

**注意每个子 reducer 只负责管理全局 state 中它负责的一部分。每个 reducer 的 state 参数都不同，分别对应它管理的那部分 state 数据。**

Redux提供`combineReducers()`工具类来实现主reducer：
```javascript
import { combineReducers } from 'redux'

const todoApp = combineReducers({
  visibilityFilter,
  todos
})

export default todoApp
```
等价于
```javascript
export default function todoApp(state = {}, action) {
  return {
    visibilityFilter: visibilityFilter(state.visibilityFilter, action),
    todos: todos(state.todos, action)
  }
}
```

**combineReducers可以设置不同的key或者调用不同的函数：**
```javascript
const reducer = combineReducers({
  a: doSomethingWithA,
  b: processB,
  c: c
})
```
等价于
```javascript
function reducer(state = {}, action) {
  return {
    a: doSomethingWithA(state.a, action),
    b: processB(state.b, action),
    c: c(state.c, action)
  }
}
```

## Store

Store的职责：
- 维持应用的state
- 提供getState()方法获取state
- 提供dispatch(action)方法更新state
- 通过subscribe(listener)注册监听器
- 通过subscribe(listener)返回的函数注销监听器

创建store：
```javascript
import { createStore } from 'redux'
import todoApp from './reducers'
let store = createStore(todoApp)
```
发起action：`store.dispatch(addTodo('Learn about actions'))`

## 展示组件（Presentational）和容器组件（Container）
链接：https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0

|  | 展示组件 | 容器组件 |
| --- | --- | --- |
| 作用 | 描述如何展现（骨架、样式）| 描述如何运行（数据获取、状态更新） |
| 直接使用 Redux | 否 | 是 |
| 数据来源 | props | 监听 Redux state |
| 数据修改 | 从 props 调用回调函数 | 向 Redux 派发 actions |
| 调用方式 | 手动 | 通常由 React Redux 生成 |

- 展示组件只定义外观不关心数据来源和如何改变，传入什么就渲染什么。
- 容器组件将展示组件连接到Redux.
  * 技术上讲容器组件就是使用`store.subscribe()`从Redux state树中读取部分数据，并通过props来吧这些数据提供给要渲染的组件。建议使用React Redux的`connect()`方法来生成容器组件，可以避免很多不必要的重复渲染。
  * 容器组件还能分发action。

## connect
参考： http://taobaofed.org/blog/2016/08/18/react-redux-connect/

- 首先在最外层容器中，把所有内容包裹在 Provider 组件中，将之前创建的 store 作为 prop 传给 Provider。
```javascript
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

- Provider下只有connect过的组件才能使用state中的数据。
```javascript
class MyComp extends Component {
  // content...
}

const Comp = connect(...args)(MyComp);
```

connect() 接收四个参数，它们分别是 mapStateToProps，mapDispatchToProps，mergeProps和options。

- mapStateToProps(state, ownProps) : stateProps，函数将store中的数据作为props绑定到组件上。（只需要输出组件需要的属性）
- mapDispatchToProps(dispatch, ownProps): dispatchProps，将action作为props绑定到组件上。
- mergeProps将stateProps和dispatchProps与ownProps合并，不传的话默认使用Object.assign替代该方法。