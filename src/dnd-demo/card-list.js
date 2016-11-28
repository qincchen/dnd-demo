import React, { Component } from 'react';

import {
  DragSource,
  DropTarget
} from 'react-dnd';

import { Card } from './card.js';
import { NewCardControl } from './new-card-control.js';

const CARD_LIST = 'card-list';

const dragSource = {

  beginDrag: props => {
    const { cardList } = props;
    return {
      id: cardList.id,
      cardList
    };
  },

  isDragging: (props, monitor) => {
    return monitor.getItem().id === props.cardList.id;
  }

};

const dropTarget = {

  hover(props, monitor) {
    const { cardList: source } = monitor.getItem();
    const { cardList: target, swapCardList } = props;

    if(source.id === target.id) return;

    swapCardList(source, target);
  }

};

const drag = DragSource(
  CARD_LIST,
  dragSource,
  (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    };
  }
);

const drop = DropTarget(
  CARD_LIST,
  dropTarget,
  (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    };
  }
);

class _CardList extends Component {

  render() {
    const self = this;

    const {
      cardList: { name, cards, id },
      moveCard,
      addNewCard,
      appendCard,
      connectDragSource,
      connectDropTarget,
      isOver,
      canDrop,
      isDragging
    } = self.props;

    const isPreview = (isOver && canDrop) || isDragging;

    const component = <div className="card-list-wrapper">

      <div className={"card-list " + (isPreview ? "card-list-preview" :  "")}>
        <div className="card-list-header">
          {name}
        </div>
        <div className="cards">
          {[
            ...cards.map((card, i) => {
              return <Card key={i} card={card} moveCard={moveCard} />
            }),
            <NewCardControl key={-1}
                            addNewCard={addNewCard}
                            appendCard={appendCard}
                            listId={id} />
          ]}
        </div>
      </div>

    </div>;

    return connectDragSource(connectDropTarget(component));
  }
}

export const CardList = drag(drop(_CardList));
