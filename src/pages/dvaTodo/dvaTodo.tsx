import Taro, { FC, useEffect, useState } from '@tarojs/taro';
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

