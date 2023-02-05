import { knex } from '../index.js';
import { comments } from '../../../db.json';
import { dataIsoToMysql } from './data-iso-to-mysql';

const commentsForDb = comments.map((comment) => {
  return {
    // comment with max of 250 characters
    comment: comment.comment.slice(0, 250),
    user_id: comment.userId,
    post_id: comment.postId ?? 0,
    created_at: dataIsoToMysql(comment.created_at),
  };
});

console.log({ commentsForDb });

// node -r  dotenv/config -r sucrase/register src/knex/utils/copy-comments.js
// knex('comments')
//   .insert(commentsForDb)
//   .then((i) => {
//     console.log(i);
//   })
//   .catch((e) => {
//     console.log(e);
//   })
//   .finally(() => knex.destroy());
