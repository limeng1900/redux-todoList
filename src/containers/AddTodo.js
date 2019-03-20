import React from 'react'
import { connect } from 'react-redux'
import { addTodo } from '../actions'

let AddTodo = ({ dispatch }) => {
  let input

  //提交新增todo
  const submitHandle = (e) => {
    e.preventDefault()
    if (!input.value.trim()) {
      return
    }
    dispatch(addTodo(input.value)) //触发action
    input.value = ''
  }
  
  return (
    <div>
      <form
        onSubmit={ submitHandle }
      >
        <input
          ref={node => {
            console.log(node)
            input = node
          }}
        />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
// 使用connect将state绑定到组件
AddTodo = connect()(AddTodo)

export default AddTodo