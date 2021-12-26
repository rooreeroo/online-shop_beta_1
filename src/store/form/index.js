import StoreModule from "../module";


class FormStore extends StoreModule {

    /**
     * Начальное состояние
     */
    initState() {
        return {
            countries: [],
            data: {},
            waiting: true,
            resp: null,
        };
    }
    reloadWindow = () => {
        window.location.reload();
    };
    setData(prop, e) {
        console.log('prop e', prop, e);
        let local = {...this.getState().data};
        prop === 'category'
            ? local[prop]._id = e
            : prop === 'maidIn'
            ? local[prop]._id = e
            : local[prop] = e;
        this.setState({
            ...this.getState(),
            data: local
        });
        console.log('upData', JSON.stringify(this.getState().data))
    }
    async getCountries() {
        const response = await fetch('/api/v1/countries?limit=*&fields=_id,title,code&sort=title.ru');
        const json = await response.json();
        this.setState({
            ...this.getState(),
            countries: json.result.items,
            waiting: false
        })
    }
    async putForm(data) {
        try {
            const response = await fetch(`/api/v1/articles/${data._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const json = await response.json();
            if (json.error) throw new Error(json.error);
            this.reloadWindow()
        } catch (e) {
            this.setState({
                ...this.getState(),
                resp: e.error
            })
        }

    }
    async load(id){

        this.updateState({
            waiting: true,
            data: {},
        });

        try {
            const response = await fetch(`/api/v1/articles/${id}?fields=_id,title,description,price,maidIn(_id),edition,category(_id)`);
            const json = await response.json();
            if (json.error) throw new Error(json.error);

            this.updateState({
                data: json.result,
                waiting: false
            });
        } catch (e){
            this.updateState({
                ...this.getState(),
                resp: e.json().error,
                waiting: false
            });
        }
    }

}
export default FormStore;