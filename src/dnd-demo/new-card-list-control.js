import React, { Component } from 'react';
import ReactDom from 'react-dom';

export class NewCardListControl extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isIdle: true
    }
  }

  idlePlaceHolder() {
    const self = this;
    const showNewCardListComposer = () => {
      self.setState({
        ...self.state,
        isIdle: false
      });
    };

    return <div className="idle" onClick={showNewCardListComposer}>
      Add a list...
    </div>
  }

  addNewCardListComposer() {
    const self = this;
    const { addNewCardList } = self.props;

    const close = () => {
      self.setState({
        ...self.state,
        isIdle: true
      });
    };

    const add = () => {
      const cardListName = self.refs.cardListName.value.trim();
      addNewCardList(cardListName);

      close();
    };

    const cancel = () => {
      close();
    };

    const keyPressHandler = e => {
      if(e.type === 'keypress' && e.which === 13) {
        add();
      }
    };

    return <div className="new-card-list-composer">
      <div>
        <input ref="cardListName"
               onKeyPress={keyPressHandler}
               className="form-control card-list-name-input"
               type="text"
               autofocus
        />
      </div>
      <div>
        <button onClick={add} className="btn btn-success add">Add</button>
        <button onClick={cancel} className="btn btn-default cancel">Cancel</button>
      </div>
    </div>
  }

  componentDidUpdate() {
    if(!this.state.isIdle) {
      ReactDom.findDOMNode(this.refs.cardListName).focus();
    }
  }

  render() {
    const { isIdle } = this.state;

    return <div className="card-list-wrapper">
      <div className="add-new-card-list-control">
        {isIdle ? this.idlePlaceHolder() : this.addNewCardListComposer()}
      </div>
    </div>;
  }
}
