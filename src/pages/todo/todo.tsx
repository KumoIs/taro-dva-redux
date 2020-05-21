import Taro, { FC, useEffect, useState, useDidShow, useDidHide } from '@tarojs/taro';
import { View, Button, Image, Text, Input } from '@tarojs/components';

import './styled.less'
import remix from '../../../public/remix.png'

// redux
import { connect } from '@tarojs/redux';
import { todoActions } from './model';

// 启动环境
const evn = process.env.TARO_ENV

interface OwnProps{}

type Props = OwnProps

const Todo: FC<Props> = props => {
  
  const {
    todo: { list },
    addTodo,
    delTodo,
  } = props;
  console.log(list);
  
  // state Todo
  // const [list, setList] = useState(["测试用例1"]);
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
