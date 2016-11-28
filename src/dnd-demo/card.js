import React, { Component } from 'react';

import {
  DragSource,
  DropTarget
} from 'react-dnd';

const CARD = 'card';

const dragSource = {

  beginDrag: props => {
    const { card } = props;
    return {
      id: card.id,
      card
    };
  },

  isDragging: (props, monitor) => {
    return monitor.getItem().id === props.card.id;
  }

};

const dropTarget = {

  hover(props, monitor) {
    const { card: source } = monitor.getItem();
    const { card: target, moveCard } = props;

    if(source.id === target.id) return;

    moveCard(source, target);
  }

};

const drag = DragSource(
  CARD,
  dragSource,
  (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    };
  }
);

const drop = DropTarget(
  CARD,
  dropTarget,
  (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop()
    };
  }
);

class _Card extends Component {

  render() {
    const self = this;

    const {
      card: { name },
      connectDragSource,
      connectDropTarget,
      isOver,
      canDrop,
      isDragging
    } = self.props;

    const isPreview = (isOver && canDrop) || isDragging;

    const component = <div className={"card " + (isPreview ? "card-preview" : "")}>
      <div className="card-name">{name}</div>
    </div>;

    return connectDragSource(connectDropTarget(component));
  }
}

export const Card = drag(drop(_Card));
