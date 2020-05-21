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