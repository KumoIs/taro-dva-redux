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