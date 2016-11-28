import React, { Component } from 'react';
import ReactDom from 'react-dom';
import {
  DropTarget
} from 'react-dnd';

const CARD = 'card';

const dropTarget = {

  hover(props, monitor) {
    const { card: source } = monitor.getItem();
    const { appendCard, listId } = props;

    if(source.listId === listId) return;

    appendCard(source, listId);
  }

};

const drop = DropTarget(
  CARD,
  dropTarget,
  connect => {
    return {
      connectDropTarget: connect.dropTarget()
    };
  }
);

class _NewCardControl extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showAddNewCardCreator: false
    };
  }

  newCardComposer() {
    const self = this;

    const {
      addNewCard,
      listId
    } = self.props;

    const close = () => {
      self.setState({
        ...self.state,
        showAddNewCardCreator: false
      });
    };

    const add = () => {
      const cardName = self.refs.cardName.value.trim();
      addNewCard(cardName, listId);

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

    return <div className="new-card-composer">
      <div>
        <textarea ref="cardName"
                  onKeyPress={keyPressHandler}
                  className="form-control card-name-input"
                  dir="auto"
        />
      </div>
      <div>
        <button onClick={add} className="btn btn-success add">Add</button>
        <button onClick={cancel} className="btn btn-default cancel">Cancel</button>
      </div>
    </div>;
  }

  componentDidUpdate() {
    if(this.state.showAddNewCardCreator) {
      ReactDom.findDOMNode(this.refs.cardName).focus();
    }
  }

  render() {
    const self = this;

    const {
      connectDropTarget
    } = self.props;

    const {
      showAddNewCardCreator
    } = self.state;

    const addNewCard = () => {

      self.setState({
        ...self.state,
        showAddNewCardCreator: true
      })
    };

    const component = showAddNewCardCreator
        ? self.newCardComposer()
        : <div onClick={addNewCard} className="new-card-control">
            Add a card...
          </div>;

    return connectDropTarget(component);
  }
}

export const NewCardControl = drop(_NewCardControl);
