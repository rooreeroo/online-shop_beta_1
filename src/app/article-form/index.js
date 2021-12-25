import React, {useCallback} from "react";
import Layout from "../../components/layout";
import useStore from "../../utils/use-store";
import useSelector from "../../utils/use-selector";
import {useParams} from "react-router-dom";
import Spinner from "../../components/spinner";
import ArticleRefactor from "../../components/article-refactor";
import Header from "../../containers/header";
import useInit from "../../utils/use-init";

function ArticleForm() {

    const store = useStore();
    // Параметры из пути
    const params = useParams();

    // Начальная загрузка
    useInit(async () => {
        await store.get('article').load(params.id);
    }, [params.id]);
    useInit(async () => {
        await store.get('form').getCountries();
        await store.get('categories').getCategories();
    }, []);

    const select = useSelector(state => ({
        countries: state.form.countries,
        article: state.article.data,
        waiting: state.form.waiting,
        categories: state.categories.nonChangedCat,
    }));
    const options = {
        countries: select.countries,
        categories: select.categories
    }
    const callbacks = {
        putForm: useCallback((_id) => store.form.putForm(_id), [store]),
    }

    return (
        <Layout head={<h1>{select.article.title}</h1>}>

            <Header/>

            <Spinner active={select.waiting}>
                <pre>{JSON.stringify(select.article, null, 4)}</pre>
                <ArticleRefactor options={options}  categories={select.categories} article={select.article} putForm={callbacks.putForm}/>
            </Spinner>
        </Layout>
    );
}

export default React.memo(ArticleForm);
