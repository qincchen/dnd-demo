import _ from 'lodash';

const getId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

export class Board {

  constructor() {
    // list of card list: { id: cardListId, name: cardListName }
    this.cardLists = [];

    // cardListId => ordered list of card ids
    this.listToCardMap = {};

    // cardId => card
    this.cardMap = {};
  }

  getBoard() {
    const board = this.cardLists.map(list => {
      const { id: listId } = list;
      const cards = this.listToCardMap[listId].map(cardId => this.cardMap[cardId]);
      return {
        ...list,
        cards
      };
    });

    return board;
  }

  getCardLists() {
    return this.cardLists.map(id => this.listToCardMap[id])
  }

  getCards(cardListId) {
    return this.listToCardMap[cardListId].map(cardId => this.cardMap[cardId]);
  }

  getCardPosition(cardId) {
    const card = this.cardMap[cardId];
    const { listId } = card;
    const index = _.indexOf(this.listToCardMap[listId], cardId);

    return {
      listId,
      index
    }
  }

  addCardList(cardListName) {
    if(_.isEmpty(cardListName)) return;

    const id = getId();

    this.listToCardMap[id] = [];
    this.cardLists.push({
      id,
      name: cardListName
    });

    return id;
  }

  swapCardList(aListId, bListId) {
    const a = _.find(this.cardLists, list => list.id === aListId);
    const b = _.find(this.cardLists, list => list.id === bListId);
    const aIndex = _.indexOf(this.cardLists, a);
    const bIndex = _.indexOf(this.cardLists, b);

    this.cardLists[aIndex] = b;
    this.cardLists[bIndex] = a;
  }

  addCard(cardName, cardListId) {
    if(_.isEmpty(cardName)) return;

    const cardId = getId();

    const newCard = {
      id: cardId,
      name: cardName,
      listId: cardListId
    };

    this.cardMap[cardId] = newCard;
    this.listToCardMap[cardListId].push(cardId);

    return cardId;
  }

  moveCard(cardId, cardListId, targetIndex) {
    const card = this.cardMap[cardId];
    const originalListId = card.listId;

    if(cardListId === originalListId) {
      const cardList = this.listToCardMap[cardListId];
      const srcIndex = _.indexOf(cardList, cardId);

      const temp = cardList[targetIndex];
      cardList[targetIndex] = cardId;
      cardList[srcIndex] = temp;
    } else {
      card.listId = cardListId;
      this.listToCardMap[cardListId].splice(targetIndex, 0, cardId);
      this.listToCardMap[originalListId] = _.without(this.listToCardMap[originalListId], cardId);
    }
  }

  appendCard(cardId, cardListId) {
    const targetIndex = this.listToCardMap[cardListId].length;
    this.moveCard(cardId, cardListId, targetIndex);
  }
}
