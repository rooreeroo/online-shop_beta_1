import StoreModule from "../module";
import qs from 'qs';

const QS_OPTIONS = {
  stringify: {
    addQueryPrefix: true,
    arrayFormat: 'comma',
    encode: false
  },
  parse: {
    ignoreQueryPrefix: true,
    comma: true
  }
}

class CatalogStore extends StoreModule {

  /**
   * Начальное состояние
   */
  initState() {
    return {
      items: [],
      count: 0,
      params: {
        page: 1,
        limit: 10,
        sort: 'key',
        query: '',
        category: ''
      },
      categories: [],
      nonChangedCat:[],
      waiting: true
    };
  }

  /**
   * Инициализация параметров.
   * Восстановление из query string адреса
   * @param params
   * @return {Promise<void>}
   */
  async initParams(params = {}){
    // Параметры из URl. Их нужно валидирвать, приводить типы и брать толкьо нужные
    const urlParams = qs.parse(window.location.search, QS_OPTIONS.parse) || {}
    let validParams = {};
    if (urlParams.page) validParams.page = Number(urlParams.page) || 1;
    if (urlParams.limit) validParams.limit = Number(urlParams.limit) || 10;
    if (urlParams.sort) validParams.sort = urlParams.sort;
    if (urlParams.query) validParams.query = urlParams.query;
    if (urlParams.category) validParams.category = urlParams.category || '';

    // Итоговые параметры из начальных, из URL и из переданных явно
    const newParams = {...this.initState().params, ...validParams, ...params};
    // Установка параметров и подгрузка данных
    await this.setParams(newParams, true);
  }

  /**
   * Сброс параметров к начальным
   * @param params
   * @return {Promise<void>}
   */
  async resetParams(params = {}){
    // Итоговые параметры из начальных, из URL и из переданных явно
    const newParams = {...this.initState().params, ...params};
    // Установк параметров и подгрузка данных
    await this.setParams(newParams);
  }

  // convert = (data) => {
  //     // создаем ассоциативный массив с ключами айдишниками и добавляем к элементу поле children
  //     let mapList = {}
  //     data.forEach(item => mapList[item._id] = { ...item, children: [] })
  //     // console.log(mapList)
  //
  //     // собираем дерево
  //     let tree = []
  //     Object.values(mapList).forEach(item => {
  //         if (!item.parent) {
  //             tree.push(item)
  //         } else {
  //             mapList[item.parent._id].children.push(item)
  //         }
  //     })
  //
  //     // обходим дерево рекурсивно и отбираем данные с форматированным title
  //     const treeToFlatList = (tree, level = 0) => {
  //         let result = []
  //         tree.forEach(treeItem => {
  //             let { children, ...item } = treeItem
  //             item.title = '-'.repeat(level) + item.title
  //             result.push(item)
  //             result = result.concat(treeToFlatList(children, level + 1))
  //         })
  //         return result
  //     }
  //
  //     return treeToFlatList(tree)
  // }

  getFullTree = (rootArray) => {
    const getTree = (array, parent = null, inner = 0) => {
      return array.reduce((arr, elem) => {
        if (elem.parent && elem.parent._id !== parent) {
          return arr;
        }

        arr.push({
          ...elem,
          title: `${'-'.repeat(inner)}${elem.title}`,
        });

        const children = rootArray.filter((item) => item.parent && item.parent._id === elem._id);
        if(!children) {
          return arr;
        }
        const childArr = getTree(children, elem._id, inner + 1);
        return arr.concat(childArr);
      }, []);
    }
    return getTree(rootArray);
  }



  async getCategories() {

    const response = await fetch(`api/v1/categories?limit=*&fields=_id,parent,title`);
    const json = await response.json();

    this.setState({
      ...this.getState(),
      categories: this.getFullTree(json.result.items), // две функции на выбор convert || getFullTree обе работают, но различными способами
      nonChangedCat: json.result.items
    });
  }


  /**
   * Загрузка списка товаров
   */
  async setParams(params = {}, historyReplace = false){
    const newParams = {...this.getState().params, ...params};

    this.setState({
      ...this.getState(),
      params: newParams,
      waiting: true
    });

    const skip = (newParams.page - 1) * newParams.limit;
    const response = await fetch(`/api/v1/articles?limit=${newParams.limit}&skip=${skip}&fields=items(*),count&sort=${newParams.sort}${newParams.category}&search[query]=${newParams.query}`);
    const json = await response.json();
    this.setState({
      ...this.getState(),
      items: json.result.items,
      count: json.result.count,
      waiting: false
    });

    // Запоминаем параметры в URL
    let queryString = qs.stringify(newParams, QS_OPTIONS.stringify);
    const url = window.location.pathname + queryString + window.location.hash;
    if (historyReplace) {
      window.history.replaceState({}, '', url);
    } else {
      window.history.pushState({}, '', url);
    }
  }
}

export default CatalogStore;
