import { knex } from '../index.js';
import { comments } from '../../../db.json';
import { dataIsoToMysql } from './data-iso-to-mysql';

const commentsForDb = comments.map((comment) => {
  return {
    comment: comment.comment,
    user_id: comment.user_id,
    post_id: comment.post_id,
    created_at: dataIsoToMysql(comment.created_at),
  };
});

console.log(commentsForDb);

// knex('comments')
//   .insert(commentsForDb)
//   .then((i) => {
//     console.log(i);
//   })
//   .catch((e) => {
//     console.log(e);
//   })
//   .finally(() => knex.destroy());
