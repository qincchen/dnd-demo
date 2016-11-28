import React, { Component } from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { CardList } from './card-list.js';
import { NewCardListControl } from './new-card-list-control.js';
import { Board } from './board.js';

const mock = board => {

  const listId1 = board.addCardList('task');
  const listId2 = board.addCardList('work in progress');
  board.addCardList('done');

  board.addCard('task 1', listId1);
  board.addCard('task 2', listId1);
  board.addCard('task 3', listId2);
};

class _DndDemo extends Component {

  constructor(props) {
    super(props);

    this.board = new Board();
    mock(this.board);

    this.state = {
      board: this.board.getBoard()
    }
  }

  getList() {
    const self = this;
    const { board } = self.state;

    const refresh = () => {
      const board = self.board.getBoard();

      self.setState({
        ...self.state,
        board
      });
    };

    const swapCardList = (source, target) => {
      self.board.swapCardList(source.id, target.id);

      refresh();
    };

    const moveCard = (source, target) => {
      const { listId, index } = self.board.getCardPosition(target.id);
      self.board.moveCard(source.id, listId, index);

      refresh();
    };

    const appendCard = (source, targetListId) => {
      self.board.appendCard(source.id, targetListId);

      refresh();
    };

    const addNewCard = (cardName, cardListId) => {
      self.board.addCard(cardName, cardListId);

      refresh();
    };

    const addNewCardList = cardListName => {
      self.board.addCardList(cardListName);

      refresh();
    };

    return [
      ...board.map((cardList, i) => {
        return <CardList
          key={i}
          cardList={cardList}
          swapCardList={swapCardList}
          moveCard={moveCard}
          appendCard={appendCard}
          addNewCard={addNewCard}
        />
      }),
      <NewCardListControl key={-1} addNewCardList={addNewCardList} />
    ];
  }

  render() {

    return <div className="board-wrapper">
      <div className="board">
        {this.getList()}
      </div>
    </div>;
  }
}

export const DndDemo = DragDropContext(HTML5Backend)(_DndDemo);
