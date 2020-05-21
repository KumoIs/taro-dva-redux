import Taro, { useEffect, useDidShow, useDidHide } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.less'

const Index: Taro.FC = props => {

  useEffect(() => {
    console.log("Index 首次记载", props);
    
    return () => {
      console.log("Index 退出页面", props);
    }
  }, [])

  useDidShow(() => {
    console.log('Index Components ComponentDidShow', props)
  })

  useDidHide(() => {
    console.log('Index Components componentDidHide', props)
  })

  return (
    <View className='index'>
      <Text>Index Component</Text>
      <Button
        onClick={() => {
          Taro.navigateTo({ url: '/pages/todo/todo?name=张三' })
        }}
      >
        to Redux Todo
      </Button>
      <Button
        onClick={() => {
          Taro.navigateTo({ url: '/pages/dvaTodo/dvaTodo' })
        }}
      >
        to dva Todo
      </Button>
    </View>
  )
}

Index.config = {
  navigationBarTitleText: '首页',
}

export default Index;