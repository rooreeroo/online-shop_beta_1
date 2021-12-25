import StoreModule from "../module";


class FormStore extends StoreModule {

    /**
     * Начальное состояние
     */
    initState() {
        return {
            countries: null,
            waiting: true
        };
    }
    reloadWindow = () => {
        window.location.reload();
    }

    async getCountries() {
        const response = await fetch('/api/v1/countries?limit=*&fields=_id,title,code&sort=title.ru')
        const json = await response.json()
        this.updateState({
            countries: json.result.items,
            waiting: false
        })
    }
    async putForm(id) {
        try {
            const response = await fetch(`/api/v1/articles/${id}?fields=%2A&lang=ru`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const json = await response.json()
            if (json.error) throw new Error(json.error);
            console.log('RESPONSE', JSON.stringify(json))
            this.reloadWindow()
        } catch (e) {
            console.log('Error', data)
        }

    }
}
export default FormStore;