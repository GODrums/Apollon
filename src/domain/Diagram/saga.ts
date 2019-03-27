import { takeLatest, put, select, all } from 'redux-saga/effects';
import { State } from './../../components/Store';
import { ElementActionTypes, ElementRepository } from '../Element';
import Relationship from '../Relationship';
import {
  CreateAction as ElementCreateAction,
  SelectAction,
  DeleteAction,
} from '../Element/types';
import {
  ActionTypes as ContainerActionTypes,
  ChangeOwnerAction,
} from '../Container/types';
import {
  AddElementAction,
  ActionTypes,
  AddRelationshipAction,
  DeleteElementAction,
  DeleteRelationshipAction,
} from './types';
import Container from '../Container';

function* saga() {
  yield takeLatest(ContainerActionTypes.CHANGE_OWNER, handleOwnerChange);
  yield takeLatest(ElementActionTypes.CREATE, handleElementCreation);
  yield takeLatest(ElementActionTypes.SELECT, handleElementSelection);
  yield takeLatest(ElementActionTypes.DELETE, handleElementDeletion);
}

function* handleOwnerChange({ payload }: ChangeOwnerAction) {
  if (!payload.id || payload.id === payload.owner) return;

  const { elements }: State = yield select();
  const selection = Object.values(elements).filter(element => element.selected);
  if (selection.length > 1) return;

  const element = ElementRepository.getById(elements)(payload.id);
  if (payload.owner === element.owner) return;

  const owner =
    payload.owner && ElementRepository.getById(elements)(payload.owner);
  if (owner && !(owner.constructor as typeof Container).features.droppable)
    return;

  if (!element.owner) {
    yield put<DeleteElementAction>({
      type: ActionTypes.DELETE_ELEMENT,
      payload: { id: element.id },
    });
  }

  if (!payload.owner) {
    yield put<AddElementAction>({
      type: ActionTypes.ADD_ELEMENT,
      payload: { id: element.id },
    });
  }
}

function* handleElementCreation({ payload }: ElementCreateAction) {
  if (payload.element instanceof Relationship) {
    yield put<AddRelationshipAction>({
      type: ActionTypes.ADD_RELATIONSHIP,
      payload: { id: payload.element.id },
    });
  } else {
    if (payload.element.owner) return;
    yield put<AddElementAction>({
      type: ActionTypes.ADD_ELEMENT,
      payload: { id: payload.element.id },
    });
  }
}

function* handleElementSelection({ payload }: SelectAction) {
  if (!payload.id || payload.toggle) return;

  const { diagram }: State = yield select();

  if (diagram.ownedElements.includes(payload.id)) {
    yield put<AddElementAction>({
      type: ActionTypes.ADD_ELEMENT,
      payload: { id: payload.id },
    });
  } else if (diagram.ownedRelationships.includes(payload.id)) {
    yield put<AddRelationshipAction>({
      type: ActionTypes.ADD_RELATIONSHIP,
      payload: { id: payload.id },
    });
  }
}

function* handleElementDeletion({ payload }: DeleteAction) {
  if (!payload.id) return;

  const { diagram }: State = yield select();

  if (diagram.ownedElements.includes(payload.id)) {
    yield put<DeleteElementAction>({
      type: ActionTypes.DELETE_ELEMENT,
      payload: { id: payload.id },
    });
  } else if (diagram.ownedRelationships.includes(payload.id)) {
    yield put<DeleteRelationshipAction>({
      type: ActionTypes.DELETE_RELATIONSHIP,
      payload: { id: payload.id },
    });
  }
}

export default saga;
