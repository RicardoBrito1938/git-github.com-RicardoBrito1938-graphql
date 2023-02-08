/* eslint-disable no-useless-constructor */
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
  constructor(dbConnection) {
    super(dbConnection);
    this.tableName = 'comments';
  }

  async getById(id) {
    return this.db(this.tableName).where({ id });
  }

  async getByPostId(post_id) {
    const query = this.db(this.tableName).where({ post_id });
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

    const exists = await this.db(this.tableName).where(partialComment).first();

    if (exists) {
      throw new Error('Comment already exists');
    }

    const created = await this.db(this.tableName).insert(partialComment);

    return {
      id: created[0],
      createdAt: new Date().toISOString(),
      ...partialComment,
    };
  }

  async batchLoaderCallback(post_ids) {
    const query = this.db(this.tableName).whereIn('post_id', post_ids);
    const comments = await query;

    const filteredComments = post_ids
      .map((post_id) => {
        return comments.filter((comment) => comment.post_id === post_id);
      })
      .map((comment) => comment.map(commentReducer));

    return filteredComments;
  }
}
