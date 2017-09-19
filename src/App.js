import React, { Component } from 'react';
import './App.css';

class ViaCep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      error: false,
    };
    this.getCep = this.getCep.bind(this);
  }
  componentDidMount() {
    if (this.props.lazy) {
      return;
    }
    this.getCep();
  }
  getCep() {
    this.setState({loading: true});
    fetch(`https://viacep.com.br/ws/${this.props.cep}/json/`)
    .then(response => response.json() )
    .then( data => {
      this.setState({ data: data, loading: false });
    })
    .catch(err => {
      this.setState({ error: true, loading: false });
    })
  }
  render() {
    return (
      this.props.children({
        loading: this.state.loading,
        data: this.state.data,
        error: this.state.error,
        fetch: this.getCep,
      }) || null
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { cep: '' }
  }
  handleChangeCep = (evt) => {
    this.setState({ cep: evt.target.value })
  }
  render() {
    return (
      <div className="App">
        <ViaCep cep={this.state.cep} lazy>
          { ({ data, loading, error, fetch }) => {
            if (loading) {
              return <p>loading...</p>
            }
            if (error) {
              return <p>error</p>
            }
            if (data) {
              return <div>
                <p>
                  CEP: {data.cep} <br/>
                  CIDADE: {data.localidade} <br/>
                  UF: {data.uf} <br/>
                </p>
              </div>
            }
            return <div>
              <input onChange={this.handleChangeCep} value={this.state.cep} placeholder="CEP" type="text"/>
              <button onClick={fetch}>Pesquisar</button>
            </div>
          }}
        </ViaCep>
      </div>
    );
  }
}

export default App;
