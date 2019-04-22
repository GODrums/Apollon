import React, { Component, ComponentClass, ComponentType } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { UMLElementRepository } from '../../services/uml-element/uml-element-repository';
import { AsyncDispatch } from '../../utils/actions/actions';
import { Point } from '../../utils/geometry/point';
import { ModelState } from '../store/model-state';
import { OwnProps } from './element-component';

type StateProps = {};

type DispatchProps = {
  start: AsyncDispatch<typeof UMLElementRepository.startResizing>;
  resize: AsyncDispatch<typeof UMLElementRepository.resize>;
  end: AsyncDispatch<typeof UMLElementRepository.endResizing>;
};

type Props = OwnProps & StateProps & DispatchProps;

const initialState = {
  resizing: false,
  offset: new Point(),
};

type State = typeof initialState;

const enhance = connect<StateProps, DispatchProps, OwnProps, ModelState>(
  null,
  {
    start: UMLElementRepository.startResizing,
    resize: UMLElementRepository.resize,
    end: UMLElementRepository.endResizing,
  },
);

const Handle = styled.rect.attrs({
  x: '100%',
  y: '100%',
  width: 15,
  height: 15,
  transform: 'translate(-10, -10)',
  fill: 'none',
})`
  cursor: nwse-resize;
  pointer-events: all;
`;

export const resizable = (options?: { preventX: boolean; preventY: boolean }) => (
  WrappedComponent: ComponentType<OwnProps>,
): ComponentClass<OwnProps> => {
  class Resizable extends Component<Props, State> {
    state = initialState;

    render() {
      return (
        <WrappedComponent id={this.props.id} className={this.props.className}>
          {this.props.children}
          <Handle onPointerDown={this.onPointerDown} />
        </WrappedComponent>
      );
    }

    private resize = (width: number, height: number) => {
      width = Math.round(width / 10) * 10;
      height = Math.round(height / 10) * 10;
      if (options && options.preventX) width = 0;
      if (options && options.preventY) height = 0;
      if (width === 0 && height === 0) return;

      this.setState(state => ({ offset: state.offset.add(width, height) }));
      this.props.resize({ width, height });
    };

    private onPointerDown = (event: React.PointerEvent) => {
      if (event.nativeEvent.which && event.nativeEvent.which !== 1) {
        return;
      }

      this.setState({ resizing: true, offset: new Point(event.clientX, event.clientY) });
      this.props.start();
      document.addEventListener('pointermove', this.onPointerMove);
      document.addEventListener('pointerup', this.onPointerUp, { once: true });
    };

    private onPointerMove = (event: PointerEvent) => {
      const width = event.clientX - this.state.offset.x;
      const height = event.clientY - this.state.offset.y;
      this.resize(width, height);
    };

    private onPointerUp = () => {
      document.removeEventListener('pointermove', this.onPointerMove);
      this.setState(initialState);
      this.props.end();
    };
  }

  return enhance(Resizable);
};
