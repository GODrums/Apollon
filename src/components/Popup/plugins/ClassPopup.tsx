import React, { SFC } from 'react';
import { connect } from 'react-redux';
import { State as ReduxState } from './../../../components/Store';
import Element, { ElementRepository } from '../../../domain/Element';
import Method from './../../../domain/plugins/class/Method';
import Attribute from './../../../domain/plugins/class/Attribute';
import { Class } from '../../../domain/plugins';
import NameField from './../NameField';
import { Item, Header, Label, ExistingMember, NewMember } from './../styles';
import Member from '../../../domain/plugins/class/Member';
import { ContainerRepository } from '../../../domain/Container';

const ClassPopup: SFC<Props> = ({
  element,
  readAttributes,
  readMethods,
  update,
  createElement,
  removeElement,
}) => {
  const attributes = readAttributes(element.ownedElements);
  const methods = readMethods(element.ownedElements);

  const toggleAbstract = (event: React.ChangeEvent<HTMLInputElement>) =>
    update({ ...element, isAbstract: event.target.checked } as Class);

  const save = (member: Member) => (value: string) =>
    update({ ...member, name: value });

  const create = (Type: typeof Attribute | typeof Method) => (
    value: string
  ) => {
    const child = new Type(value);
    child.owner = element.id;
    createElement(child);
  };

  const remove = (member: Member) => () => {
    removeElement(element, member);
  };

  return (
    <div>
      <Item>
        <Label>
          <input
            type="checkbox"
            checked={element.isAbstract}
            onChange={toggleAbstract}
          />
          <span>abstract</span>
        </Label>
      </Item>
      <Item>
        <Header>Attributes</Header>
        {attributes.map(a => (
          <ExistingMember key={a.id}>
            <NameField initial={a.name} onSave={save(a)} />
            <a onClick={remove(a)}>X</a>
          </ExistingMember>
        ))}
        <NewMember>
          <NameField initial="" onSave={create(Attribute)} clearOnSave={true} />
        </NewMember>
      </Item>
      <Item>
        <Header>Methods</Header>
        {methods.map(m => (
          <ExistingMember key={m.id}>
            <NameField initial={m.name} onSave={save(m)} />
            <a onClick={remove(m)}>X</a>
          </ExistingMember>
        ))}
        <NewMember>
          <NameField initial="" onSave={create(Method)} clearOnSave={true} />
        </NewMember>
      </Item>
    </div>
  );
};

interface OwnProps {
  element: Class;
}

interface StateProps {
  readAttributes: (ownedElements: string[]) => Attribute[];
  readMethods: (ownedElements: string[]) => Method[];
}

interface DispatchProps {
  update: typeof ElementRepository.update;
  createElement: typeof ElementRepository.create;
  removeElement: typeof ContainerRepository.removeElement;
}

type Props = OwnProps & StateProps & DispatchProps;

export default connect(
  (state: ReduxState): StateProps => ({
    readAttributes: (ownedElements: string[]) =>
      ownedElements
        .map<Element>(ElementRepository.getById(state.elements))
        .filter(e => e instanceof Attribute),
    readMethods: (ownedElements: string[]) =>
      ownedElements
        .map<Element>(ElementRepository.getById(state.elements))
        .filter(e => e instanceof Method),
  }),
  {
    update: ElementRepository.update,
    createElement: ElementRepository.create,
    removeElement: ContainerRepository.removeElement,
  }
)(ClassPopup);
