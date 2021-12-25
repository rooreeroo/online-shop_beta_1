import React, {useCallback, useMemo} from "react";
import useSelector from "../../utils/use-selector";
import useStore from "../../utils/use-store";
import Select from "../../components/select";
import LayoutTools from "../../components/layout-tools";
import Input from "../../components/input";
import SelectCategory from "../../components/category";
import useInit from "../../utils/use-init";

function CatalogFilter() {

  const store = useStore();

  useInit(async () => {
    await store.get('categories').getCategories()
  });

  const select = useSelector(state => ({
    sort: state.catalog.params.sort,
    query: state.catalog.params.query,
    categories: state.categories.categories,
    category: state.catalog.params.category,
  }));

  // Опции для полей
  const options = {
    sort: useMemo(() => ([
      {value:'key', title: 'По коду'},
      {value:'title.ru', title: 'По именованию'},
      {value:'-price', title: 'Сначала дорогие'},
      {value:'edition', title: 'Древние'},
    ]), []),
    categories: select.categories
  }


  const callbacks = {
    onSort: useCallback(sort => store.catalog.setParams({sort}), [store]),
    onSortCat: useCallback(category => store.catalog.setParams({category}), [store]),
    onSearch: useCallback(query => store.catalog.setParams({query, page: 1}), [store]),
    onReset: useCallback(() => store.catalog.resetParams(), [store])
  }

  return (
    <LayoutTools>
      <SelectCategory onChange={callbacks.onSortCat} value={select.category} options={options.categories}/>
      {/* тут выбор категории*/}
      <Input onChange={callbacks.onSearch} value={select.query} placeholder={'Поиск'} theme="big"/>
      <label>Сортировка:</label>
      <Select onChange={callbacks.onSort} value={select.sort} options={options.sort}/>
      <button onClick={callbacks.onReset}>Сбросить</button>
    </LayoutTools>
  );
}

export default React.memo(CatalogFilter);
