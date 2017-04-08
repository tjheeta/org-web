import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AttributedString from './attributed_string';
import * as orgActions from '../actions/org';

class TitleLine extends Component {
  constructor(props) {
    super(props);
    this.handleTitleClick = this.handleTitleClick.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTitleFieldClick = this.handleTitleFieldClick.bind(this);
    this.handleTextareaBlur = this.handleTextareaBlur.bind(this);

    this.state = {
      titleValue: props.rawTitle
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.editMode && !nextProps.editMode) {
      this.props.actions.editHeaderTitle(this.props.headerId, this.state.titleValue);
      this.props.actions.syncChanges();
    }
  }

  handleTitleClick() {
    if (this.props.hasContent && (!this.props.opened || this.props.isSelected)) {
      this.props.actions.toggleHeaderOpened(this.props.headerId);
    }

    this.props.actions.selectHeader(this.props.headerId);
  }

  handleTitleChange(event) {
    this.setState({ ...this.state, titleValue: event.target.value });
  }

  handleTitleFieldClick(event) {
    event.stopPropagation();
  }

  handleTextareaBlur() {
    this.props.actions.toggleTitleEditMode();
  }

  render() {
    let todo = '';
    const todoKeyword = this.props.todoKeyword;
    if (todoKeyword) {
      const todoClasses = ['todo-keyword', `todo-keyword--${todoKeyword.toLowerCase()}`];
      todo = (
        <span className={todoClasses.join(' ')}>
          {todoKeyword}
        </span>
      );
    }

    const tail = (this.props.opened || !this.props.hasContent) ? '' : '...';

    let style = {
      fontWeight: 'bold'
    };
    if (this.props.color) {
      style.color = this.props.color;
    }
    let title = (
      <span style={style}>
        <AttributedString parts={this.props.title} /> {tail}
      </span>
    );
    if (this.props.editMode) {
      title = <textarea autoFocus
                        className="textarea"
                        rows="2"
                        value={this.state.titleValue}
                        onBlur={() => this.handleTextareaBlur()}
                        onChange={this.handleTitleChange}
                        onClick={(event) => this.handleTitleFieldClick(event)} />;
    }

    return (
      <div className="title-line" onClick={() => this.handleTitleClick()}>
        <div className="header-text">
          {todo} {title}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    isSelected: state.org.get('selectedHeaderId') === props.headerId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(orgActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TitleLine);
