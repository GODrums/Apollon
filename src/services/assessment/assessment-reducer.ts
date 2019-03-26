import { Reducer } from 'redux';
import { AssessmentState, AssessmentActions, AssessmentActionTypes } from './assessment-types';

const initialState: AssessmentState = {};

export const AssessmentReducer: Reducer<AssessmentState, AssessmentActions> = (state = initialState, action) => {
  switch (action.type) {
    case AssessmentActionTypes.ASSESS: {
      const { payload } = action;
      return {
        ...state,
        [payload.element]: payload.assessment,
      };
    }
  }
  return state;
};
