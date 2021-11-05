export default class LoaderApp {
    static loaderApp

    static setLoaderApp(loaderApp){
        this.loaderApp = loaderApp;
    }

    static isChangeLoaderApp(visible){
        if ( this.loaderApp ){
            this.loaderApp.props.isChangeVisibleLoader(visible)
        }
    }
}
