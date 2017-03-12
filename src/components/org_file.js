import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as orgActions from '../actions/org';
import * as dropboxActions from '../actions/dropbox';
import HeaderList from './header_list';

class OrgFile extends Component {
  constructor(props) {
    super(props);
    this.handleAdvanceTodoClick = this.handleAdvanceTodoClick.bind(this);
    this.handleAddHeaderClick = this.handleAddHeaderClick.bind(this);
    this.handleTitleEditModeClick = this.handleTitleEditModeClick.bind(this);
    this.handleDescriptionEditModeClick = this.handleDescriptionEditModeClick.bind(this);
    this.handleRemoveHeaderClick = this.handleRemoveHeaderClick.bind(this);
    this.handleMoveHeaderUpClick = this.handleMoveHeaderUpClick.bind(this);
    this.handleMoveHeaderDownClick = this.handleMoveHeaderDownClick.bind(this);
  }

  handleAdvanceTodoClick(headerId) {
    this.props.orgActions.advanceTodoState(this.props.selectedHeaderId);
  }

  handleAddHeaderClick() {
    this.props.orgActions.openHeader(this.props.selectedHeaderId);
    this.props.orgActions.addHeader(this.props.selectedHeaderId);
    this.props.orgActions.syncChanges();

    this.props.orgActions.selectLastHeader(this.props.selectedHeaderId);
    this.props.orgActions.enterTitleEditMode();
  }

  handleTitleEditModeClick() {
    this.props.orgActions.toggleTitleEditMode();
  }

  handleDescriptionEditModeClick() {
    this.props.orgActions.toggleDescriptionEditMode();
    this.props.orgActions.openHeader(this.props.selectedHeaderId);
  }

  handleRemoveHeaderClick() {
    if (window.confirm('Are you sure you want to delete this header?')) {
      this.props.orgActions.removeHeader(this.props.selectedHeaderId);
      this.props.orgActions.syncChanges();
    }
  }

  handleMoveHeaderUpClick() {
    this.props.orgActions.moveHeaderUp(this.props.selectedHeaderId);
  }

  handleMoveHeaderDownClick() {
    this.props.orgActions.moveHeaderDown(this.props.selectedHeaderId);
  }

  render() {
    let dirtyIndicator = '';
    if (this.props.dirty && !this.props.sampleMode) {
      const style = {
        padding: 3,
        backgroundColor: 'gray',
        opacity: '0.5',
        color: 'white',
        position: 'fixed',
        bottom: 100,
        right: 10,
        fontWeight: 'bold'
      };
      dirtyIndicator = (
        <div style={style}>Unpushed changes</div>
      );
    }

    const disabledClass = this.props.selectedHeaderId ? '' : 'btn--disabled';
    const actionDrawerStyle = {
      position: 'fixed',
      bottom: 10,
      left: 10,
      right: 10,
      height: 80,
      border: '1px solid lightgray',
      backgroundColor: 'white',
      boxShadow: '2px 2px 5px 0px rgba(148,148,148,0.75)',
      paddingTop: 9,
      paddingBottom: 6,
      paddingLeft: 20,
      boxSizing: 'border-box',
      overflowX: 'auto',
      whiteSpace: 'nowrap'
    };
    const buttonStyle = {
      marginRight: 20
    };
    const actionDrawer = (
      <div style={actionDrawerStyle} className="nice-scroll">
        <button className={`fa fa-check-square btn btn--circle ${disabledClass}`}
                style={buttonStyle}
                onClick={() => this.handleAdvanceTodoClick()}></button>
        <button className={`fa fa-pencil btn btn--circle ${disabledClass}`}
                style={buttonStyle}
                onClick={() => this.handleTitleEditModeClick()}></button>
        <button className={`fa fa-pencil-square-o btn btn--circle ${disabledClass}`}
                style={buttonStyle}
                onClick={() => this.handleDescriptionEditModeClick()}></button>
        <button className={`fa fa-plus btn btn--circle ${disabledClass}`}
                style={buttonStyle}
                onClick={() => this.handleAddHeaderClick()}></button>
        <button className={`fa fa-times btn btn--circle ${disabledClass}`}
                style={buttonStyle}
                onClick={() => this.handleRemoveHeaderClick()}></button>
        <button className={`fa fa-arrow-up btn btn--circle ${disabledClass}`}
                style={buttonStyle}
                onClick={() => this.handleMoveHeaderUpClick()}></button>
        <button className={`fa fa-arrow-down btn btn--circle ${disabledClass}`}
                style={buttonStyle}
                onClick={() => this.handleMoveHeaderDownClick()}></button>
      </div>
    );

    return (
      <div>
        {dirtyIndicator}
        <div style={{whiteSpace: 'pre-wrap'}}>
          <HeaderList headers={this.props.parsedFile} />
        </div>
        {actionDrawer}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    parsedFile: state.org.get('parsedFile'),
    filePath: state.org.get('filePath'),
    dirty: state.org.get('dirty'),
    selectedHeaderId: state.org.get('selectedHeaderId'),
    sampleMode: state.org.get('sampleMode')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    orgActions: bindActionCreators(orgActions, dispatch),
    dropboxActions: bindActionCreators(dropboxActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgFile);
