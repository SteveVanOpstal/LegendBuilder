import {Actions, ActionTypes} from './items.actions';

export function itemsReducer(state = [], action: Actions) {
  switch (action.type) {
    case ActionTypes.ADD_ITEM:
      return [...state, Object.assign({}, action.payload)];

    case ActionTypes.REMOVE_ITEM:
      const index = state.indexOf(action.payload);
      if (index >= 0) {
        state = state.slice(0, index).concat(state.slice(index + 1));
      }
      return state;

    case ActionTypes.MOVE_ITEM:
      const source = action.payload.source;
      const target = action.payload.target;
      const indexSource = state.indexOf(source);
      let indexTarget = state.indexOf(target);
      if (indexSource && indexSource !== indexTarget) {
        state.splice(indexSource, 1);
        indexTarget = indexSource < indexTarget ? indexTarget - 1 : indexTarget;
        state.splice(indexTarget, 0, Object.assign({}, source));
      }
      return [...state];

    default:
      return state;
  }
}
