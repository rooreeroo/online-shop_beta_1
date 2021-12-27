import StoreModule from "../module";


class CountriesStore extends StoreModule {

    /**
     * Начальное состояние
     */
    initState() {
        return {
            countries: null,
            waiting: true,
        };
    }


    async getCountries() {
        try {
            const response = await fetch('/api/v1/countries?limit=*&fields=_id,title,code&sort=title.ru');
            const json = await response.json();
            this.setState({
                ...this.getState(),
                countries: json.result.items,
                waiting: false
            })
        } catch (e) {
            this.updateState({
                countries: null,
                waiting: false
            });
        }

    }




}
export default CountriesStore;