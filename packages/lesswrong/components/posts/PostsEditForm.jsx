import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Components, registerComponent, getFragment, withMessages, withCurrentUser, getSetting } from 'meteor/vulcan:core';
import { intlShape } from 'meteor/vulcan:i18n';
import { Posts } from "meteor/example-forum";
import Users from "meteor/vulcan:users";
import { withRouter } from 'react-router'
import Helmet from 'react-helmet';

class PostsEditForm extends PureComponent {

  renderAdminArea() {
    const postId = this.props.location.query.postId;
    return (
      <Components.ShowIf check={Posts.options.mutations.edit.check} document={this.props.post}>
        <div className="posts-edit-form-admin">
          <div className="posts-edit-form-id">ID: {postId}</div>
          {/* Commented out for convenience at launch. Should definitely be reactivated */}
          {/* TODO: Reactivate this, by writing a wrapper that passes the post as a props*/ }
          {/* <Components.PostsStats post={this.props.post} /> */}
        </div>
      </Components.ShowIf>
    )
  }

  render() {
    const postId = this.props.location.query.postId;
    const eventForm = this.props.router.location.query && this.props.router.location.query.eventForm;
    const mapsAPIKey = getSetting('googleMaps.apiKey', null);
    return (
      <div className="posts-edit-form">
        {Users.isAdmin(this.props.currentUser) ? this.renderAdminArea() : null}
        {eventForm && <Helmet><script src={`https://maps.googleapis.com/maps/api/js?key=${mapsAPIKey}&libraries=places`}/></Helmet>}
        <Components.SmartForm
          collection={Posts}
          documentId={postId}
          mutationFragment={getFragment('LWPostsPage')}
          successCallback={post => {
            this.props.flash({ id: 'posts.edit_success', properties: { title: post.title }, type: 'success'});
            this.props.router.push({pathname: Posts.getPageUrl(post)});
          }}
          eventForm={eventForm}
          removeSuccessCallback={({ documentId, documentTitle }) => {
            // post edit form is being included from a single post, redirect to index
            // note: this.props.params is in the worst case an empty obj (from react-router)
            if (this.props.params._id) {
              this.props.router.push('/');
            }

            this.props.flash({ id: 'posts.delete_success', properties: { title: documentTitle }, type: 'success'});
            // todo: handle events in collection callbacks
            // this.context.events.track("post deleted", {_id: documentId});
          }}
          showRemove={true}
          repeatErrors
        />
      </div>
    );

  }
}

PostsEditForm.propTypes = {
  closeModal: PropTypes.func,
  flash: PropTypes.func,
}

PostsEditForm.contextTypes = {
  intl: intlShape
}

registerComponent('PostsEditForm', PostsEditForm, withMessages, withRouter, withCurrentUser);
