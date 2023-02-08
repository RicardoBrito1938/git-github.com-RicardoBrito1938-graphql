/* eslint-disable space-before-function-paren */
import { SQLDataSource } from '../../datasource/sql/sql-datasource';

const commentReducer = (comment) => {
  return {
    id: comment.id,
    comment: comment.comment,
    user_id: comment.user_id,
    createdAt: new Date(comment.created_at).toISOString(),
  };
};

export class CommentSQLDataSource extends SQLDataSource {
  async getById(id) {
    return this.db('comments').where({ id });
  }

  async getByPostId(post_id) {
    const query = this.db('comments').where({ post_id });
    console.log(query.toString());
    const comments = await query;
    return comments.map((comment) => commentReducer(comment));
  }

  async create({ comment, postId, userId }) {
    const partialComment = {
      user_id: userId,
      post_id: postId,
      comment,
    };

    const exists = await this.db('comments').where(partialComment).first();

    if (exists) {
      throw new Error('Comment already exists');
    }

    const created = await this.db('comments').insert(partialComment);

    return {
      id: created[0],
      createdAt: new Date().toISOString(),
      ...partialComment,
    };
  }
}
