import React from "react";
import Layout from "../../components/layout";
import useStore from "../../utils/use-store";
import Header from "../../containers/header";
import CatalogFilter from "../../containers/catalog-filter";
import CatalogList from "../../containers/catalog-list";
import useInit from "../../utils/use-init";
import useSelector from "../../utils/use-selector";

function Main() {

  const store = useStore();

  // Загрузка тестовых данных при первом рендере
  useInit(async () => {
      const
          categories = store.get('categories').getCategories(),
          params = store.catalog.initParams();
      const arr2 =[params, categories]
      await Promise.all(arr2)
  }, [], {backForward: true});
    const select = useSelector(state => ({
        categories: state.categories.categories,
    }));

  return (
    <Layout head={<h1>Магазин</h1>}>
      <Header/>
        {select.categories && <CatalogFilter/>}
      <CatalogList/>
    </Layout>
  );
}

export default React.memo(Main);
