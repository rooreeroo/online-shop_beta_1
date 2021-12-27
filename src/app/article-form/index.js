import React, {useCallback} from "react";
import Layout from "../../components/layout";
import useStore from "../../utils/use-store";
import useSelector from "../../utils/use-selector";
import {useParams} from "react-router-dom";
import Spinner from "../../components/spinner";
import ArticleRefactor from "../../components/article-refactor";
import Header from "../../containers/header";
import useInit from "../../utils/use-init";
import ErrorForm from "../../components/error-form";

function ArticleForm() {

    const store = useStore();
    // Параметры из пути
    const params = useParams();

    // Начальная загрузка
    useInit(async () => {
        const
            categories = store.get('categories').getCategories(),
            countries = store.get('countries').getCountries(),
            form = store.get('form').load(params.id),
            article = store.get('article').load(params.id);

        const arr =[countries, categories, form, article]
        await Promise.all(arr)
    }, [params.id]);

    const select = useSelector(state => ({
        countries: state.countries.countries,
        data: state.form.data,
        article: state.article.data,
        waiting: state.form.waiting,
        resp: state.form.resp,
        categories: state.categories.categories,
    }));
    const callbacks = {
        onChange: useCallback((name, e) => store.form.setData(name, e), [store]),
        putForm: useCallback((_id) => store.form.putForm(_id), [store]),
    };

    return (
        <Layout head={<h1>{select.article.title}</h1>}>

            <Header/>

            <Spinner active={select.waiting}>
                {select.data && select.countries && select.categories && <ArticleRefactor
                    id={params.id}
                    countries={select.countries}
                    onChange={callbacks.onChange}
                    categories={select.categories}
                    article={select.data}
                    putForm={callbacks.putForm}
                />}
            </Spinner>
            {/*тут должно быть сообщение об ошибке полученное от сервера*/}
            {select.resp && <ErrorForm resp={select.resp}/>}

        </Layout>
    );
}

export default React.memo(ArticleForm);
