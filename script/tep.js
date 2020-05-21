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