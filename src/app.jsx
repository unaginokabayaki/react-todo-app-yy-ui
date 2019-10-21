class Todo extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = { done: (props.done == "true" ),
                   text: props.text };
    console.log(this.state);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick(event) {
    this.setState(state => ({
      done: !state.done
    }),
    function (event) {
      this.handleSubmit(event);
    });
  }

  handleChange(event) {
    let text = event.target.value;
    this.setState(state => ({
      text: text
    }));
  }

  handleSubmit(event) {
    console.log("submit todo")
    let id = this.props.id || this.state._id;
    if(id == "" || id == undefined) {
      fetch('http://localhost:3000/todos/', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
          text: this.state.text, 
          done: this.state.done 
        })
      }).then(response => response.json())
      .then(data => this.setState(state => ({ _id: data._id })));
    }
  }

  render() {
    // let checked = (this.props.done == 'true')
    // let value = this.props.text
    return  <div className="todo">
            <input type="checkbox" checked={this.state.done} 
                                  onClick={this.handleClick} />
            <input type="text" value={this.state.text} 
                                onChange={this.handleChange} 
                                onBlur={this.handleSubmit} 
                                className={this.state.done ? "done" : "not-done"}/>
            </div>
  }
}

class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { todos: [] };

    this.newTodo = this.newTodo.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:3000/todos/')
      .then(response => response.json())
      .then(data => {
        this.setState(state => ({
          todos: data.todos
        }));
      });
  }

  newTodo(event) {
    event.preventDefault();

    let todos = this.state.todos;
    todos.push({_id: ""});

    this.setState(state => ({
      todos: todos
    }));
  }

  render() {
    const todoList = this.state.todos.map((todo) => 
      <Todo id={todo._id} key={todo._id.toString()} text={todo.text} done={todo.done} />
    );

    return <React.Fragment>
            <h2>React Todo App</h2>
            {todoList}
            <a href="#" onClick={this.newTodo}>New Todo</a>
           </React.Fragment>
  }
}

ReactDOM.render(
  <TodoList/>,
  document.getElementById('root')
);