import { Comments, Posts } from 'meteor/example-forum';

/**
 * @summary Get URL of a comment page.
 * @param {Object} comment
 */
// LW: Overwrite the original example-forum Comments.getPageUrl
Comments.getPageUrl = function(comment, isAbsolute = false){
  const post = Posts.findOne(comment.postId);
  return `${Posts.getPageUrl(post, isAbsolute)}#${comment._id}`;
};

// URL for RSS feed of all direct replies
Comments.getRSSUrl = function(comment, isAbsolute = false){
  const prefix = isAbsolute ? Utils.getSiteUrl().slice(0,-1) : '';
  return `${prefix}/feed.xml?type=comments&view=commentReplies&parentCommentId=${comment._id}`;
};
