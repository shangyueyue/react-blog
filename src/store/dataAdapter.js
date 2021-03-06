/**
 * 数据适配功能文件
 * @name dataAdapter.js
 * @kind file
 * @copyright src/store/dataAdapter.js 2017/12/28
 * @author codingplayboy
 */
import moment from 'moment';
import JSIcon from 'styles/imgs/icons-js.png';
import HTMLIcon from 'styles/imgs/icons-html.png';
import CSSIcon from 'styles/imgs/icons-css.png';
import MobileIcon from 'styles/imgs/icons-mobile.png';
import GitIcon from 'styles/imgs/icons-git.png';

/**
 * 适配PostList数组
 * @param {array} data postList
 * @return {array} new list of post
 * @see src/store/dataAdapter.js
 */
export const formatPostListData = (data) => {
  let len = data.length;
  let result = {
    ids: [],
    data: {}
  };
  if (len > 0) {
    while (len--) {
      let post = data[len];
      let obj = {
        id: post.id,
        authorId: parseInt(post.author || 0, 10) || '',
        title: post.title.rendered,
        originalDate: post.date,
        date: moment(post.date).format('YYYY-MM-DD HH:mm:ss'),
        excerpt: post.excerpt.rendered,
        content: post.content.rendered,
        modified: moment(post.modified).format('YYYY-MM-DD HH:mm:ss'),
        categories: post.categories,
        tags: post.tags,
        comment_status: post.comment_status,
        status: post.status,
        link: post.link.replace(/.+\.(?:com|net|cn|org)(\/.+\/?$)/, '$1')
      };
      result.ids.unshift(post.id);
      Object.assign(result.data, {
        [post.id]: obj,
        [obj.link]: obj
      });
    }
  }
  return result;
};

// 适配目录数组数据为Object
export const formatCategoriesData = (data = []) => {
  let results = {};
  let slugs = {};
  data.map((cur) => {
    results[cur.id] = cur;
    slugs[cur.slug] = cur;
  });
  return {
    idMap: results,
    slugMap: slugs
  };
};

// postNavs排序索引
const PostNavsIndexObj = {
  'web': 0,
  'html': 1,
  'css': 2,
  'js': 3,
  'mobile': 5,
  'spa': 4,
  'pack': 7,
  'gitsvn': 6,
  'linux': 8
};
const PostNavsInfo = {
  'html': {
    label: '',
    icon: HTMLIcon
  },
  css: {
    label: '',
    icon: CSSIcon
  },
  js: {
    label: '',
    icon: JSIcon
  },
  mobile: {
    label: '',
    icon: MobileIcon
  },
  gitsvn: {
    label: '',
    icon: GitIcon
  },
  spa: {
    label: 'SPA',
    'label-title': true
  },
  pack: {
    label: 'Pack',
    'label-title': true
  }
};
// postNavs白名单
const PostNavsWhiteList = ['web', 'html', 'css', 'js', 'mobile', 'pack', 'gitsvn', 'spa', 'linux', 'sundry'];
const PostNavsBlackList = [];

// 适配PostNavs
export const formatPostNavsData = (data = []) => {
  let results = [];
  let indexObj = {};
  let len = data.length;
  let num = PostNavsWhiteList.length || (len - Object.keys(PostNavsIndexObj).length - PostNavsBlackList.length);
  let startCount = 0;
  data.map((cur) => {
    if (cur && cur.name && !cur.parent && PostNavsWhiteList.length && PostNavsWhiteList.indexOf(cur.slug) >= 0) {
      let key = PostNavsIndexObj[cur.slug];
      if (typeof key === 'undefined') {
        key = Object.keys(PostNavsIndexObj).length + startCount;
        startCount++;
      }
      if (startCount <= num && key < len - PostNavsBlackList.length) {
        indexObj[cur.id] = key;
        results[key] = Object.assign({
          id: cur.id,
          label: cur.name,
          title: cur.name,
          key: cur.slug || cur.id,
          link: cur.link.replace(/.+\.(?:com|net|cn|org)(\/.+\/?$)/, '$1')
        }, PostNavsInfo[cur.slug] || {});
      }
    }
  });
  data.map(item => {
    if (item && item.parent) {
      let parentIndex = indexObj[item.parent];
      if (typeof parentIndex !== 'undefined') {
        results[parseInt(parentIndex, 10)].children = (results[parseInt(parentIndex, 10)].children || []).concat({
          id: item.id,
          label: item.name,
          title: item.name,
          parent: item.parent,
          key: item.slug || item.id,
          link: item.link.replace(/.+\.(?:com|net|cn|org)(\/.+\/?$)/, '$1')
        });
      }
    }
  });
  return results;
};

const CategoryListBlacklist = ['uncategorized'];

// 适配分类列表展示数据
export const formatCategoryListData = (data = []) => {
  let results = [];
  let indexObj = {};
  data.map((cur) => {
    if (cur && cur.name && !cur.parent &&
      CategoryListBlacklist.indexOf(cur.slug) < 0) {
      let len = results.length;
      indexObj[cur.id] = [len];
      results.push(Object.assign({
        id: cur.id,
        index: len,
        label: cur.name,
        title: cur.name,
        key: cur.slug || cur.id,
        link: cur.link.replace(/.+\.(?:com|net|cn|org)(\/.+\/?$)/, '$1')
      }));
    }
  });
  data.map(item => {
    if (item && item.parent && CategoryListBlacklist.indexOf(item.slug) < 0) {
      let parentIndex = indexObj[item.parent];
      if (typeof parentIndex !== 'undefined') {
        parentIndex = parentIndex[0];
        let len = (results[parseInt(parentIndex, 10)].children || []).length;
        indexObj[item.id] = [parentIndex, len];
        results[parseInt(parentIndex, 10)].children = (results[parseInt(parentIndex, 10)].children || []).concat({
          id: item.id,
          label: item.name,
          title: item.name,
          parent: item.parent,
          index: len,
          parentIndex: parentIndex,
          key: item.slug || item.id,
          link: item.link.replace(/.+\.(?:com|net|cn|org)(\/.+\/?$)/, '$1')
        });
      }
    }
  });
  return {
    list: results,
    indexObj: indexObj
  };
};
