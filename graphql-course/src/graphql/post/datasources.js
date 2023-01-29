/* eslint-disable space-before-function-paren */
import { RESTDataSource } from 'apollo-datasource-rest';
import { makePostDataloader } from './dataloaders';
import {
  createPostFn,
  deletePostFn,
  updatePostFn,
} from './utils/post-repository';

export class PostApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.API_URL}/posts/`;
    this.dataloader = makePostDataloader(this.getPosts.bind(this));
  }

  async getPosts(urlParams = {}) {
    return this.get('', urlParams, {
      cacheOptions: {
        ttl: 0,
      },
    });
  }

  async getPost(id) {
    return this.get(id, undefined, {
      cacheOptions: {
        ttl: 0,
      },
    });
  }

  async createPost(postData) {
    return await createPostFn(postData, this);
  }

  async updatePost(postId, postData) {
    return await updatePostFn(postId, postData, this);
  }

  async deletePost(postId) {
    return await deletePostFn(postId, this);
  }

  batchLoadByUserId(id) {
    return this.dataloader.load(id);
  }
}
