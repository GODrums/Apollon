import { Reducer } from 'redux';
import { Actions } from '../actions';
import { UMLElementActionTypes, UMLElementState } from './uml-element-types';
import { IUMLElement } from './uml-element';

export const UMLElementReducer: Reducer<UMLElementState, Actions> = (state = {}, action) => {
  switch (action.type) {
    case UMLElementActionTypes.CREATE: {
      const { payload } = action;

      return payload.values.reduce(
        (elements: UMLElementState, values: IUMLElement) => ({ ...elements, [values.id]: values }),
        state,
      );
    }
    case UMLElementActionTypes.UPDATE: {
      const { payload } = action;

      return payload.values.reduce(
        (elements: UMLElementState, values: any) => ({
          ...elements,
          [values.id]: {
            ...elements[values.id],
            ...values,
          },
        }),
        state,
      );
    }
    case UMLElementActionTypes.DELETE: {
      const { payload } = action;

      return Object.keys(state).reduce<UMLElementState>(
        (elements, id) => ({
          ...elements,
          ...(!payload.ids.includes(id) && { [id]: state[id] }),
        }),
        {},
      );
    }
  }

  return state;
};
