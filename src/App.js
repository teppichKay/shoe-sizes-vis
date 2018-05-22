import React, { Component } from 'react';
import './App.css';
import BarChart from './BarChart/BarChart';

class App extends Component {
  state = {
    userName: "admin"
  }

  handleChange = (event)  => {
    this.setState({userName: event.target.value});
  }

  render() {
    console.log(this.state.userName);
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Shoe Sizing Dashboard</h1>
        </header>
        <label>Choose user role: </label>
        <select className="select-btn"
          value={this.state.userName} 
          onChange={this.handleChange}>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="store">Store</option>
        </select>
        <BarChart onShow={this.state.userName}/>
      </div>
    );
  }
}

export default App;
