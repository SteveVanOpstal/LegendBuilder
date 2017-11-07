import {Actions, ActionTypes} from './items.actions';

export function itemsReducer(state = [], action: Actions) {
  switch (action.type) {
    case ActionTypes.SET_ITEMS:
      let changed = false;
      if (!action.payload) {
        return state;
      }
      for (const index of Object.keys(action.payload)) {
        if (JSON.stringify(action.payload[index]) !== JSON.stringify(state[index])) {
          changed = true;
          break;
        }
      }
      if (changed) {
        return [...state, ...action.payload];
      } else {
        return state;
      }

    case ActionTypes.ADD_ITEM:
      return [
        ...state,
        Object.assign(
            {time: 0, bundle: 0, offset: 0, discount: 0, contained: false, contains: [], slotId: 0},
            action.payload)
      ];

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
