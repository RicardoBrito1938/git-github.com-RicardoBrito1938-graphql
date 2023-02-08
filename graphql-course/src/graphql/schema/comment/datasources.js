/* eslint-disable space-before-function-paren */
import { SQLDataSource } from '../../datasource/sql/sql-datasource';

export class CommentSQLDataSource extends SQLDataSource {
  async getById(id) {
    return this.db('comments').where('id', '=', id);
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
