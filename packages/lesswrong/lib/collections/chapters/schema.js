import React from 'react';
import { Components, getDynamicComponent } from 'meteor/vulcan:core';
import ReactDOMServer from 'react-dom/server';

const schema = {

  _id: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
  },

  createdAt: {
    type: Date,
    optional: true,
    viewableBy: ['guests'],
    onInsert: () => {
      return new Date();
    },
  },

  // Custom Properties

  title: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ["admins"],
    insertableBy: ['members'],
  },

  subtitle: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ["admins"],
    insertableBy: ['members'],
  },

  description: {
    type: Object,
    blackbox: true,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ["admins"],
    insertableBy: ['members'],
    control: (props) => getDynamicComponent(import('../../../components/async/EditorFormComponent.jsx'), props),
  },

  htmlDescription: {
    type: String,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    control: "textarea",
    hidden: true,
  },

  number: {
    type: Number,
    optional: true,
    viewableBy: ['guests'],
    editableBy: ['members'],
    insertableBy: ['members'],
  },

  sequenceId: {
    type: String,
    optional: true,
    hidden: true,
    viewableBy: ['guests'],
    editableBy: ['admins'],
    insertableBy: ['members'],
    resolveAs: {
      fieldName: 'sequence',
      type: 'Sequence',
      resolver: (chapter, args, context) => {
        return context.Sequences.findOne({_id: chapter.sequenceId}, {fields: context.Users.getViewableFields(context.currentUser, context.Posts)})
      },
      addOriginalField: true,
    }
  },

  postIds: {
    type: Array,
    optional: false,
    viewableBy: ["guests"],
    editableBy: ["admins"],
    insertableBy: ['members'],
    resolveAs: {
      fieldName: 'posts',
      type: '[Post]',
      resolver: async (chapter, args, {currentUser, Users, Posts}) => {
        if (!chapter.postIds) return [];
        const posts = _.compact(await Posts.loader.loadMany(chapter.postIds));
        return Users.restrictViewableFields(currentUser, Posts, posts);
      },
      // resolver: (chapter, args, context) => {
      //   return (_.map(chapter.postIds, (id) =>
      //     { return context.Posts.findOne({ _id: id }, { fields: context.Users.getViewableFields(context.currentUser, context.Posts)})
      //   }))
      // },
      addOriginalField: true,
    },
    control: 'PostsListEditor',
  },

  "postIds.$": {
    type: String,
    optional: true,
  },
}

export default schema;
