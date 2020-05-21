#  *

本人才开始学习 taro，以下为个人笔记，目前的话只在 h5 测试过，如果其他出现问题啧可能需要自己采坑了，如果其他有平台有问题也希望issue给我。本小白也可以相互学习，谢谢😀😀😀

> 需要注意的是 本人 虽然使用的是 TS 但是因为偷懒并未做太多 interface 描述, 如果看客也是在学 TS 的话后期可以自己补上描述

# Rudex 配置

1. 安装 redux

   ```typescript
   // 个人喜好 yarn
   // @tarojs/redux-h5 兼容 h5
   yarn add redux @tarojs/redux @tarojs/redux-h5 redux-logger redux-thunk
   ```

2. 配置 文件

   - 创建以下目录 modules 暂且可以不用去管 ( 全局的 store 本列不会用到)![image-20200521151703496](public\reduxStore.png)

   - /store/index

     ```typescript
     import { createStore, applyMiddleware } from 'redux'
     
     // 引入中间件
     import thunkMiddleware from 'redux-thunk'
     import { createLogger } from 'redux-logger'
     
     // 引入根reduces
     import rootReduces from './rootReduces'
     
     const middlewares = [
       thunkMiddleware,
       createLogger()
     ]
     
     export default function configStore() {
       return createStore(rootReduces, applyMiddleware(...middlewares))
     }
     ```

   - /store/rootReduces

     ```typescript
     import { combineReducers } from 'redux'
     
     // reduces
     // import global from './modules/global.reducer' (modules 中的文件)
     
     // 
     import todo from '../pages/todo/module'
     
     export default combineReducers({
       todo
     })
     ```

   - 以上便是 redux 的配置 之后需要去 App 中引入准备使用

     ```tsx
     import Taro, { Component, Config } from '@tarojs/taro'
     import Index from './pages/index'
     
     import './app.less'
     
     // redux
     import { Provider } from '@tarojs/redux'
     import configStore from './store'
     
     // redux store
     const store = configStore()
     
     // 如果需要在 h5 环境中开启 React Devtools
     // 取消以下注释：
     // if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
     //   require('nerv-devtools')
     // }
     
     class App extends Component {
     
       componentDidMount () {}
     
       componentDidShow () {}
     
       componentDidHide () {}
     
       componentDidCatchError () {}
     
       /**
        * 指定config的类型声明为: Taro.Config
        *
        * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
        * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
        * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
        */
       config: Config = {
         pages: [
           'pages/index/index',
           'pages/todo/todo',
         ],
         window: {
           backgroundTextStyle: 'light',
           navigationBarBackgroundColor: '#fff',
           navigationBarTitleText: 'WeChat',
           navigationBarTextStyle: 'black'
         }
       }
     
       // 在 App 类中的 render() 函数没有实际作用
       // 请勿修改此函数
       render () {
         return (
           <Provider store={ store }>
             <Index />
           </Provider>
           
         )
       }
     }
     
     Taro.render(<App />, document.getElementById('app'))
     ```

   - 自此redux基本就配置完了。开始完成 todolist  业务代码

3. TodoList 业务代码

   - 首先开始先创建文件![image-20200521153802754](public\reduxStore.png)

   - todo/todo.tsx

     ```tsx
     import Taro, { FC, useEffect, useState, useDidShow, useDidHide } from '@tarojs/taro';
     import { View, Button, Image, Text, Input } from '@tarojs/components';
     
     import './styled.less'
     import remix from '../../../public/remix.png'
     
     // redux
     import { connect } from '@tarojs/redux';
     import { todoActions } from './model';
     
     // 查看启动的环境
     const evn = process.env.TARO_ENV
     
     const Todo: FC = props => {
       
       const {
         todo: { list },
         addTodo,
         delTodo,
       } = props;
       console.log(list);
       
       const [value, setValue] = useState("")
     
       useEffect(() => {
         console.log(evn);
         
         console.log("Home 首次记载", props);
         
         return () => {
           console.log("Home 退出页面", props);
         }
       }, [])
     
       useDidShow(() => {
         console.log('Home Components ComponentDidShow', props)
       })
     
       useDidHide(() => {
         console.log('Home Components componentDidHide', props)
       })
     
       
       return (
         <View>
           Home Component
           <Image className='img' src={remix} />
           <Text>可以自动聚焦的 input</Text>
           <Input
             type='text'
             placeholder='将会获取焦点'
             focus={true}
             value = {value}
             onInput={(e) => {
               setValue(e.detail.value)
             }}
           />
           <View>
             {
               list.map(t => {
                 return (
                   <View style={{ display: "flex", justifyContent: "space-between" }}>
                     <Text style={{ flex: 3, alignItems: "center" }} >{t.id}: {t.text}</Text>
                     <Button 
                       style={{ background: "red", borderRadius: "2px", flex: 1 }}
                       onClick={() => {
                         delTodo(t.id)
                       }}
                     >
                       删除
                     </Button>
                   </View>
                 )
               })
             }
           </View>
           <Button onClick={() => addTodo(value)}>添加</Button>
           <Button
             onClick={() => {
               Taro.navigateTo({ url: '/pages/index/index?name=栗子' })
             }}
           >
             跳转
           </Button>
         </View>
       );
     };
     
     Todo.config = {
       navigationBarTitleText: '测试',
     }
     
     const mapStateToProps = ({ todo }) => ({
       todo,
     })
     
     const mapDispatchToProps = dispatch => ({
       addTodo(data) {
         dispatch(todoActions.add(data))
       },
       delTodo(id) {
         dispatch(todoActions.delete(id))
       }
     })
     
     export default connect(mapStateToProps, mapDispatchToProps)(Todo);
     
     ```

   - todo/model.ts

     ```typescript
     export const types = {
       ADD: 'TODO/ADD',
       DELETE: 'TODO/DELETE',
     }
     
     const INITIAL_STATE = {
       list: [{ id: 0, text: 'this first todo.'}]
     };
     
     function todo(state = INITIAL_STATE, action) {
       console.log(state);
       
       let listNum = state.list.length;
       
       state.list.forEach(item => {
         if (item.id === listNum) {
           listNum++;
         }
       })
     
       switch(action.type) {
         case types.ADD:
           return {
             ...state,
             list: [
               ...state.list,
               {
                 id: listNum,
                 text: action.data
               }
             ]
           };
         case types.DELETE:
           return {
             ...state,
             list: [...state.list.filter(item => item.id !== action.id)]
           }
         default:
           return state;
       }
     }
     
     export default todo;
     
     
     export const todoActions = {
       add: data => ({
         type: types.ADD,
         data,
       }),
     
       delete: id => ({
         type: types.DELETE,
         id
       })
     }
     ```

   - 到此一个简单 taro + redux   todoList 就完成了。



# DVA 配置

1. 首先依然是安装 dva，当然在此之前是需要 安装 redux 安装上面的安装即可，不在概述这里就直接安装 dva

   ```js
   yarn add dva-core dva-loading
   ```

2. 配置文件

   - 本人是直接在 src 下创建的 dva.ts 看个人

     ```typescript
     import {create} from 'dva-core';
     import {createLogger} from 'redux-logger';
     import createLoading from 'dva-loading';
     
     let app;
     let store;
     let dispatch;
     
     function createApp(opt) {
       opt.onAction = [createLogger()];
       app = create(opt);
       app.use(createLoading({}));
     
       if (!global.registered) opt.models.forEach(model => app.model(model));
       global.registered = true;
       app.start();
     
       store = app._store;
       app.getStore = () => store;
     
       dispatch = store.dispatch;
     
       app.dispatch = dispatch;
       return app;
     }
     
     export default {
       createApp,
       getDispatch() {
         return app.dispatch;
       }
     }
     ```

   - src 下创建 models 文件夹 创建 index.ts, 这里的话如果需要安装其他像是 global全局 也在此创建

     ```typescript
     import todo from '../pages/dvaTodo/model'
     
     export default [ todo ]
     ```

   - 以上简单的 dva 配置完成，同样需要在 App 中引入使用

     ```tsx
     import Taro, { Component, Config } from '@tarojs/taro'
     import Index from './pages/index'
     
     import './app.less'
     
     // dva
     import { Provider } from '@tarojs/redux'
     import dvaCollection from './models'
     import dva from './dva';
     
     
     // dva store
     const davApp = dva.createApp({
       initialState: {},
       models: dvaCollection,
     })
     const store = davApp.getStore();
     
     // 如果需要在 h5 环境中开启 React Devtools
     // 取消以下注释：
     // if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
     //   require('nerv-devtools')
     // }
     
     class App extends Component {
     
       componentDidMount () {}
     
       componentDidShow () {}
     
       componentDidHide () {}
     
       componentDidCatchError () {}
     
       /**
        * 指定config的类型声明为: Taro.Config
        *
        * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
        * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
        * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
        */
       config: Config = {
         pages: [
           'pages/index/index',
           'pages/todo/todo',
           'pages/dvaTodo/dvaTodo'
         ],
         window: {
           backgroundTextStyle: 'light',
           navigationBarBackgroundColor: '#fff',
           navigationBarTitleText: 'WeChat',
           navigationBarTextStyle: 'black'
         }
       }
     
       // 在 App 类中的 render() 函数没有实际作用
       // 请勿修改此函数
       render () {
         return (
           <Provider store={ store }>
             <Index />
           </Provider>
           
         )
       }
     }
     
     Taro.render(<App />, document.getElementById('app'))
     ```

   - 那么 dva 也配置完成。后面也是以 todoList 为列子的业务代码

3. 在写业务代码之前 我们可以通过 node 来创建模本文件。（加快开发效率， 摸更多的鱼)

   - 指令代码 我是放在 script/tep

     ```typescript
     /**
      * pages模版快速生成脚本,执行命令 npm run tep `文件名`
      */
     
     const fs = require('fs');
     
     const dirName = process.argv[2];
     
     if (!dirName) {
       console.log('文件夹名称不能为空！');
       console.log('示例：npm run tep test');
       process.exit(0);
     }
     
     // 页面模版
     const indexTep = `import Taro, { FC } from '@tarojs/taro';
     import { View } from '@tarojs/components';
     import { connect } from '@tarojs/redux';
     import './styled.less';
     
     const ${titleCase(dirName)}: FC = () => {
       return (
         <View className="${dirName}-page">
           ${dirName}
         </View>
       )
     }
     
     ${titleCase(dirName)}.config = {
       navigationBarTitleText: '${dirName}',
     }
     
     // const mapStateToProps = ({}) => ({
     //
     // });
     
     // const mapDispatchToProps = dispatch => ({
     //  
     // })
     
     // export default connect(mapStateToProps, mapDispatchToProps)(${titleCase(dirName)})
     export default ${titleCase(dirName)}
     `;
     
     // styled模板
     const styledTep = ``;
     
     // model文件模版
     const modelTep = `import * as ${dirName}Api from './service';
     
     export default {
       namespace: '${dirName}',
       state: {
     
       },
     
       effects: {
         //  * fetch_({ payload, callback }, { call, put }) {
         //    const { status, data } = yield call(${dirName}Api.demo, {});
         //    try {
         //      if (status) {
         //        yield put({
         //          type: _,
         //          payload: _,
         //        })
         //        callback && (yield put(callback, data))
         //      } else {
         //        // 弹窗提示错误
         //      }
         //    } catch(err) {
         //      throw err
         //    }
         //  },
       },
     
       reducers: {
         //  _(state, { payload }) {
         //    return { ...state, ...payload };
         //  },
       },
     
     };
     `;
     
     // service页面模版
     const serviceTep = `import Request from '../../utils/request';
     
     export const demo = (data) => {
       return Request({
         url: '路径',
         method: 'POST',
         data,
       });
     };
     `;
     
     
     
     fs.mkdirSync(`./src/pages/${titleCase(dirName)}`); // mkdir $1
     process.chdir(`./src/pages/${titleCase(dirName)}`); // cd $1
     
     fs.writeFileSync(`${dirName}.tsx`, indexTep);
     fs.writeFileSync('styled.less', styledTep);
     fs.writeFileSync('model.ts', modelTep);
     fs.writeFileSync('service.ts', serviceTep);
     
     // 首字母大写
     function titleCase(str) {
       const array = str.toLowerCase().split(' ');
       for (let i = 0; i < array.length; i++) {
         array[i] = array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
       }
       const string = array.join(' ');
       return string;
     }
     
     process.exit(0);
     ```

   - 指令代码完成还需要在 package 中简单的配置一下

     ```javascript
     // 在 script 中添加指令 yarn tep  来启动
     "scripts": { 
     	"tep": "node ./script/tep"
     }
     ```

   - 当使用 yarn / npm 启动以后会发现page中生成了一下文件![image-20200521155908009](public\devPage.png)

   - 需要注意的是 因为没有用到 API 所以 service 是直接删掉就好 以免报错

4. TodoList 业务逻辑

   - src/pages/dvaTodo/dvaTodo.tsc

     ```tsx
     import Taro, { FC, useState } from '@tarojs/taro';
     import { View, Button, Input, Image, Text } from '@tarojs/components';
     
     import './styled.less'
     import remix from '../../../public/remix.png'
     
     // dva
     import { connect } from '@tarojs/redux';
     import { todoActions } from './model'
     
     const DvaTodo: FC = props => {
           
       const {
         todo: { list },
         addTodo,
         delTodo,
       } = props;
       console.log(props);
       
       const [value, setValue] = useState("")
     
       return (
         <View>
           Home Component
           <Image className='img' src={remix} />
           <Text>可以自动聚焦的 input</Text>
           <Input
             type='text'
             placeholder='将会获取焦点'
             focus={true}
             value = {value}
             onInput={(e) => {
               setValue(e.detail.value)
             }}
           />
           <View>
             {
               list.map(t => {
                 return (
                   <View style={{ display: "flex", justifyContent: "space-between" }}>
                     <Text style={{ flex: 3, alignItems: "center" }} >{t.id}: {t.text}</Text>
                     <Button 
                       style={{ background: "red", borderRadius: "2px", flex: 1 }}
                       onClick={() => {
                         delTodo(t.id)
                       }}
                     >
                       删除
                     </Button>
                   </View>
                 )
               })
             }
           </View>
           <Button onClick={() => addTodo(value)}>添加</Button>
           <Button
             onClick={() => {
               Taro.navigateTo({ url: '/pages/index/index?name=栗子' })
             }}
           >
             跳转
           </Button>
         </View>
       );
     }
     
     DvaTodo.config = {
       navigationBarTitleText: 'devTodo',
     }
     
     const mapStateToProps = ({ todo }) => ({
       todo
     });
     
     const mapDispatchToProps = dispatch => ({
       addTodo(payload) {
         dispatch(todoActions.add(payload))
       },
       delTodo(payload) {
         dispatch(todoActions.del(payload))
       }
     })
     
     export default connect(mapStateToProps, mapDispatchToProps)(DvaTodo)
     ```

   - src/dvaTodo/dvaTodo

     ```typescript
     // import * as devTodoApi from './service';
     
     const todo = {
       namespace: 'todo',
       state: {
         list: [{ id: 1, text: 'this first todo.'}]
       },
     
       effects: {
         * add({ payload }, { call, put, select }) {
           const list = yield select(p => p.todo.list);
           let listNum = list.length;
           list.forEach(i => {
             if (listNum === i.id) {
               ++listNum
             }
           })
           list.push({
             id: listNum,
             text: payload
           })
           try {
             if (list.length <= 5) {
               yield put({
                 type: 'save',
                 payload: list,
               })
             }
           } catch(err) {
             throw err
           }
         },
         *del({ payload }, { call, put, select }) {
           const list = yield select(p => p.todo.list);
           try {
             if (list.length) {
               yield put({
                 type: 'save',
                 payload: list.filter(i => i.id !== payload),
               })
             }
           } catch(err) {
             throw err
           }
         }
       },
     
       reducers: {
         save(state, { payload }) { 
           console.log(payload);
           
           return {
             ...state, 
             list: payload,
           };
         },
       },
     
     };
     
     export default todo;
     
     const type = type => `${todo.namespace}/${type}`;
     
     export const todoActions = {
       add: payload => ({
         type: type('add'),
         payload,
       }),
     
       del: payload => ({
         type: type('del'),
         payload
       })
     }
     ```

   - OK 那么 dva 的 todoList 也到此完成。

