const todos = (state = [], action) => {
  console.log("reduce---todos")
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state, //解构原先的state
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
    case 'TOGGLE_TODO':
      return state.map(todo =>
        (todo.id === action.id) 
          ? {...todo, completed: !todo.completed}
          : todo
      )
    default:
      return state
  }
}

export default todos